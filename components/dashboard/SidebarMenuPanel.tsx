"use client";

import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

import { useSidebar } from "@/components/ui/Sidebar";
import {
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerNestedRoot,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/Drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { cn } from "@/utils/class-names";

type SidebarMenuPanelMode = "mobile" | "desktop";

type SidebarMenuPanelContextValue = {
  mode: SidebarMenuPanelMode;
  closePanel: () => void;
};

const SidebarMenuPanelContext =
  React.createContext<SidebarMenuPanelContextValue>({
    mode: "desktop",
    closePanel: () => {},
  });

const panelItemClassName =
  "relative flex w-full cursor-pointer items-center gap-1 rounded-md p-0.5 px-2 text-gray-12 hover:bg-gray-3 focus-visible:bg-gray-3 focus-visible:outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50";

export type SidebarMenuPanelProps = {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  align?: "start" | "center" | "end";
  tooltip?: string;
  children: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
};

function PanelTriggerWrapper({
  trigger,
  tooltip,
  TriggerComponent,
}: {
  trigger: React.ReactNode;
  tooltip?: string;
  TriggerComponent: typeof DrawerTrigger | typeof DropdownMenuTrigger;
}) {
  const { state, isMobile } = useSidebar();

  const menuTrigger = (
    <TriggerComponent asChild>{trigger}</TriggerComponent>
  );

  if (!tooltip) {
    return menuTrigger;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{menuTrigger}</TooltipTrigger>
      <TooltipContent
        side="right"
        align="center"
        hidden={state !== "collapsed" || isMobile}
      >
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}

export function SidebarMenuPanel({
  trigger,
  title,
  description,
  align = "start",
  tooltip,
  children,
  onOpenChange,
}: SidebarMenuPanelProps) {
  const { isMobile } = useSidebar();
  const [open, setOpen] = React.useState(false);
  const mode: SidebarMenuPanelMode = isMobile ? "mobile" : "desktop";

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      setOpen(next);
      onOpenChange?.(next);
    },
    [onOpenChange],
  );

  const closePanel = React.useCallback(() => {
    handleOpenChange(false);
  }, [handleOpenChange]);

  const contextValue = React.useMemo(
    () => ({ mode, closePanel }),
    [mode, closePanel],
  );

  if (isMobile) {
    return (
      <SidebarMenuPanelContext.Provider value={contextValue}>
        <DrawerNestedRoot
          open={open}
          direction="bottom"
          onOpenChange={handleOpenChange}
        >
          <PanelTriggerWrapper
            trigger={trigger}
            tooltip={tooltip}
            TriggerComponent={DrawerTrigger}
          />
          <DrawerContent
            className="max-h-[min(75dvh,calc(100dvh-env(safe-area-inset-bottom)))] w-full max-w-full border-gray-6 bg-gray-1 p-0 pb-[env(safe-area-inset-bottom)]"
          >
            <DrawerHeader className="shrink-0 border-b border-gray-6 px-2 py-1.5 text-left">
              <DrawerTitle className="h5">{title}</DrawerTitle>
              {description ? (
                <DrawerDescription className="p text-gray-11">
                  {description}
                </DrawerDescription>
              ) : null}
            </DrawerHeader>
            <div className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto overscroll-contain px-1 py-1">
              {children}
            </div>
          </DrawerContent>
        </DrawerNestedRoot>
      </SidebarMenuPanelContext.Provider>
    );
  }

  return (
    <SidebarMenuPanelContext.Provider value={contextValue}>
      <DropdownMenu open={open} onOpenChange={handleOpenChange}>
        <PanelTriggerWrapper
          trigger={trigger}
          tooltip={tooltip}
          TriggerComponent={DropdownMenuTrigger}
        />
        <DropdownMenuContent
          side="right"
          align={align}
          className="w-(--sidebar-width)"
        >
          <DropdownMenuLabel>{title}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {children}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuPanelContext.Provider>
  );
}

export type SidebarMenuPanelItemProps = {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onSelect?: (event: Event) => void;
  asChild?: boolean;
};

export function SidebarMenuPanelItem({
  children,
  className,
  disabled,
  onSelect,
  asChild = false,
}: SidebarMenuPanelItemProps) {
  const { mode, closePanel } = React.useContext(SidebarMenuPanelContext);

  if (mode === "mobile") {
    if (asChild) {
      return (
        <Slot
          className={cn(panelItemClassName, className)}
          onClick={() => {
            if (!disabled) closePanel();
          }}
        >
          {children}
        </Slot>
      );
    }

    return (
      <button
        type="button"
        disabled={disabled}
        className={cn(panelItemClassName, className)}
        onClick={(event) => {
          onSelect?.(event.nativeEvent);
          if (!event.nativeEvent.defaultPrevented && !disabled) {
            closePanel();
          }
        }}
      >
        {children}
      </button>
    );
  }

  return (
    <DropdownMenuItem
      disabled={disabled}
      onSelect={onSelect}
      asChild={asChild}
      className={className}
    >
      {children}
    </DropdownMenuItem>
  );
}

export function SidebarMenuPanelSeparator() {
  const { mode } = React.useContext(SidebarMenuPanelContext);

  if (mode === "mobile") {
    return <div className="my-0.5 h-px bg-gray-a6" role="separator" />;
  }

  return <DropdownMenuSeparator />;
}
