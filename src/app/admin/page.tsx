"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import FloralCorner from "@/components/FloralCorner";
import AddGuestDialog from "@/components/AddGuestDialog";
import CSVImportDialog from "@/components/CSVImportDialog";
import AddOperatorDialog from "@/components/AddOperatorDialog";
import ResetPasswordDialog from "@/components/ResetPasswordDialog";
import SettingsDialog from "@/components/SettingsDialog";
import {
    Users,
    UserPlus,
    Search,
    Download,
    Upload,
    ChevronLeft,
    BarChart3,
    Settings,
    CheckCircle2,
    Clock,
    QrCode,
    LogOut,
    Loader2,
    Trash2,
    KeyRound
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEvent, useGuests, useCheckInStats, useCheckIns, useDeleteGuest } from "@/hooks/useGuests";
import { useOperators, type Operator } from "@/hooks/useOperators";
import { useIsAdmin } from "@/hooks/useUserRole";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useRouter } from 'next/navigation'
import Link from "next/link";

const AdminDashboard = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTab, setSelectedTab] = useState("overview");
    const [showAddGuest, setShowAddGuest] = useState(false);
    const [showCSVImport, setShowCSVImport] = useState(false);
    const [showAddOperator, setShowAddOperator] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);
    const [togglingOperator, setTogglingOperator] = useState<string | null>(null);
    const navigate = useRouter();
    const { user, loading: authLoading, signOut } = useAuth();
    const { toast } = useToast();

    const { data: event, isLoading: eventLoading } = useEvent();
    const { data: guests = [], isLoading: guestsLoading } = useGuests(event?.id);
    const { data: stats, isLoading: statsLoading } = useCheckInStats(event?.id);
    const { data: checkIns = [] } = useCheckIns(event?.id);
    const { data: operators = [], refetch: refetchOperators } = useOperators();
    const { isAdmin, isLoading: isAdminLoading } = useIsAdmin(user?.id);
    const deleteGuest = useDeleteGuest();

    // Create a set of checked-in guest IDs for quick lookup
    const checkedInGuestIds = new Set(checkIns.map(c => c.guest_id));

    useEffect(() => {
        if (!authLoading && !user) {
            navigate.push("/login");
        }

    }, [user, authLoading, navigate]); 

    const filteredGuests = guests.filter(guest =>
        guest.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSignOut = async () => {
        await signOut();
        navigate.push("/login");
    };

    const handleExport = () => {
        if (guests.length === 0) {
            toast({
                title: "No guests",
                description: "There are no guests to export.",
                variant: "destructive",
            });
            return;
        }

        const headers = ["Name", "Category", "Phone", "Email", "Status", "Access Token"];
        const rows = guests.map(guest => [
            guest.name,
            guest.category,
            guest.phone || "",
            guest.email || "",
            checkedInGuestIds.has(guest.id) ? "Checked In" : "Not Checked In",
            guest.access_token,
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `guests-export-${new Date().toISOString().split("T")[0]}.csv`;
        link.click();

        toast({
            title: "Export complete",
            description: `${guests.length} guests exported to CSV.`,
        });
    };

    const handleDeleteGuest = async (guestId: string, guestName: string) => {
        if (!event) return;
        if (!confirm(`Are you sure you want to delete ${guestName}?`)) return;

        // try {
        //     await deleteGuest.mutateAsync({ id: guestId, eventId: event.id });
        //     toast({
        //         title: "Guest deleted",
        //         description: `${guestName} has been removed.`,
        //     });
        // } catch (error) {
        //     toast({
        //         title: "Error",
        //         description: "Failed to delete guest.",
        //         variant: "destructive",
        //     });
        // }
    };

    const handleToggleOperator = async (operator: Operator, enabled: boolean) => {
        if (operator.user_id === user?.id) {
            toast({
                title: "Cannot disable yourself",
                description: "You cannot disable your own account.",
                variant: "destructive",
            });
            return;
        }

        setTogglingOperator(operator.user_id);
        try {
            const { data, error } = await supabase.functions.invoke("toggle-operator", {
                body: { userId: operator.user_id, enabled },
            });

            if (error) throw error;
            if (data?.error) throw new Error(data.error);

            toast({
                title: enabled ? "Operator enabled" : "Operator disabled",
                description: `${operator.display_name || "Operator"} has been ${enabled ? "enabled" : "disabled"}.`,
            });
            refetchOperators();
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to toggle operator.",
                variant: "destructive",
            });
        } finally {
            setTogglingOperator(null);
        }
    };

    const handleResetPassword = (operator: Operator) => {
        setSelectedOperator(operator);
        setShowResetPassword(true);
    };

    if (authLoading || eventLoading) {
        return (
            <div className="min-h-screen bg-[hsl(36_47%_97%)] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[hsl(43_55%_58%)] animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[hsl(36_47%_97%)] relative">
            {/* Subtle background decorations */}
            <FloralCorner position="top-right" size="lg" className="opacity-20 fixed" />
            <FloralCorner position="bottom-left" size="lg" className="opacity-20 fixed" />

            <div className="container max-w-6xl mx-auto px-4 py-6">
                {/* Header */}
                <header className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <Button variant="ghost" size="icon" className="hover:bg-[hsl(43_45%_88%)]">
                                <ChevronLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[hsl(30_25%_20%)]">
                                Admin Dashboard
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {/* {event?.name || "Event Management"} */}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="hidden sm:flex cursor-pointer"
                            onClick={() => {
                                // setShowSettings(true)
                                navigate.push("/settings")
                            }}
                        >
                            <Settings className="w-4 h-4 mr-2" />
                            Settings
                        </Button>
                        <Button variant="ghost" size="sm" className="cursor-pointer" onClick={handleSignOut}>
                            <LogOut className="w-4 h-4 mr-0" />
                            Sign Out
                        </Button>
                        <Button
                            variant="default"
                            size="sm"
                            className={
                                "bg-[hsl(18_70%_47%)] hover:bg-[hsl(18_70%_47%)]/90 cursor-pointer"
                                // (!isAdmin && !isAdminLoading ? "opacity-60" : "")
                            }
                            aria-disabled={!isAdmin && !isAdminLoading}
                            onClick={() => {
                                if (isAdminLoading) {
                                    toast({
                                        title: "Please wait",
                                        description: "Checking your permissions…",
                                    });
                                    return;
                                }
                                if (!isAdmin) {
                                    toast({
                                        title: "Admin only",
                                        description: "You don't have permission to add guests.",
                                        variant: "destructive",
                                    });
                                    return;
                                }
                                setShowAddGuest(true);
                            }}
                        >
                            <UserPlus className="w-4 h-4 mr-0" />
                            Add Guest
                        </Button>
                    </div>
                </header>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    <Card className="border-border">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-[hsl(30_15%_50%)] uppercase tracking-wide">Total Guests</p>
                                    <p className="text-2xl font-display font-bold text-[hsl(30_25%_20%)]">{0}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-[hsl(43_45%_88%)] flex items-center justify-center">
                                    <Users className="w-5 h-5 text-[hsl(35_45%_45%)]" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Checked In</p>
                                    <p className="text-2xl font-display font-bold text-[hsl(18_70%_47%)]">{0}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-[hsl(18_70%_47%)]/10 flex items-center justify-center">
                                    <CheckCircle2 className="w-5 h-5 text-[hsl(18_70%_47%)]" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide">VIP Guests</p>
                                    <p className="text-2xl font-display font-bold text-[hsl(35_45%_45%)]">{0}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                                    <BarChart3 className="w-5 h-5 text-[hsl(35_45%_45%)]" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Pending</p>
                                    <p className="text-2xl font-display font-bold text-muted-foreground">{0}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-muted-foreground" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Tabs */}
                <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                        <TabsTrigger value="overview">Guest List</TabsTrigger>
                        <TabsTrigger value="operators">Operators</TabsTrigger>
                        <TabsTrigger value="reports">Reports</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                        {/* Search and Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-between">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search guests..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => setShowCSVImport(true)}>
                                    <Upload className="w-4 h-4 mr-2" />
                                    Import CSV
                                </Button>
                                <Button variant="outline" size="sm" onClick={handleExport}>
                                    <Download className="w-4 h-4 mr-2" />
                                    Export
                                </Button>
                            </div>
                        </div>

                        {/* Guest List */}
                        <Card>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-muted/50">
                                            <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                                                <th className="p-4">Guest Name</th>
                                                <th className="p-4">Category</th>
                                                <th className="p-4 hidden sm:table-cell">Contact</th>
                                                <th className="p-4">Status</th>
                                                <th className="p-4">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                // guestsLoading ? (
                                                //     <tr>
                                                //         <td colSpan={5} className="p-8 text-center">
                                                //             <Loader2 className="w-6 h-6 mx-auto text-gold animate-spin" />
                                                //         </td>
                                                //     </tr>
                                                // ) : 
                                                filteredGuests.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                                            {searchTerm ? "No guests match your search" : "No guests added yet"}
                                                        </td>
                                                    </tr>
                                                ) : filteredGuests.map((guest: any) => (
                                                    <tr key={guest.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                                                        <td className="p-4">
                                                            <p className="font-medium text-[hsl(30_25%_20%)]">{guest.name}</p>
                                                            <p className="text-xs text-muted-foreground sm:hidden">{guest.phone}</p>
                                                        </td>
                                                        <td className="p-4">
                                                            <Badge variant={guest.category === "VIP" ? "default" : "secondary"} className={
                                                                guest.category === "VIP" ? "bg-burnt-orange text-[hsl(38_50%_96%)]" :
                                                                    guest.category === "Family" ? "bg-[hsl(18_70%_47%)] text-[hsl(38_50%_96%)]" :
                                                                        "bg-[hsl(43_45%_88%)] text-[hsl(35_35%_30%)]"
                                                            }>
                                                                {guest.category}
                                                            </Badge>
                                                        </td>
                                                        <td className="p-4 hidden sm:table-cell">
                                                            <p className="text-sm text-[hsl(30_25%_20%)]">{guest.phone}</p>
                                                            <p className="text-xs text-muted-foreground">{guest.email}</p>
                                                        </td>
                                                        <td className="p-4">
                                                            {
                                                                checkedInGuestIds.has(guest.id) ? (
                                                                    <div className="flex items-center gap-1 text-[hsl(18_70%_47%)]">
                                                                        <CheckCircle2 className="w-4 h-4" />
                                                                        <span className="text-xs">Checked In</span>
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-xs text-muted-foreground">Not checked in</span>
                                                                )}
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="flex items-center gap-2">
                                                                <Link href={`/card/${guest.access_token}`} target="_blank">
                                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                        <QrCode className="w-4 h-4" />
                                                                    </Button>
                                                                </Link>
                                                                {true && (
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-8 w-8 text-destructive hover:text-destructive"
                                                                        onClick={() => handleDeleteGuest(guest.id, guest.name)}
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="operators">
                        <Card>
                            <CardHeader>
                                <CardTitle>Scanner Operators</CardTitle>
                                <CardDescription>Manage staff who can scan QR codes at check-in</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {
                                    operators.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                            <p>No operators added yet</p>
                                            <Button
                                                className="mt-4 bg-[hsl(18_70%_47%)] hover:bg-[hsl(18_70%_47%)]/90"
                                                onClick={() => setShowAddOperator(true)}
                                            >
                                                <UserPlus className="w-4 h-4 mr-2" />
                                                Add Operator
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="flex justify-end">
                                                <Button
                                                    size="sm"
                                                    className="bg-[hsl(18_70%_47%)] hover:bg-[hsl(18_70%_47%)]/90"
                                                    onClick={() => setShowAddOperator(true)}
                                                >
                                                    <UserPlus className="w-4 h-4 mr-2" />
                                                    Add Operator
                                                </Button>
                                            </div>
                                            <div className="border rounded-lg overflow-hidden">
                                                <table className="w-full">
                                                    <thead className="bg-muted/50">
                                                        <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                                                            <th className="p-4">Name</th>
                                                            <th className="p-4">Role</th>
                                                            <th className="p-4">Added</th>
                                                            <th className="p-4">Status</th>
                                                            <th className="p-4">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            operators.map((op) => {
                                                                return (
                                                                    <tr key={op.id} className="border-t border-border hover:bg-muted/30">
                                                                        <td className="p-4 font-medium">{op.display_name || "Unknown"}</td>
                                                                        <td className="p-4">
                                                                            <Badge variant={op.role === "admin" ? "default" : "secondary"}>
                                                                                {op.role}
                                                                            </Badge>
                                                                        </td>
                                                                        <td className="p-4 text-sm text-muted-foreground">
                                                                            {new Date(op.created_at).toLocaleDateString()}
                                                                        </td>
                                                                        <td className="p-4">
                                                                            <Switch
                                                                                checked={true}
                                                                                disabled={op.user_id === user?.id || togglingOperator === op.user_id}
                                                                                onCheckedChange={(checked) => handleToggleOperator(op, checked)}
                                                                            />
                                                                        </td>
                                                                        <td className="p-4">
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                className="h-8 w-8"
                                                                                onClick={() => handleResetPassword(op)}
                                                                                title="Reset password"
                                                                            >
                                                                                <KeyRound className="w-4 h-4" />
                                                                            </Button>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="reports">
                        <Card>
                            <CardHeader>
                                <CardTitle>Attendance Reports</CardTitle>
                                <CardDescription>Download and view check-in statistics</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        <div className="text-center p-4 border rounded-lg">
                                            <p className="text-2xl font-bold text-[hsl(30_25%_20%)]">{0}</p>
                                            <p className="text-xs text-muted-foreground">Total Invited</p>
                                        </div>
                                        <div className="text-center p-4 border rounded-lg">
                                            <p className="text-2xl font-bold text-[hsl(18_70%_47%)]">{0}</p>
                                            <p className="text-xs text-muted-foreground">Checked In</p>
                                        </div>
                                        <div className="text-center p-4 border rounded-lg">
                                            <p className="text-2xl font-bold text-[hsl(35_45%_45%)]">{0}</p>
                                            <p className="text-xs text-muted-foreground">VIP Guests</p>
                                        </div>
                                        <div className="text-center p-4 border rounded-lg">
                                            <p className="text-2xl font-bold text-muted-foreground">{0}</p>
                                            <p className="text-xs text-muted-foreground">Pending</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-center">
                                        <Button variant="outline" onClick={handleExport}>
                                            <Download className="w-4 h-4 mr-2" />
                                            Export Guest List
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Add Guest Dialog */}
            {event && (
                <>
                    <AddGuestDialog
                        open={showAddGuest}
                        onOpenChange={setShowAddGuest}
                        eventId={"1"}
                    />
                    <CSVImportDialog
                        open={showCSVImport}
                        onOpenChange={setShowCSVImport}
                        eventId={"event.id"}
                    />
                    <SettingsDialog
                        open={showSettings}
                        onOpenChange={setShowSettings}
                        event={{ id: "1", name: "Sample Event", venue: "Sample Venue, City" } as any}
                    />
                </>
            )}

            {/* Add Operator Dialog */}
            <AddOperatorDialog
                open={showAddOperator}
                onOpenChange={setShowAddOperator}
                onSuccess={() => null}
            />

            {/* Reset Password Dialog */}
            <ResetPasswordDialog
                open={showResetPassword}
                onOpenChange={setShowResetPassword}
                operator={selectedOperator}
            />
        </div>
    );
};

export default AdminDashboard;
