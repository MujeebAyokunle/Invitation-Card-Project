import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";
import { Monogram } from "./Monogram";

export interface AccessCardProps {
    guestName: string;
    guestCategory?: string;
    qrCodeValue: string;
    className?: string;
    eventName?: string;
    dressCode?: string;
    eventDate?: string;
    venue?: string;
    accessCode?: string;
}

export const AccessCard = ({
    guestName,
    guestCategory = "Regular",
    qrCodeValue,
    className,
    dressCode,
    eventName = "",
    eventDate = "",
    venue = "",
    accessCode,
}: AccessCardProps) => {
    // Default color mappings for common categories
    const getCategoryColor = (category: string) => {
        const colorMap: Record<string, string> = {
            VIP: "bg-[hsl(18_70%_47%)] text-[hsl(30_15%_50%)]",
            Regular: "bg-[hsl(35_45%_45%)] text-[hsl(30_25%_15%)]",
            Family: "bg-[hsl(18_70%_47%)] text-[hsl(38_50%_96%)]",
            Staff: "bg-[hsl(38_30%_92%)] text-[hsl(30_15%_50%)]",
        };
        return colorMap[category] || "bg-[hsl(43_55%_58%)] text-[hsl(30_25%_15%)]";
    };

    return (
        <div
            className={cn(
                "access-card relative w-full max-w-sm mx-auto rounded-lg overflow-hidden",
                "animate-fade-in-up",
                className
            )}
        >
            {/* Elegant border */}
            <div className="absolute inset-3 border border-[hsl(43_55%_58%)]/30 rounded pointer-events-none" />

            {/* Card content */}
            <div className="relative z-10 px-6 py-6 sm:px-8 sm:py-8">
                {/* Monogram */}
                <div className="flex justify-center mb-3">
                    <Monogram letter="T" size="sm" />
                </div>

                {/* Event title */}
                <div className="text-center mb-4">
                    <h1 className="font-display text-lg sm:text-xl font-semibold text-[hsl(30_25%_20%)]">
                        {eventName}
                    </h1>
                    <p className="text-xs text-[hsl(30_15%_50%)] mt-1">{eventDate} • {venue}</p>
                </div>

                {/* Guest name section */}
                <div className="text-center mb-5">
                    <h3 className="font-display text-xl sm:text-2xl font-medium text-[hsl(30_25%_20%)] mb-3">
                        {guestName}
                    </h3>
                    {guestCategory && (
                        <span
                            className={cn(
                                "inline-flex items-center justify-center px-3 py-1 text-xs font-sans font-medium rounded-full leading-none",
                                getCategoryColor(guestCategory)
                            )}
                        >
                            {guestCategory.toUpperCase()}
                        </span>
                    )}
                </div>

                {/* QR Code */}
                <div className="flex justify-center mb-4">
                    <div className="qr-container p-4">
                        <QRCodeSVG
                            value={qrCodeValue}
                            size={140}
                            level="H"
                            includeMargin={false}
                            bgColor="#FFFFFF"
                            fgColor="#4A4035"
                        />
                    </div>
                </div>

                {/* Scan instruction */}
                <p className="text-center text-xs text-[hsl(30_15%_50%)]">
                    Present this QR code at entry
                </p>

                {/* Access Code */}
                {accessCode && (
                    <div className="mt-3 text-center">
                        <p className="text-[10px] text-[hsl(30_15%_50%)]/70 uppercase tracking-wider">
                            Access Code
                        </p>
                        <p className="font-mono text-sm tracking-[0.2em] text-[hsl(30_15%_50%)] mt-0.5">
                            {accessCode.toUpperCase()}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AccessCard;
