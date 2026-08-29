"use client";

/**
 * iOS standalone PWAs have no native pull-to-refresh.
 * Mirrors Famity Care: enable only in installed/standalone mode, reload on release past threshold.
 */
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { SymbolIcon } from "@radix-ui/react-icons";

import { cn } from "@/utils/class-names";

const PULL_THRESHOLD_PX = 72;
const MAX_PULL_PX = 120;

function isStandaloneDisplay(): boolean {
  if (typeof window === "undefined") return false;
  const media = window.matchMedia("(display-mode: standalone)").matches;
  const ios =
    "standalone" in window.navigator &&
    Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);
  return media || ios;
}

function isIosDevice(): boolean {
  if (typeof window === "undefined") return false;
  return /iP(hone|ad|od)/.test(window.navigator.userAgent);
}

export function PullToRefresh() {
  const t = useTranslations("pwa");
  const [enabled, setEnabled] = useState(false);
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);
  const pulling = useRef(false);

  useEffect(() => {
    // Android already has native PTR; only polyfill iOS installed PWAs.
    setEnabled(isStandaloneDisplay() && isIosDevice());
  }, []);

  useEffect(() => {
    if (!enabled || refreshing) return;

    const onStart = (event: TouchEvent) => {
      if (window.scrollY > 0) {
        pulling.current = false;
        return;
      }
      startY.current = event.touches[0]?.clientY ?? 0;
      pulling.current = true;
    };

    const onMove = (event: TouchEvent) => {
      if (!pulling.current) return;
      const y = event.touches[0]?.clientY ?? 0;
      const delta = y - startY.current;
      if (delta <= 0 || window.scrollY > 0) {
        setPull(0);
        return;
      }
      // Damped rubber-band feel
      const damped = Math.min(MAX_PULL_PX, delta * 0.45);
      setPull(damped);
      if (damped > 8) {
        event.preventDefault();
      }
    };

    const onEnd = () => {
      if (!pulling.current) return;
      pulling.current = false;
      setPull((current) => {
        if (current >= PULL_THRESHOLD_PX) {
          setRefreshing(true);
          window.setTimeout(() => {
            window.location.reload();
          }, 180);
          return current;
        }
        return 0;
      });
    };

    document.addEventListener("touchstart", onStart, { passive: true });
    document.addEventListener("touchmove", onMove, { passive: false });
    document.addEventListener("touchend", onEnd);
    document.addEventListener("touchcancel", onEnd);

    return () => {
      document.removeEventListener("touchstart", onStart);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onEnd);
      document.removeEventListener("touchcancel", onEnd);
    };
  }, [enabled, refreshing]);

  if (!enabled) return null;

  const armed = pull >= PULL_THRESHOLD_PX || refreshing;
  const visible = pull > 2 || refreshing;

  return (
    <div
      aria-live="polite"
      aria-busy={refreshing}
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-[90] flex justify-center transition-[opacity,transform] duration-250 ease-out motion-reduce:transition-none",
        visible ? "opacity-100" : "opacity-0",
      )}
      style={{
        transform: `translateY(${Math.max(pull * 0.35, refreshing ? 14 : 0)}px)`,
      }}
    >
      <div className="mt-1.5 flex items-center gap-1 rounded-md border border-gray-6 bg-gray-1 px-1.5 py-1 text-gray-12 shadow-sm">
        <SymbolIcon
          className={cn(
            "icon text-gray-11",
            refreshing && "animate-spin motion-reduce:animate-none",
            !refreshing && armed && "text-gray-12",
          )}
          style={
            refreshing
              ? undefined
              : { transform: `rotate(${Math.min(pull * 2.2, 180)}deg)` }
          }
        />
        <span className="text-xs">
          {refreshing
            ? t("refreshing")
            : armed
              ? t("release")
              : t("pull")}
        </span>
      </div>
    </div>
  );
}
