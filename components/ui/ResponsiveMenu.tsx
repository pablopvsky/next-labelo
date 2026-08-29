"use client";
/**
 * @description Menu that renders as a dropdown on desktop and a bottom drawer on mobile.
 */
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

import {
  Drawer,
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
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/utils/class-names";

type ResponsiveMenuMode = "mobile" | "desktop";

type ResponsiveMenuContextValue = {
  mode: ResponsiveMenuMode;
  setOpen: (open: boolean) => void;
};

const ResponsiveMenuContext =
  React.createContext<ResponsiveMenuContextValue | null>(null);

function useResponsiveMenu() {
  const context = React.useContext(ResponsiveMenuContext);
  if (!context) {
    throw new Error(
      "ResponsiveMenu components must be used within ResponsiveMenu",
    );
  }
  return context;
}

const mobileItemClassName =
  "relative flex w-full cursor-pointer items-center gap-1 rounded-md p-0.5 px-2 text-gray-12 hover:bg-gray-3 focus-visible:bg-gray-3 focus-visible:outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50";

type ResponsiveMenuProps = {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Use Vaul NestedRoot when this menu opens inside another drawer (e.g. mobile sidebar). */
  nested?: boolean;
};

function ResponsiveMenu({
  children,
  open: openProp,
  onOpenChange,
  nested = false,
}: ResponsiveMenuProps) {
  const isMobile = useIsMobile();
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : uncontrolledOpen;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(next);
      }
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const mode: ResponsiveMenuMode = isMobile ? "mobile" : "desktop";
  const contextValue = React.useMemo(
    () => ({ mode, setOpen }),
    [mode, setOpen],
  );

  if (mode === "mobile") {
    const Root = nested ? DrawerNestedRoot : Drawer;
    return (
      <ResponsiveMenuContext.Provider value={contextValue}>
        <Root
          open={open}
          onOpenChange={setOpen}
          direction="bottom"
          data-slot="responsive-menu"
        >
          {children}
        </Root>
      </ResponsiveMenuContext.Provider>
    );
  }

  return (
    <ResponsiveMenuContext.Provider value={contextValue}>
      <DropdownMenu
        open={open}
        onOpenChange={setOpen}
        data-slot="responsive-menu"
      >
        {children}
      </DropdownMenu>
    </ResponsiveMenuContext.Provider>
  );
}

function ResponsiveMenuTrigger({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuTrigger>) {
  const { mode } = useResponsiveMenu();

  if (mode === "mobile") {
    return (
      <DrawerTrigger
        data-slot="responsive-menu-trigger"
        className={cn(className)}
        {...props}
      />
    );
  }

  return (
    <DropdownMenuTrigger
      data-slot="responsive-menu-trigger"
      className={cn(className)}
      {...props}
    />
  );
}

type ResponsiveMenuContentProps = React.ComponentProps<
  typeof DropdownMenuContent
> & {
  title: string;
  description?: string;
  showTitleOnDesktop?: boolean;
  drawerClassName?: string;
};

function ResponsiveMenuContent({
  title,
  description,
  showTitleOnDesktop = false,
  className,
  drawerClassName,
  children,
  align,
  side,
  sideOffset,
  ...props
}: ResponsiveMenuContentProps) {
  const { mode } = useResponsiveMenu();

  if (mode === "mobile") {
    return (
      <DrawerContent
        data-slot="responsive-menu-content"
        className={cn(
          "max-h-[min(75dvh,calc(100dvh-env(safe-area-inset-bottom)))] w-full max-w-full border-gray-6 bg-gray-1 p-0 pb-[env(safe-area-inset-bottom)]",
          drawerClassName,
        )}
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
    );
  }

  return (
    <DropdownMenuContent
      data-slot="responsive-menu-content"
      align={align}
      side={side}
      sideOffset={sideOffset}
      className={className}
      {...props}
    >
      {showTitleOnDesktop ? (
        <>
          <DropdownMenuLabel>{title}</DropdownMenuLabel>
          {description ? (
            <p className="px-2 pb-0.5 text-xs text-gray-11">{description}</p>
          ) : null}
          <DropdownMenuSeparator />
        </>
      ) : null}
      {children}
    </DropdownMenuContent>
  );
}

type ResponsiveMenuItemProps = React.ComponentProps<typeof DropdownMenuItem>;

function ResponsiveMenuItem({
  children,
  className,
  disabled,
  onSelect,
  asChild = false,
  ...props
}: ResponsiveMenuItemProps) {
  const { mode, setOpen } = useResponsiveMenu();

  if (mode === "mobile") {
    const handleSelect = (event: React.MouseEvent) => {
      onSelect?.(event.nativeEvent);
      if (!event.nativeEvent.defaultPrevented && !disabled) {
        setOpen(false);
      }
    };

    if (asChild) {
      return (
        <Slot
          data-slot="responsive-menu-item"
          className={cn(mobileItemClassName, className)}
          onClick={handleSelect}
        >
          {children}
        </Slot>
      );
    }

    return (
      <button
        type="button"
        data-slot="responsive-menu-item"
        disabled={disabled}
        className={cn(mobileItemClassName, className)}
        onClick={handleSelect}
      >
        {children}
      </button>
    );
  }

  return (
    <DropdownMenuItem
      data-slot="responsive-menu-item"
      disabled={disabled}
      onSelect={onSelect}
      asChild={asChild}
      className={className}
      {...props}
    >
      {children}
    </DropdownMenuItem>
  );
}

function ResponsiveMenuLabel({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuLabel>) {
  const { mode } = useResponsiveMenu();

  if (mode === "mobile") {
    return (
      <div
        data-slot="responsive-menu-label"
        className={cn("px-2 py-0.5 text-xs text-gray-11", className)}
        {...props}
      />
    );
  }

  return (
    <DropdownMenuLabel
      data-slot="responsive-menu-label"
      className={className}
      {...props}
    />
  );
}

function ResponsiveMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuSeparator>) {
  const { mode } = useResponsiveMenu();

  if (mode === "mobile") {
    return (
      <div
        data-slot="responsive-menu-separator"
        className={cn("my-0.5 h-px bg-gray-a6", className)}
        role="separator"
      />
    );
  }

  return (
    <DropdownMenuSeparator
      data-slot="responsive-menu-separator"
      className={className}
      {...props}
    />
  );
}

function ResponsiveMenuShortcut({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuShortcut>) {
  return (
    <DropdownMenuShortcut
      data-slot="responsive-menu-shortcut"
      className={className}
      {...props}
    />
  );
}

function ResponsiveMenuGroup({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuGroup>) {
  const { mode } = useResponsiveMenu();

  if (mode === "mobile") {
    return (
      <div
        data-slot="responsive-menu-group"
        className={cn("flex flex-col gap-0.5", className)}
        {...props}
      />
    );
  }

  return (
    <DropdownMenuGroup
      data-slot="responsive-menu-group"
      className={className}
      {...props}
    />
  );
}

export {
  ResponsiveMenu,
  ResponsiveMenuTrigger,
  ResponsiveMenuContent,
  ResponsiveMenuItem,
  ResponsiveMenuLabel,
  ResponsiveMenuSeparator,
  ResponsiveMenuShortcut,
  ResponsiveMenuGroup,
};
