import { cn } from "@/utils/class-names";

export type ProfileFormRowProps = {
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function ProfileFormRow({
  icon,
  children,
  className,
}: ProfileFormRowProps) {
  return (
    <div className={cn("flex gap-0.5 py-0.5 sm:gap-1.5 sm:py-1", className)}>
      <div
        className="flex w-2 shrink-0 items-center justify-center self-start text-gray-11 min-h-[2.75rem] sm:w-3 [&_.icon]:h5 sm:[&_.icon]:h4"
        aria-hidden
      >
        {icon}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">{children}</div>
    </div>
  );
}
