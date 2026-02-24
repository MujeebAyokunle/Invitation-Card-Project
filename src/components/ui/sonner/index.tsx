import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme = "system" } = useTheme();

    return (
        <Sonner
            theme={theme as ToasterProps["theme"]}
            className="toaster group"
            toastOptions={{
                classNames: {
                    toast:
                        "group toast group-[.toaster]:bg-[hsl(36_47%_97%)] group-[.toaster]:text-[hsl(30_25%_20%)] group-[.toaster]:border-[hsl(40_35%_82%)] group-[.toaster]:shadow-lg",
                    description: "group-[.toast]:text-[hsl(30_15%_50%)]",
                    actionButton: "group-[.toast]:bg-[hsl(18_70%_47%)] group-[.toast]:text-[hsl(38_50%_96%)]",
                    cancelButton: "group-[.toast]:bg-[hsl(38_30%_92%)] group-[.toast]:text-[hsl(30_15%_50%)]",
                },
            }}
            {...props}
        />
    );
};

export { Toaster, toast };
