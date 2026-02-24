import { cn } from "@/lib/utils";

interface FloralDividerProps {
    className?: string;
}

export const FloralDivider = ({ className }: FloralDividerProps) => {
    return (
        <svg
            className={cn("w-48 h-6", className)}
            viewBox="0 0 200 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Left branch */}
            <path
                d="M10 12 Q 30 12, 50 10 Q 70 8, 90 12"
                stroke="currentColor"
                strokeWidth="0.5"
                fill="none"
                className="text-gold"
            />
            {/* Right branch */}
            <path
                d="M110 12 Q 130 16, 150 14 Q 170 12, 190 12"
                stroke="currentColor"
                strokeWidth="0.5"
                fill="none"
                className="text-gold"
            />
            {/* Center ornament */}
            <circle cx="100" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="0.6" className="text-gold" />
            <circle cx="100" cy="12" r="2" fill="currentColor" className="text-gold" opacity="0.5" />
            {/* Left leaves */}
            <path d="M30 10 Q 32 6, 28 4 Q 26 8, 30 10" fill="currentColor" className="text-gold" opacity="0.6" />
            <path d="M60 9 Q 63 5, 58 3 Q 56 7, 60 9" fill="currentColor" className="text-gold" opacity="0.6" />
            {/* Right leaves */}
            <path d="M140 13 Q 143 9, 138 7 Q 136 11, 140 13" fill="currentColor" className="text-gold" opacity="0.6" />
            <path d="M170 12 Q 173 8, 168 6 Q 166 10, 170 12" fill="currentColor" className="text-gold" opacity="0.6" />
            {/* Decorative dots */}
            <circle cx="20" cy="11" r="1" fill="currentColor" className="text-gold" />
            <circle cx="80" cy="11" r="1" fill="currentColor" className="text-gold" />
            <circle cx="120" cy="13" r="1" fill="currentColor" className="text-gold" />
            <circle cx="180" cy="12" r="1" fill="currentColor" className="text-gold" />
        </svg>
    );
};

export default FloralDivider;
