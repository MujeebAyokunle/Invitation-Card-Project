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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useCreateGuest, useEvent } from "@/hooks/useGuests";
import { useCategories } from "@/hooks/useCategories";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface AddGuestDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    eventId: string;
}

export const AddGuestDialog = ({ open, onOpenChange, eventId }: AddGuestDialogProps) => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [category, setCategory] = useState("Regular");

    const createGuest = useCreateGuest();
    const { data: event } = useEvent();
    const { data: categories = [] } = useCategories(eventId);
    const { toast } = useToast();

    // Reset to first category if current selection doesn't exist
    useEffect(() => {
        // if (categories.length > 0 && !categories.find(c => c.name === category)) {
        //     setCategory(categories[0].name);
        // }
    }, [categories, category]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            toast({
                title: "Name required",
                description: "Please enter the guest's name.",
                variant: "destructive",
            });
            return;
        }

        try {
            await createGuest.mutateAsync({
                event_id: eventId,
                name: name.trim(),
                phone: phone.trim() || null,
                email: email.trim() || null,
                category,
            });

            toast({
                title: "Guest added",
                description: `${name} has been added to the guest list.`,
            });

            // Reset form
            setName("");
            setPhone("");
            setEmail("");
            // setCategory(categories[0]?.name || "Regular");
            onOpenChange(false);
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to add guest. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-display">Add New Guest</DialogTitle>
                    <DialogDescription>
                        Add a guest to the event. They will receive a unique access card.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Guest Name *</Label>
                            <Input
                                id="name"
                                placeholder="Chief Emeka Okonkwo"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="+234 803 123 4567"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="guest@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                {/* <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.name}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent> */}
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={createGuest.isPending} className="bg-[hsl(18_70%_47%)] hover:bg-[hsl(18_70%_47%)]/90">
                            {createGuest.isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Adding...
                                </>
                            ) : (
                                "Add Guest"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddGuestDialog;