import { cn } from "@/lib/utils";

interface MonogramProps {
    letter?: string;
    className?: string;
    size?: "sm" | "md" | "lg";
}

export const Monogram = ({ letter = "T", className, size = "md" }: MonogramProps) => {
    const sizeClasses = {
        sm: "w-16 h-16",
        md: "w-24 h-24",
        lg: "w-32 h-32",
    };

    const fontSizeClasses = {
        sm: "text-2xl",
        md: "text-4xl",
        lg: "text-5xl",
    };

    return (
        <div className={cn("relative", sizeClasses[size], className)}>
            {/* Floral wreath around monogram */}
            <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Outer circle */}
                <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="0.5" className="text-[hsl(35_45%_45%)]" opacity="0.5" />

                {/* Left floral arc */}
                <path
                    d="M20 50 Q 15 30, 30 15 Q 40 8, 50 5"
                    stroke="currentColor"
                    strokeWidth="0.6"
                    fill="none"
                    className="text-[hsl(35_45%_45%)]"
                />
                <path d="M25 35 Q 30 30, 26 24 Q 22 28, 25 35" fill="currentColor" className="text-[hsl(35_45%_45%)]" opacity="0.7" />
                <path d="M35 22 Q 40 16, 35 10 Q 30 15, 35 22" fill="currentColor" className="text-[hsl(35_45%_45%)]" opacity="0.7" />

                {/* Right floral arc */}
                <path
                    d="M80 50 Q 85 30, 70 15 Q 60 8, 50 5"
                    stroke="currentColor"
                    strokeWidth="0.6"
                    fill="none"
                    className="text-[hsl(35_45%_45%)]"
                />
                <path d="M75 35 Q 70 30, 74 24 Q 78 28, 75 35" fill="currentColor" className="text-[hsl(35_45%_45%)]" opacity="0.7" />
                <path d="M65 22 Q 60 16, 65 10 Q 70 15, 65 22" fill="currentColor" className="text-[hsl(35_45%_45%)]" opacity="0.7" />

                {/* Top flower */}
                <circle cx="50" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-[hsl(35_45%_45%)]" />
                <circle cx="50" cy="8" r="1.5" fill="currentColor" className="text-[hsl(35_45%_45%)]" opacity="0.5" />

                {/* Bottom accent */}
                <path
                    d="M30 85 Q 40 92, 50 95 Q 60 92, 70 85"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    fill="none"
                    className="text-[hsl(35_45%_45%)]"
                    opacity="0.6"
                />
                <path d="M40 90 Q 42 95, 50 97 Q 58 95, 60 90" fill="currentColor" className="text-[hsl(35_45%_45%)]" opacity="0.3" />

                {/* Small decorative dots */}
                <circle cx="18" cy="50" r="1.5" fill="currentColor" className="text-[hsl(35_45%_45%)]" />
                <circle cx="82" cy="50" r="1.5" fill="currentColor" className="text-[hsl(35_45%_45%)]" />
            </svg>

            {/* Center monogram letter */}
            <div className="absolute inset-0 flex items-center justify-center">
                <span className={cn(
                    "font-display font-medium text-[hsl(35_40%_35%)]",
                    fontSizeClasses[size]
                )}>
                    {letter}
                </span>
            </div>
        </div>
    );
};

export default Monogram;
