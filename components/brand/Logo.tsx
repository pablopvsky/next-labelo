import Image from "next/image";

import { cn } from "@/utils/class-names";

/**
 * Brand mark. Rendered sizes stay on the 13px spacing grid and match the
 * artwork that feeds the favicon and PWA icons (`public/brand/logo.png`).
 */
const LOGO_SIZES = {
  sm: { pixels: 26, className: "size-2" },
  md: { pixels: 39, className: "size-3" },
  lg: { pixels: 78, className: "size-6" },
} as const;

export type LogoSize = keyof typeof LOGO_SIZES;

export function Logo({
  size = "sm",
  alt = "",
  priority = false,
  className,
}: {
  size?: LogoSize;
  /** Leave empty when the Labelo wordmark is already visible next to the mark. */
  alt?: string;
  priority?: boolean;
  className?: string;
}) {
  const { pixels, className: sizeClassName } = LOGO_SIZES[size];

  return (
    <Image
      src="/brand/logo.png"
      alt={alt}
      width={pixels}
      height={pixels}
      priority={priority}
      className={cn("shrink-0 select-none", sizeClassName, className)}
    />
  );
}

export default Logo;
