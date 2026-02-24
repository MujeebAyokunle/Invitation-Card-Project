"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2, Tag } from "lucide-react";
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory, type Category } from "@/hooks/useCategories";
import { cn } from "@/lib/utils";

const COLOR_OPTIONS = [
    { value: "burnt-orange", label: "Burnt Orange", class: "bg-burnt-orange" },
    { value: "gold", label: "Gold", class: "bg-gold" },
    { value: "primary", label: "Primary", class: "bg-[hsl(18_70%_47%)]" },
    { value: "muted", label: "Muted", class: "bg-muted" },
    { value: "destructive", label: "Red", class: "bg-destructive" },
    { value: "accent", label: "Accent", class: "bg-accent" },
];

interface CategoryManagementDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    eventId: string;
}

export const CategoryManagementDialog = ({ open, onOpenChange, eventId }: CategoryManagementDialogProps) => {
    const [name, setName] = useState("");
    const [color, setColor] = useState("gold");
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);

    const { data: categories = [], isLoading } = useCategories(eventId);
    const createCategory = useCreateCategory();
    const updateCategory = useUpdateCategory();
    const deleteCategoryMutation = useDeleteCategory();
    const { toast } = useToast();

    const resetForm = () => {
        setName("");
        setColor("gold");
        setEditingCategory(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            toast({
                title: "Name required",
                description: "Please enter a category name.",
                variant: "destructive",
            });
            return;
        }

        try {
            if (editingCategory) {
                await updateCategory.mutateAsync({
                    id: editingCategory.id,
                    name: name.trim(),
                    color,
                    event_id: eventId,
                });
                toast({
                    title: "Category updated",
                    description: `"${name}" has been updated.`,
                });
            } else {
                await createCategory.mutateAsync({
                    event_id: eventId,
                    name: name.trim(),
                    color,
                });
                toast({
                    title: "Category created",
                    description: `"${name}" has been added.`,
                });
            }
            resetForm();
        } catch (error: any) {
            const isDuplicate = error?.message?.includes("duplicate") || error?.code === "23505";
            toast({
                title: "Error",
                description: isDuplicate ? "A category with this name already exists." : "Failed to save category.",
                variant: "destructive",
            });
        }
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setName(category.name);
        setColor(category.color);
    };

    const handleDelete = async () => {
        if (!deleteCategory) return;

        try {
            await deleteCategoryMutation.mutateAsync({
                id: deleteCategory.id,
                event_id: eventId,
            });
            toast({
                title: "Category deleted",
                description: `"${deleteCategory.name}" has been removed.`,
            });
            setDeleteCategory(null);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete category. It may be in use by guests.",
                variant: "destructive",
            });
        }
    };

    const getColorClass = (colorValue: string) => {
        return COLOR_OPTIONS.find(c => c.value === colorValue)?.class || "bg-muted";
    };

    const isPending = createCategory.isPending || updateCategory.isPending;

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="font-display flex items-center gap-2">
                            <Tag className="w-5 h-5" />
                            Manage Categories
                        </DialogTitle>
                        <DialogDescription>
                            Create, edit, or delete guest categories for this event.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Add/Edit Form */}
                    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                        <div className="flex gap-3">
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="categoryName">
                                    {editingCategory ? "Edit Category" : "New Category"}
                                </Label>
                                <Input
                                    id="categoryName"
                                    placeholder="e.g., VIP, Family, Staff"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="w-32 space-y-2">
                                <Label>Color</Label>
                                <Select value={color} onValueChange={setColor}>
                                    <SelectTrigger>
                                        <SelectValue>
                                            <div className="flex items-center gap-2">
                                                <div className={cn("w-3 h-3 rounded-full", getColorClass(color))} />
                                                <span className="capitalize">{COLOR_OPTIONS.find(c => c.value === color)?.label}</span>
                                            </div>
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {COLOR_OPTIONS.map((opt) => (
                                            <SelectItem key={opt.value} value={opt.value}>
                                                <div className="flex items-center gap-2">
                                                    <div className={cn("w-3 h-3 rounded-full", opt.class)} />
                                                    {opt.label}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button type="submit" disabled={isPending} size="sm">
                                {isPending ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : editingCategory ? (
                                    <>
                                        <Pencil className="w-4 h-4 mr-1" />
                                        Update
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4 mr-1" />
                                        Add
                                    </>
                                )}
                            </Button>
                            {editingCategory && (
                                <Button type="button" variant="outline" size="sm" onClick={resetForm}>
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </form>

                    {/* Categories List */}
                    <div className="border-t pt-4 mt-4">
                        <Label className="text-sm text-muted-foreground mb-3 block">
                            Existing Categories ({categories.length})
                        </Label>
                        {isLoading ? (
                            <div className="flex justify-center py-4">
                                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                            </div>
                        ) : categories.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">
                                No categories yet. Add one above.
                            </p>
                        ) : (
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {categories.map((category) => (
                                    <div
                                        key={category.id}
                                        className="flex items-center justify-between p-2 rounded-md border bg-card"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className={cn("w-3 h-3 rounded-full", getColorClass(category.color))} />
                                            <span className="font-medium">{category.name}</span>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => handleEdit(category)}
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive hover:text-destructive"
                                                onClick={() => setDeleteCategory(category)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteCategory} onOpenChange={() => setDeleteCategory(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Category</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{deleteCategory?.name}"?
                            Guests with this category will keep their assignment, but you won't be able to assign it to new guests.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleteCategoryMutation.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                "Delete"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default CategoryManagementDialog;
