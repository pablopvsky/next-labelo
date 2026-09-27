import type { ReactNode } from "react";
import { ArrowRightIcon } from "@radix-ui/react-icons";

import { cn } from "@/utils/class-names";

export function LandingArrowLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a href={href} className={cn("landing-link-arrow", className)}>
      <span>{children}</span>
      <span
        className="inline-flex size-2 items-center justify-center rounded-full border border-current"
        aria-hidden
      >
        <ArrowRightIcon className="icon" />
      </span>
    </a>
  );
}
