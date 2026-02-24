"use client"
// import { QRCodeSVG } from "qrcode.react";
// import { useRef } from "react";
// import { FaShareSquare } from "react-icons/fa";
// import { IoIosCloudDownload } from "react-icons/io";
// import { toPng } from "html-to-image";


// interface CardPreviewProps {
//     type: "access" | "invitation";
//     guestName?: string;
//     eventTitle?: string;
// }

// function Card({ type, guestName = "Your Name", eventTitle = "Your Event" }: CardPreviewProps) {

//     const cardUrl = `https://invitation-card-project.vercel.app/card/1234`;

//     const cardRef = useRef(null);

//     // handle download functionality
//     const handleDownload = () => {
//         if (cardRef.current === null) return;

//         toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 })
//             .then((dataUrl) => {
//                 const link = document.createElement("a");
//                 link.download = `${guestName}-access-card.png`;
//                 link.href = dataUrl;
//                 link.click();
//             })
//             .catch((err) => {
//                 console.error("Failed to download card:", err);
//             });
//     };

//     // Share function
//     const handleShare = async () => {
//         if (!cardRef.current) return;

//         try {
//             const dataUrl = await toPng(cardRef.current, { cacheBust: true });

//             // Convert dataURL to Blob
//             const res = await fetch(dataUrl);
//             const blob = await res.blob();
//             const file = new File([blob], `${guestName}-access-card.png`, { type: blob.type });

//             // Check if Web Share API is available
//             if (navigator.canShare && navigator.canShare({ files: [file] })) {
//                 await navigator.share({
//                     files: [file],
//                     title: "Access Card",
//                     text: `Here's your access card for Sir Vic's 50th!`,
//                 });
//             } else {
//                 // Fallback: download the file
//                 handleDownload();
//                 alert("Share API not supported. The card has been downloaded instead.");
//             }
//         } catch (err) {
//             console.error("Error sharing card:", err);
//         }
//     };

//     // UI
//     return (
//         <div className="flex min-h-screen items-center justify-center bg-zinc-900 font-sans">

//             {/* Top bar */}
//             <div className="fixed top-0 left-0 w-full z-20 backdrop-blur-sm bg-black/30 flex items-center justify-end px-4 py-2 space-x-4">
//                 {/* Share icon */}
//                 <button
//                     className="p-2 rounded-full hover:bg-yellow-500/20 transition-colors cursor-pointer"
//                     title="Share Card"
//                     onClick={handleShare}
//                 >
//                     <FaShareSquare color="#FBBF24" size={22} />
//                 </button>

//                 {/* Download icon */}
//                 <button
//                     className="p-2 rounded-full hover:bg-yellow-500/20 transition-colors cursor-pointer"
//                     title="Download Card"
//                     onClick={handleDownload}
//                 >
//                     <IoIosCloudDownload color="#FBBF24" size={22} />
//                 </button>
//             </div>

//             {/*  */}


//             <div ref={cardRef} className="p-[0.5px] rounded-xl bg-linear-to-br from-yellow-400 to-yellow-700" >
//                 <div
//                     className="relative w-full max-w-md aspect-[1.6/1] bg-card rounded-xl overflow-hidden border-gradient-gold glow-gold bg-zinc-900"
//                 // initial={{ opacity: 0, y: 20 }}
//                 // animate={{ opacity: 1, y: 0 }}
//                 // transition={{ duration: 0.6 }}
//                 // whileHover={{ scale: 1.02 }}
//                 >
//                     {/* Gold wave decoration - top right */}
//                     <div className="absolute top-0 right-0 w-40 h-24 opacity-80">
//                         <svg viewBox="0 0 160 100" fill="none" className="w-full h-full">
//                             <defs>
//                                 <linearGradient id="waveGold" x1="0%" y1="0%" x2="100%" y2="100%">
//                                     <stop offset="0%" stopColor="hsl(43 85% 55%)" />
//                                     <stop offset="100%" stopColor="hsl(38 70% 40%)" />
//                                 </linearGradient>
//                             </defs>
//                             <path d="M160,0 Q140,30 160,50 Q130,40 150,80 Q120,50 160,100" stroke="url(#waveGold)" strokeWidth="1.5" fill="none" />
//                             <path d="M140,0 Q120,25 145,45 Q110,35 135,75" stroke="url(#waveGold)" strokeWidth="1" fill="none" opacity="0.7" />
//                         </svg>
//                     </div>

