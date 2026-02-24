import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type CreateEventDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
};

export const CreateEventDialog = ({
    open,
    onOpenChange,
    onSuccess,
}: CreateEventDialogProps) => {

    const { toast } = useToast();

    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [venue, setVenue] = useState("");
    const [honoree, setHonoree] = useState("");
    const [dressCode, setDressCode] = useState("");
    const [colors, setColors] = useState("");
    const [enabledCategories, setEnabledCategories] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            toast({
                title: "Required field",
                description: "Event name is required.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            // Use edge function to create operator (bypasses signup restrictions)
            const { data, error } = await supabase.functions.invoke("create-event", {
                body: {
                    "name": name.trim(),
                    "date": date || null,
                    "time": time || null,
                    "venue": venue.trim() || null,
                    "honoree": honoree.trim() || null,
                    "dress_code": dressCode.trim() || null,
                    "colors": colors.trim() || null,
                    "enabled_categories": enabledCategories.trim() || null
                },
            });

            if (error) throw error;
            if (data?.error) throw new Error(data.error);

            toast({
                title: "Event created",
                description: `${name} has been created successfully.`,
            });

            // Reset form
            setName("");
            setDate("");
            setTime("");
            setVenue("");
            setHonoree("");
            setDressCode("");
            setColors("");
            setEnabledCategories("");

            onSuccess();
            onOpenChange(false);

        } catch (error: any) {
            console.error(error);

            toast({
                title: "Error",
                description:
                    error?.message || "Failed to create event.",
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
                    <DialogTitle className="font-display">
                        Create Event
                    </DialogTitle>
                    <DialogDescription>
                        Add a new event to your platform.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">

                        <div className="space-y-2">
                            <Label>Event Name *</Label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Wedding Ceremony"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Date</Label>
                                <Input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Time</Label>
                                <Input
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Venue</Label>
                            <Input
                                value={venue}
                                onChange={(e) => setVenue(e.target.value)}
                                placeholder="Grand Hall"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Honoree</Label>
                            <Input
                                value={honoree}
                                onChange={(e) => setHonoree(e.target.value)}
                                placeholder="Bride & Groom"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Dress Code</Label>
                            <Input
                                value={dressCode}
                                onChange={(e) => setDressCode(e.target.value)}
                                placeholder="Traditional attire"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Colors</Label>
                            <Input
                                value={colors}
                                onChange={(e) => setColors(e.target.value)}
                                placeholder="Gold & Burgundy"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Enabled Categories</Label>
                            <Input
                                value={enabledCategories}
                                onChange={(e) =>
                                    setEnabledCategories(e.target.value)
                                }
                                placeholder="VIP, Regular"
                            />
                        </div>

                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-[hsl(18_70%_47%)] hover:bg-[hsl(18_70%_47%)]/90"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create Event"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};