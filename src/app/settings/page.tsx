"use client"
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ChevronLeft, Tag, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEvent } from "@/hooks/useGuests";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useUserRole";
import { useQueryClient } from "@tanstack/react-query";
import { useCategories } from "@/hooks/useCategories";
import CategoryManagementDialog from "@/components/CategoryManagementDialog";
import FloralCorner from "@/components/FloralCorner";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SettingsPage = () => {
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
    const navigate = useRouter();
    const { user, loading: authLoading } = useAuth();
    const { isAdmin, isLoading: isAdminLoading } = useIsAdmin(user?.id);
    const { data: event, isLoading: eventLoading } = useEvent();
    const { data: categories = [] } = useCategories(event?.id);

    // Auth redirect handled by ProtectedRoute

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

            toast({ title: "Settings saved", description: "Event details have been updated." });
            queryClient.invalidateQueries({ queryKey: ["event"] });
        } catch (error) {
            toast({ title: "Error", description: "Failed to save settings.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    if (authLoading || eventLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-gold animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background relative">
            <FloralCorner position="top-right" size="lg" className="opacity-20 fixed" />
            <FloralCorner position="bottom-left" size="lg" className="opacity-20 fixed" />

            <div className="container max-w-3xl mx-auto px-4 py-6">
                {/* Header */}
                <header className="flex items-center gap-4 mb-8">
                    <Link href="/admin">
                        <Button variant="ghost" size="icon" className="hover:bg-[hsl(43_45%_88%)] cursor-pointer">
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-foreground">
                            Event Settings
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage event details and categories.
                        </p>
                    </div>
                </header>

                {/* Event Details */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="font-display">Event Details</CardTitle>
                        <CardDescription>Update the event information that appears on access cards.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Event Name</Label>
                                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="honoree">Honoree</Label>
                                <Input id="honoree" value={honoree} onChange={(e) => setHonoree(e.target.value)} required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="date">Date</Label>
                                    <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="time">Time</Label>
                                    <Input id="time" value={time} onChange={(e) => setTime(e.target.value)} placeholder="4:00PM" required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="venue">Venue</Label>
                                <Input id="venue" value={venue} onChange={(e) => setVenue(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dressCode">Dress Code</Label>
                                <Input id="dressCode" value={dressCode} onChange={(e) => setDressCode(e.target.value)} placeholder="Formal" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="colors">Colour Theme</Label>
                                <Input id="colors" value={colors} onChange={(e) => setColors(e.target.value)} placeholder="Burnt Orange / Shades of Gold" />
                            </div>
                            <div className="flex justify-end pt-2">
                                <Button type="submit" disabled={isLoading} className="bg-[hsl(18_70%_47%)] hover:bg-[hsl(18_70%_47%)]/90">
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Details
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Categories */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="font-display flex items-center gap-2">
                            <Tag className="w-5 h-5" />
                            Guest Categories
                        </CardTitle>
                        <CardDescription>Manage the categories available for guests at this event.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between p-3 rounded-md border bg-muted/30">
                            <div className="flex items-center gap-2">
                                <Tag className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">
                                    {categories.length} {categories.length === 1 ? "category" : "categories"} configured
                                </span>
                            </div>
                            <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => setCategoryDialogOpen(true)}>
                                Manage Categories
                            </Button>
                        </div>
                    </CardContent>
                </Card>

            </div>

            {/* Dialogs */}
            {event && (
                <>
                    <CategoryManagementDialog
                        open={categoryDialogOpen}
                        onOpenChange={setCategoryDialogOpen}
                        eventId={event.id}
                    />
                </>
            )}
        </div>
    );
};

export default SettingsPage;
