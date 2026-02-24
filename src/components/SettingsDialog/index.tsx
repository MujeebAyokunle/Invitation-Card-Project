import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Event } from "@/hooks/useGuests";
import { useQueryClient } from "@tanstack/react-query";
import { useCategories } from "@/hooks/useCategories";
import { CategoryManagementDialog } from "../CategoryManagementDialog";

interface SettingsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    event: Event | null;
}

export const SettingsDialog = ({ open, onOpenChange, event }: SettingsDialogProps) => {
    const [name, setName] = useState("");
    const [honoree, setHonoree] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [venue, setVenue] = useState("");
    const [dressCode, setDressCode] = useState("");
    const [colors, setColors] = useState("");
    const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const { data: categories = [] } = useCategories(event?.id);

    useEffect(() => {
        if (event) {
            setName(event.name || "");
            setHonoree(event.honoree || "");
            setDate(event.date || "");
            setTime(event.time || "");
            setVenue(event.venue || "");
            setDressCode(event.dress_code || "");
            setColors(event.colors || "");
        }
    }, [event]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!event) return;

        setIsLoading(true);
        try {
            const { error } = await supabase
                .from("events")
                .update({
                    name: name.trim(),
                    honoree: honoree.trim(),
                    date,
                    time: time.trim(),
                    venue: venue.trim(),
                    dress_code: dressCode.trim() || null,
                    colors: colors.trim() || null,
                })
                .eq("id", event.id);

            if (error) throw error;

            toast({
                title: "Settings saved",
                description: "Event details have been updated.",
            });

            queryClient.invalidateQueries({ queryKey: ["event"] });
            onOpenChange(false);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save settings. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="font-display">Event Settings</DialogTitle>
                    <DialogDescription>
                        Update the event details that appear on access cards.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                        <div className="space-y-2">
                            <Label htmlFor="name">Event Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="honoree">Honoree</Label>
                            <Input
                                id="honoree"
                                value={honoree}
                                onChange={(e) => setHonoree(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="date">Date</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="time">Time</Label>
                                <Input
                                    id="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    placeholder="4:00PM"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="venue">Venue</Label>
                            <Input
                                id="venue"
                                value={venue}
                                onChange={(e) => setVenue(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dressCode">Dress Code</Label>
                            <Input
                                id="dressCode"
                                value={dressCode}
                                onChange={(e) => setDressCode(e.target.value)}
                                placeholder="Formal"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="colors">Colour Theme</Label>
                            <Input
                                id="colors"
                                value={colors}
                                onChange={(e) => setColors(e.target.value)}
                                placeholder="Burnt Orange / Shades of Gold"
                            />
                        </div>

                        <Separator className="my-4" />

                        {/* Category Management */}
                        <div className="space-y-3">
                            <div>
                                <Label className="text-base">Guest Categories</Label>
                                <p className="text-sm text-muted-foreground">
                                    Manage the categories available for guests at this event.
                                </p>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-md border bg-muted/30">
                                <div className="flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm">
                                        {categories.length} {categories.length === 1 ? "category" : "categories"} configured
                                    </span>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCategoryDialogOpen(true)}
                                >
                                    Manage Categories
                                </Button>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading} className="bg-[hsl(18_70%_47%)] hover:bg-[hsl(18_70%_47%)]/90">
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Settings"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>

            {/* Category Management Dialog */}
            {event && (
                <CategoryManagementDialog
                    open={categoryDialogOpen}
                    onOpenChange={setCategoryDialogOpen}
                    eventId={event.id}
                />
            )}
        </Dialog>
    );
};

export default SettingsDialog;