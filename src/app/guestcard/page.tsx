"use client"
import { useRef, useState } from "react";
// import { useParams, Link } from "react-router-dom";
import domtoimage from "dom-to-image-more";
import AccessCard from "@/components/AccessCard";
import { Button } from "@/components/ui/button";
import { Share2, Loader2, AlertCircle, Download, MessageCircle } from "lucide-react";
import { useGuestByToken } from "@/hooks/useGuests";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";
import Link from "next/link";

const GuestCardPage = () => {
    const params = useParams();
    const token = params?.token as string;
    const { data: guestData, isLoading, error } = useGuestByToken(token);
    const cardRef = useRef<HTMLDivElement>(null);
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    // Get first 8 characters of access token as manual entry code
    const accessCode = guestData?.access_token?.slice(0, 8) || "";

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: guestData ? `${guestData.events.name} - Access Card` : "Event Access Card",
                    text: guestData ? `Access card for ${guestData.name}` : "My event access card",
                    url: window.location.href,
                });
            } catch (err) {
                console.log("Share cancelled or failed");
            }
        } else {
            // Fallback: copy link to clipboard
            navigator.clipboard.writeText(window.location.href);
            toast({
                title: "Link copied",
                description: "Card link has been copied to clipboard.",
            });
        }
    };

    const handleWhatsAppShare = () => {
        const text = guestData
            ? `🎉 ${guestData.events.name}\n\nHi ${guestData.name},\n\nHere's your access card for the event:\n${window.location.href}\n\n📍 ${guestData.events.venue}\n📅 ${new Date(guestData.events.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}\n⏰ ${guestData.events.time}`
            : `Here's your event access card: ${window.location.href}`;

        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, "_blank");
    };

    const handleSaveAsPng = async () => {
        if (!cardRef.current) return;

        setIsSaving(true);
        try {
            const node = cardRef.current;

            // Temporarily neutralise Tailwind's global `* { border-color }` rule
            // which dom-to-image renders as visible borders on every element.
            const resetClass = "png-export-reset";
            node.classList.add(resetClass);

            const scale = Math.min(4, Math.max(2, Math.round((window.devicePixelRatio || 1) * 2)));
            const width = node.offsetWidth * scale;
            const height = node.offsetHeight * scale;

            const dataUrl = await domtoimage.toPng(node, {
                width,
                height,
                style: {
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                },
                quality: 1,
            });

            node.classList.remove(resetClass);

            const link = document.createElement("a");
            link.download = `access-card-${guestData?.name?.replace(/\s+/g, "-").toLowerCase() || "guest"}.png`;
            link.href = dataUrl;
            link.click();

            toast({
                title: "Card saved",
                description: "Access card has been downloaded as PNG.",
            });
        } catch (err) {
            console.error("Failed to save card:", err);
            toast({
                title: "Error",
                description: "Failed to save card. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 mx-auto mb-4 text-gold animate-spin" />
                    <p className="text-muted-foreground">Loading your access card...</p>
                </div>
            </div>
        );
    }

    if (error || !guestData) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
                    <h1 className="font-display text-2xl font-semibold text-foreground mb-2">
                        Card Not Found
                    </h1>
                    <p className="text-muted-foreground mb-6">
                        This access card link is invalid or has expired. Please contact the event organizers for assistance.
                    </p>
                    <Link href="/">
                        <Button className="cursor-pointer" variant="outline">Return to Home</Button>
                    </Link>
                </div>
            </div>
        );
    }

    // Format the date nicely
    const eventDate = new Date(guestData.events.date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-sm">
                {/* Access Card */}
                <div ref={cardRef}>
                    <AccessCard
                        guestName={guestData.name}
                        guestCategory={guestData.category}
                        qrCodeValue={window.location.href}
                        accessCode={accessCode}
                        dressCode={guestData.events.dress_code || undefined}
                    />
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                    {/* Primary Actions */}
                    <div className="flex justify-center gap-2">
                        <Button
                            onClick={handleWhatsAppShare}
                            size="sm"
                            className="gap-2 bg-[#25D366] hover:bg-[#1da851] text-white"
                        >
                            <MessageCircle className="w-4 h-4" />
                            Share via WhatsApp
                        </Button>
                        <Button
                            onClick={handleSaveAsPng}
                            variant="outline"
                            size="sm"
                            disabled={isSaving}
                            className="gap-2"
                        >
                            {isSaving ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Download className="w-4 h-4" />
                            )}
                            Save Image
                        </Button>
                    </div>
                    {/* Secondary Action */}
                    <div className="flex justify-center">
                        <Button
                            onClick={handleShare}
                            variant="ghost"
                            size="sm"
                            className="gap-2 text-muted-foreground"
                        >
                            <Share2 className="w-4 h-4" />
                            Copy Link
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuestCardPage;
