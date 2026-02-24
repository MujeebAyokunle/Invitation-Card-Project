import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
// import { supabase } from "@/integrations/supabase/client";
import type { AppRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";

interface AddOperatorDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export const AddOperatorDialog = ({ open, onOpenChange, onSuccess }: AddOperatorDialogProps) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [role, setRole] = useState<AppRole>("scanner");
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim() || !password.trim()) {
            toast({
                title: "Required fields",
                description: "Email and password are required.",
                variant: "destructive",
            });
            return;
        }

        if (password.length < 6) {
            toast({
                title: "Password too short",
                description: "Password must be at least 6 characters.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        try {            

            // Use edge function to create operator (bypasses signup restrictions)
            const { data, error } = await supabase.functions.invoke("create-operator", {
                body: {
                    email: email.trim(),
                    password,
                    displayName: displayName.trim() || email.split("@")[0],
                    role,
                },
            });

            if (error) throw error;
            if (data?.error) throw new Error(data.error);

            toast({
                title: "Operator added",
                description: `${displayName || email} has been added as a ${role}.`,
            });

            // Reset form
            setEmail("");
            setPassword("");
            setDisplayName("");
            setRole("scanner");
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error("Add operator error:", error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to add operator.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-display">Add Operator</DialogTitle>
                    <DialogDescription>
                        Create a new operator account for scanning or admin access.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="displayName">Display Name</Label>
                            <Input
                                id="displayName"
                                placeholder="John Doe"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="operator@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password *</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Minimum 6 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select value={role} onValueChange={(value) => setRole(value as AppRole)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="scanner">Scanner</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">
                                Scanners can only check-in guests. Admins can manage everything.
                            </p>
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
                                    Creating...
                                </>
                            ) : (
                                "Add Operator"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddOperatorDialog;