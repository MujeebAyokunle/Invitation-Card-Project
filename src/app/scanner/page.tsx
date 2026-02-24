"use client"
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import FloralDivider from "@/components/FloralDivider";
import {
    ChevronLeft,
    Camera,
    CheckCircle2,
    XCircle,
    RefreshCw,
    User,
    Clock,
    Loader2,
    Keyboard
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEvent, useCheckInStats, useCreateCheckIn } from "@/hooks/useGuests";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";


type ScanState = "idle" | "scanning" | "success" | "error" | "duplicate";

interface ScanResult {
    guestName: string;
    category: string;
    checkedInAt?: string;
}

const Scanner = () => {
    const [scanState, setScanState] = useState<ScanState>("idle");
    const [lastScan, setLastScan] = useState<ScanResult | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [showManualEntry, setShowManualEntry] = useState(false);
    const [manualCode, setManualCode] = useState("");
    const [isProcessingManual, setIsProcessingManual] = useState(false);
    const scannerRef = useRef<any>(null);
    const navigate = useRouter();
    const { user, loading: authLoading } = useAuth();
    const { toast } = useToast();

    const { data: event } = useEvent();
    const { data: stats, refetch: refetchStats } = useCheckInStats("event?.id");
    const createCheckIn = useCreateCheckIn();

    useEffect(() => {
        if (!authLoading && !user) {
            navigate.push("/login");
        }
    }, [user, authLoading, navigate]);

    // Initialize QR Scanner
    const startScanning = async () => {
        setIsScanning(true);
        setScanState("scanning");

        try {
            const { Html5Qrcode } = await import("html5-qrcode");

            const scanner = new Html5Qrcode("qr-reader");
            scannerRef.current = scanner;

            await scanner.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                },
                async (decodedText) => {
                    // Stop scanner immediately
                    await scanner.stop();
                    setIsScanning(false);

                    // Process the scanned code
                    await processQRCode(decodedText);
                },
                () => {
                    // QR code not detected, continue scanning
                }
            );
        } catch (err) {
            console.error("Failed to start scanner:", err);
            setIsScanning(false);
            setScanState("error");
            toast({
                title: "Camera Error",
                description: "Could not access camera. Please check permissions.",
                variant: "destructive",
            });
        }
    };

    const processQRCode = async (qrData: string) => {
        setScanState("scanning");

        try {
            // Extract token from QR code (assuming format: https://event.example.com/verify/{token} or just {token})
            // Extract token from QR code URL or use directly
            let token = qrData;
            if (qrData.includes("/")) {
                token = qrData.split("/").pop() || "";
            }

            // Check if this is a short code (8 chars) or full token
            const isShortCode = token.length === 8;

            if (!token || token.length < 8) {
                setScanState("error");
                return;
            }

            // Look up guest using secure RPC (excludes PII: email, phone)
            // const { data: lookupData, error: guestError } = await supabase
            //     .rpc("lookup_guest_for_checkin", { _token: token });

            // if (guestError) {
            //     console.error("Guest lookup error:", guestError);
            // }

            // const guest = lookupData && lookupData.length > 0 ? lookupData[0] : null;

            // if (!guest) {
            //     setScanState("error");
            //     setLastScan(null);
            //     return;
            // }

            // Check if already checked in
            // const { data: existingCheckIn } = await supabase
            //     .from("check_ins")
            //     .select("*")
            //     .eq("guest_id", guest.id)
            //     .maybeSingle();

            // if (existingCheckIn) {
            //     setScanState("duplicate");
            //     setLastScan({
            //         guestName: guest.name,
            //         category: guest.category,
            //         checkedInAt: new Date(existingCheckIn.checked_in_at).toLocaleTimeString("en-US", {
            //             hour: "numeric",
            //             minute: "2-digit",
            //         }),
            //     });
            //     // Play error sound
            //     playSound("error");
            //     return;
            // }

            // Create check-in
            // await createCheckIn.mutateAsync({
            //     guestId: guest.id,
            //     scannedBy: user?.id,
            // });

            setScanState("success");
            // setLastScan({
            //     guestName: guest.name,
            //     category: guest.category,
            //     checkedInAt: new Date().toLocaleTimeString("en-US", {
            //         hour: "numeric",
            //         minute: "2-digit",
            //     }),
            // });

            // Refetch stats
            refetchStats();

            // Play success sound
            playSound("success");

        } catch (err) {
            console.error("Error processing QR code:", err);
            setScanState("error");
            setLastScan(null);
        }
    };

    const playSound = (type: "success" | "error") => {
        // Create audio context for feedback sounds
        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            if (type === "success") {
                oscillator.frequency.value = 800;
                gainNode.gain.value = 0.3;
            } else {
                oscillator.frequency.value = 300;
                gainNode.gain.value = 0.2;
            }

            oscillator.start();
            setTimeout(() => {
                oscillator.stop();
                audioContext.close();
            }, 150);
        } catch (err) {
            // Audio not supported, ignore
        }
    };

    const stopScanning = async () => {
        if (scannerRef.current) {
            try {
                await scannerRef.current.stop();
            } catch (err) {
                // Ignore stop errors
            }
        }
        setIsScanning(false);
    };

    const processManualCode = async () => {
        const code = manualCode.trim().toUpperCase();
        if (code.length !== 8) {
            toast({
                title: "Invalid Code",
                description: "Please enter an 8-character access code.",
                variant: "destructive",
            });
            return;
        }

        setIsProcessingManual(true);
        await processQRCode(code);
        setIsProcessingManual(false);
        setManualCode("");
        setShowManualEntry(false);
    };

    const resetScanner = async () => {
        await stopScanning();
        setScanState("idle");
        setLastScan(null);
        setShowManualEntry(false);
        setManualCode("");
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopScanning();
        };
    }, []);

    if (authLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-gold animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="hover:bg-[hsl(43_45%_88%)] cursor-pointer">
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="font-display text-lg font-semibold text-foreground">
                            QR Scanner
                        </h1>
                        {/* <p className="text-xs text-muted-foreground">
                            80th Birthday Celebration
                        </p> */}
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    Online
                </div>
            </header>

            {/* Scanner Area */}
            <div className="flex-1 flex flex-col items-center justify-center p-4">
                {/* Camera Viewfinder */}
                <div className="relative w-full max-w-sm aspect-square mb-6">
                    <div className={`
            w-full h-full rounded-2xl border-2 overflow-hidden
            ${scanState === "success" ? "border-accent bg-accent/10" :
                            scanState === "error" ? "border-destructive bg-destructive/10" :
                                scanState === "duplicate" ? "border-[hsl(18_70%_47%)] bg-[hsl(18_70%_47%)]/10" :
                                    "border-gold bg-card"}
          `}>
                        {/* QR Scanner container */}
                        <div id="qr-reader" className="w-full h-full" />

                        {/* Overlay content */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            {scanState === "idle" && !isScanning && (
                                <div className="text-center">
                                    <Camera className="w-16 h-16 mx-auto mb-4 text-gold-dark opacity-50" />
                                    <p className="text-sm text-muted-foreground">
                                        Tap to start scanning
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Point at guest's QR code
                                    </p>
                                </div>
                            )}

                            {(scanState === "scanning" && !isScanning) && (
                                <div className="text-center">
                                    <RefreshCw className="w-12 h-12 mx-auto mb-3 text-gold animate-spin" />
                                    <p className="text-sm text-muted-foreground">Processing...</p>
                                </div>
                            )}

                            {scanState === "success" && (
                                <div className="text-center success-pulse">
                                    <CheckCircle2 className="w-16 h-16 mx-auto mb-3 text-accent" />
                                    <p className="text-lg font-display font-semibold text-gold-dark">
                                        Check-in Successful!
                                    </p>
                                </div>
                            )}

                            {scanState === "error" && (
                                <div className="text-center">
                                    <XCircle className="w-16 h-16 mx-auto mb-3 text-destructive" />
                                    <p className="text-lg font-display font-semibold text-destructive">
                                        Invalid QR Code
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        This code is not recognized
                                    </p>
                                </div>
                            )}

                            {scanState === "duplicate" && (
                                <div className="text-center">
                                    <XCircle className="w-16 h-16 mx-auto mb-3 text-[hsl(18_70%_47%)]" />
                                    <p className="text-lg font-display font-semibold text-[hsl(18_70%_47%)]">
                                        Already Checked In
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Corner brackets */}
                        {scanState === "idle" && (
                            <>
                                <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-gold" />
                                <div className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-gold" />
                                <div className="absolute bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-gold" />
                                <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-gold" />
                            </>
                        )}

                        {/* Scan line animation */}
                        {scanState === "scanning" && (
                            <div className="absolute inset-x-8 top-0 h-full overflow-hidden">
                                <div className="w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent scan-animation" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Guest Result Card */}
                {lastScan && (scanState === "success" || scanState === "duplicate") && (
                    <Card className="w-full max-w-sm mb-6 border-border">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-[hsl(43_45%_88%)] flex items-center justify-center">
                                    <User className="w-6 h-6 text-gold-dark" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-display text-lg font-semibold text-foreground">
                                        {lastScan.guestName}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`
                      px-2 py-0.5 text-xs rounded-full font-sans
                      ${lastScan.category === "VIP"
                                                ? "bg-burnt-orange text-[hsl(38_50%_96%)]"
                                                : "bg-[hsl(43_45%_88%)] text-secondary-foreground"}
                    `}>
                                            {lastScan.category}
                                        </span>
                                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Clock className="w-3 h-3" />
                                            {lastScan.checkedInAt}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Action Buttons */}
                <div className="w-full max-w-sm space-y-3">
                    {(scanState === "success" || scanState === "error" || scanState === "duplicate") ? (
                        <Button
                            onClick={resetScanner}
                            className="w-full h-14 cursor-pointer text-lg bg-[hsl(18_70%_47%)] hover:bg-[hsl(18_70%_47%)]/90"
                        >
                            <Camera className="w-5 h-5 mr-2" />
                            Scan Next Guest
                        </Button>
                    ) : scanState === "idle" && !isScanning ? (
                        <Button
                            onClick={startScanning}
                            className="w-full cursor-pointer h-14 text-lg bg-gold hover:bg-gold/90 text-accent-foreground"
                        >
                            <Camera className="w-5 h-5 mr-2" />
                            Start Scanning
                        </Button>
                    ) : isScanning ? (
                        <Button
                            onClick={stopScanning}
                            variant="outline"
                            className="w-full h-14 text-lg cursor-pointer"
                        >
                            Stop Scanning
                        </Button>
                    ) : null}

                    {/* Manual Entry Toggle */}
                    {(scanState === "idle" && !isScanning) && (
                        <Button
                            variant="ghost"
                            onClick={() => setShowManualEntry(!showManualEntry)}
                            className="w-full text-muted-foreground cursor-pointer"
                        >
                            <Keyboard className="w-4 h-4 mr-2" />
                            {showManualEntry ? "Hide Manual Entry" : "Enter Code Manually"}
                        </Button>
                    )}

                    {/* Manual Entry Form */}
                    {showManualEntry && scanState === "idle" && !isScanning && (
                        <Card className="w-full border-border">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Manual Entry</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Input
                                    placeholder="Enter 8-character code"
                                    value={manualCode}
                                    onChange={(e) => setManualCode(e.target.value.slice(0, 8).toUpperCase())}
                                    className="font-mono text-center text-lg tracking-[0.2em] uppercase"
                                    maxLength={8}
                                />
                                <Button
                                    onClick={processManualCode}
                                    disabled={manualCode.length !== 8 || isProcessingManual}
                                    className="w-full cursor-pointer"
                                >
                                    {isProcessingManual ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Verifying...
                                        </>
                                    ) : (
                                        "Verify Code"
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Divider */}
                <FloralDivider className="mt-8 opacity-50" />

                {/* Stats footer */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                        Today's check-ins: <span className="font-semibold text-foreground">{stats?.checkedIn || 0}</span> / {stats?.total || 0}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Scanner;
