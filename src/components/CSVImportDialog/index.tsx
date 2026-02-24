import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, FileText, AlertCircle } from "lucide-react";
// import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CSVImportDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    eventId: string;
}

interface ParsedGuest {
    name: string;
    phone?: string;
    email?: string;
    category: string;
}

export const CSVImportDialog = ({ open, onOpenChange, eventId }: CSVImportDialogProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [parsedGuests, setParsedGuests] = useState<ParsedGuest[]>([]);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const parseCSV = (content: string): ParsedGuest[] => {
        const lines = content.trim().split("\n");
        if (lines.length < 2) {
            throw new Error("CSV must have a header row and at least one data row");
        }

        const header = lines[0].toLowerCase().split(",").map(h => h.trim());
        const nameIdx = header.findIndex(h => h === "name");
        const phoneIdx = header.findIndex(h => h === "phone" || h === "phone number");
        const emailIdx = header.findIndex(h => h === "email" || h === "email address");
        const categoryIdx = header.findIndex(h => h === "category" || h === "type");

        if (nameIdx === -1) {
            throw new Error("CSV must have a 'name' column");
        }

        const guests: ParsedGuest[] = [];
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(",").map(v => v.trim().replace(/^"|"$/g, ""));
            const name = values[nameIdx];

            if (!name) continue;

            // Default to Regular, but accept any custom category from CSV
            let category = "Regular";
            if (categoryIdx !== -1 && values[categoryIdx]) {
                category = values[categoryIdx].trim();
            }

            guests.push({
                name,
                phone: phoneIdx !== -1 ? values[phoneIdx] || undefined : undefined,
                email: emailIdx !== -1 ? values[emailIdx] || undefined : undefined,
                category,
            });
        }

        return guests;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError(null);
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const content = event.target?.result as string;
                const guests = parseCSV(content);
                if (guests.length === 0) {
                    setError("No valid guests found in CSV");
                    return;
                }
                setParsedGuests(guests);
            } catch (err: any) {
                setError(err.message || "Failed to parse CSV");
            }
        };
        reader.readAsText(file);
    };

    const handleImport = async () => {
        if (parsedGuests.length === 0) return;

        setIsLoading(true);
        try {
            const guestsToInsert = parsedGuests.map(g => ({
                event_id: eventId,
                name: g.name,
                phone: g.phone || null,
                email: g.email || null,
                category: g.category,
            }));

            const { error: insertError } = await supabase
                .from("guests")
                .insert(guestsToInsert);

            if (insertError) throw insertError;

            toast({
                title: "Import successful",
                description: `${parsedGuests.length} guests have been imported.`,
            });

            queryClient.invalidateQueries({ queryKey: ["guests", eventId] });
            queryClient.invalidateQueries({ queryKey: ["check_in_stats", eventId] });
            onOpenChange(false);
            setParsedGuests([]);
        } catch (err: any) {
            toast({
                title: "Import failed",
                description: err.message || "Failed to import guests",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        onOpenChange(false);
        setParsedGuests([]);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="font-display">Import Guests from CSV</DialogTitle>
                    <DialogDescription>
                        Upload a CSV file with columns: name (required), phone, email, category
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    {parsedGuests.length === 0 ? (
                        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                            <FileText className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground mb-3">
                                Select a CSV file to import
                            </p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".csv"
                                onChange={handleFileChange}
                                className="hidden"
                                id="csv-upload"
                            />
                            <Button
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                Choose File
                            </Button>
                            {error && (
                                <p className="text-sm text-destructive mt-3 flex items-center justify-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Ready to import:</span>
                                <span className="font-medium">{parsedGuests.length} guests</span>
                            </div>
                            <div className="max-h-48 overflow-y-auto border rounded-lg">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/50 sticky top-0">
                                        <tr>
                                            <th className="text-left p-2">Name</th>
                                            <th className="text-left p-2">Category</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {parsedGuests.slice(0, 10).map((guest, i) => (
                                            <tr key={i} className="border-t">
                                                <td className="p-2">{guest.name}</td>
                                                <td className="p-2">{guest.category}</td>
                                            </tr>
                                        ))}
                                        {parsedGuests.length > 10 && (
                                            <tr className="border-t">
                                                <td colSpan={2} className="p-2 text-muted-foreground text-center">
                                                    ... and {parsedGuests.length - 10} more
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose}>
                        Cancel
                    </Button>
                    {parsedGuests.length > 0 && (
                        <Button
                            onClick={handleImport}
                            disabled={isLoading}
                            className="bg-[hsl(18_70%_47%)] hover:bg-[hsl(18_70%_47%)]/90"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Importing...
                                </>
                            ) : (
                                `Import ${parsedGuests.length} Guests`
                            )}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CSVImportDialog;