//                     {/* Gold wave decoration - bottom left */}
//                     <div className="absolute bottom-0 left-0 w-48 h-28 opacity-80">
//                         <svg viewBox="0 0 200 120" fill="none" className="w-full h-full">
//                             <path d="M0,120 Q30,90 60,110 Q90,70 120,100 Q150,60 180,90 Q200,70 200,50" stroke="url(#waveGold)" strokeWidth="2" fill="none" />
//                             <path d="M0,100 Q40,70 80,95 Q120,50 160,85" stroke="url(#waveGold)" strokeWidth="1.5" fill="none" opacity="0.8" />
//                             <path d="M0,80 Q30,60 70,80 Q100,45 140,70" stroke="url(#waveGold)" strokeWidth="1" fill="none" opacity="0.6" />
//                         </svg>
//                     </div>

//                     {/* Content */}
//                     <div className="relative z-10 p-6 h-full flex flex-col justify-between">
//                         {/* Header */}
//                         <div>
//                             <p className="text-[#d8a322] font-serif italic text-sm">
//                                 Sir Vic’s 50th
//                             </p>
//                             <h3 className="text-[#dea529] font-serif text-xl font-bold tracking-wide">
//                                 ACCESS CARD
//                             </h3>
//                             <p className="text-[#969491] text-sm mt-1">
//                                 In Honor of Lady Theodora O. Innih
//                             </p>
//                             <p className="text-foreground/95 mt-2 text-base font-medium">
//                                 {guestName}
//                             </p>
//                         </div>

//                         {/* Footer */}
//                         <div className="flex items-end justify-between">
//                             {/* Event details */}
//                             <div className="text-muted-foreground text-[#fafafa] text-[10px] space-y-[0.5px]">
//                                 <p >📅 Saturday, 7 March 2026</p>
//                                 <p>⏰ 4:00 PM Prompt</p>
//                                 <p>📍 Maha Event Center, Garki, Abuja</p>
//                                 <p className="mt-1">Dress Code: Formal</p>
//                                 <p>Colours: Burnt Orange & Gold</p>
//                             </div>

//                             {/* QR & validation */}
//                             <div className="flex flex-col items-end gap-2">
//                                 <div className="mt-2 bg-white rounded">
//                                     <div className="p-0.5 rounded bg-linear-to-br from-yellow-400 to-yellow-700">
//                                         <div className="bg-white p-1 rounded">
//                                             <QRCodeSVG
//                                                 value={cardUrl}
//                                                 size={50}
//                                                 bgColor="#000000"
//                                                 fgColor="#ffffff"
//                                                 level="M"
//                                             />
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <p className="text-[10px] -m-1 font-mono text-foreground/70">
//                                     Scan for verification
//                                 </p>
//                                 <p className="text-[10px] -m-1 text-foreground/50">
//                                     RSVP: TJ Mbakwe · +234 703 510 4216
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//         </div>
//     )
// }

// export default Card

import { useRef, useState } from "react";
import domtoimage from "dom-to-image-more";
import AccessCard from "@/components/AccessCard";
import { Button } from "@/components/ui/button";
import { Share2, Loader2, AlertCircle, Download, MessageCircle } from "lucide-react";
import { useGuestByToken } from "@/hooks/useGuests";
import { useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import moment from "moment";

const GuestCardPage = () => {
    const params = useParams<{ id: string }>();

    const token = params?.id as string;
    const { data: guestData, isLoading, error } = useGuestByToken(token);
    const cardRef = useRef<HTMLDivElement>(null);
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    // Get first 8 characters of access token as manual entry code
    const accessCode = guestData?.access_token?.slice(0, 8) || "";

    const handleShare = async () => {
        if (navigator.share && typeof window !== "undefined") {
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
            if (typeof window !== "undefined") {
                // Fallback: copy link to clipboard
                navigator.clipboard.writeText(window.location.href);
                toast({
                    title: "Link copied",
                    description: "Card link has been copied to clipboard.",
                });
            }
        }
    };

    const handleWhatsAppShare = () => {
        const text = `You are specially invited to join the Innih Family in celebrating a truly remarkable milestone, eight decades of love, laughter, and legacy.

*Lady Theodora O. Innih*

*${guestData?.events?.name || ""}*

This is a momentous occasion, and we would be deeply honored to have you share in this special celebration with us.

*Dress Code:* Formal or Traditional Attire

Kindly confirm your attendance using the RSVP link below:

${typeof window !== "undefined" ? window.location.href : ""}

Please find your formal e-invitation attached with full event details.

Warm regards,

*The Innih Family*`;

        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
        if (typeof window !== "undefined")
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

            const scale = Math.min(4, Math.max(2, Math.round((typeof window !== "undefined" ? window.devicePixelRatio : 1) * 2)));
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
                variant: "success"
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

    console.log({ guestData })
    console.log({ error })

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
                        <Button variant="outline">Return to Home</Button>
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
                        qrCodeValue={typeof window !== "undefined" ? window.location.href : ""}
                        accessCode={accessCode}
                        venue={guestData.events.venue}
                        eventName={guestData.events.name}
                        eventDate={moment(guestData.events.date).format("D MMMM YYYY")}
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
