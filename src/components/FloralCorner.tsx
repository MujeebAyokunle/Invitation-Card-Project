import { cn } from "@/lib/utils";

interface FloralCornerProps {
    position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
    className?: string;
    size?: "sm" | "md" | "lg";
}

export const FloralCorner = ({ position, className, size = "md" }: FloralCornerProps) => {
    const sizeClasses = {
        sm: "w-16 h-16",
        md: "w-24 h-24",
        lg: "w-32 h-32",
    };

    const positionClasses = {
        "top-left": "top-2 left-2 rotate-0",
        "top-right": "top-2 right-2 rotate-90",
        "bottom-left": "bottom-2 left-2 -rotate-90",
        "bottom-right": "bottom-2 right-2 rotate-180",
    };

    return (
        <svg
            className={cn(
                "absolute opacity-70 pointer-events-none select-none",
                sizeClasses[size],
                positionClasses[position],
                className
            )}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Main floral branch */}
            <path
                d="M5 95 Q 20 80, 35 85 Q 50 90, 60 75 Q 70 60, 85 55 Q 92 52, 95 45"
                stroke="currentColor"
                strokeWidth="0.8"
                fill="none"
                style={{ color: "hsl(35 40% 35%)" }}
            />
            {/* Leaves */}
            <path
                d="M25 82 Q 30 75, 28 68 Q 26 75, 25 82"
                fill="currentColor"
                style={{ color: "hsl(35 45% 45%)" }}
                opacity="0.8"
            />
            <path
                d="M45 78 Q 52 72, 48 64 Q 44 72, 45 78"
                fill="currentColor"
                style={{ color: "hsl(35 45% 45%)" }}
                opacity="0.8"
            />
            <path
                d="M65 65 Q 72 58, 68 50 Q 64 58, 65 65"
                fill="currentColor"
                style={{ color: "hsl(35 45% 45%)" }}
                opacity="0.8"
            />
            {/* Small flower */}
            <circle cx="85" cy="42" r="6" fill="none" stroke="currentColor" strokeWidth="0.5"
                style={{ color: "hsl(35 45% 45%)" }}
            />
            <circle cx="85" cy="42" r="3" fill="currentColor"
                style={{ color: "hsl(35 45% 45%)" }}
                opacity="0.4" />
            {/* Decorative dots */}
            <circle cx="15" cy="90" r="1.5" fill="currentColor"
                style={{ color: "hsl(35 45% 45%)" }}
            />
            <circle cx="55" cy="82" r="1" fill="currentColor" style={{ color: "hsl(35 45% 45%)" }} />
            <circle cx="78" cy="58" r="1" fill="currentColor" style={{ color: "hsl(35 45% 45%)" }} />
            {/* Additional leaf detail */}
            <path
                d="M75 52 Q 80 48, 82 42"
                stroke="currentColor"
                strokeWidth="0.5"
                fill="none"
                style={{ color: "hsl(35 40% 35%)" }}
            />
            <path
                d="M88 48 Q 92 52, 95 55"
                stroke="currentColor"
                strokeWidth="0.5"
                fill="none"
                style={{ color: "hsl(35 40% 35%)" }}
            />
        </svg>
    );
};

export default FloralCorner;
