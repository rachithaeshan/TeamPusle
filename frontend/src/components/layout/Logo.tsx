import Image from "next/image";
import clsx from "clsx";

export function Logo({
                         variant = "dark",
                         size = "md",
                     }: {
    variant?: "dark" | "light";
    size?: "sm" | "md" | "lg";
}) {
    const textColor = variant === "dark" ? "text-ink" : "text-paper";
    const sizes = { sm: "text-base", md: "text-lg", lg: "text-2xl" };
    const iconSizes = { sm: 22, md: 28, lg: 40 };
    const iconSize = iconSizes[size];

    return (
        <div className="flex items-center gap-2">
            <Image
                src="/teampulse-icon.png"
                alt="TeamPulse"
                width={iconSize}
                height={iconSize}
                className="shrink-0"
                priority
            />
            <span className={clsx("font-display font-semibold tracking-tight", textColor, sizes[size])}>
        Team<span className="text-accent">Pulse</span>
      </span>
        </div>
    );
}