"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { DotsHorizontalIcon, TrashIcon } from "@radix-ui/react-icons";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/AlertDialog";
import { Button } from "@/components/ui/Button";
import {
  ResponsiveMenu,
  ResponsiveMenuContent,
  ResponsiveMenuItem,
  ResponsiveMenuTrigger,
} from "@/components/ui/ResponsiveMenu";
import { deleteProjectAction } from "@/lib/projects/actions";

export function DeleteProjectButton({
  projectId,
  projectName,
  redirectToDashboard = false,
}: {
  projectId: string;
  projectName: string;
  /** When true, navigate to /dashboard after a successful delete (project detail page). */
  redirectToDashboard?: boolean;
}) {
  const t = useTranslations("projects");
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function openConfirm() {
    setError(null);
    setMenuOpen(false);
    // Let the mobile drawer finish closing before opening the dialog.
    window.setTimeout(() => setConfirmOpen(true), 0);
  }

  function onConfirmDelete() {
    setError(null);
    startTransition(async () => {
      const result = await deleteProjectAction(projectId);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setConfirmOpen(false);
      if (redirectToDashboard) {
        router.push("/dashboard");
        router.refresh();
      } else {
        router.refresh();
      }
    });
  }

  return (
    <>
      <ResponsiveMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <ResponsiveMenuTrigger asChild>
          <Button
            type="button"
            variant="pill"
            size="icon"
            className="shrink-0 text-gray-12"
            aria-label={t("actions")}
          >
            <DotsHorizontalIcon className="icon" />
          </Button>
        </ResponsiveMenuTrigger>
        <ResponsiveMenuContent title={t("actions")} align="end">
          <ResponsiveMenuItem
            onSelect={openConfirm}
            className="text-[color:var(--danger-contrast)]"
          >
            <TrashIcon className="icon" />
            {t("delete")}
          </ResponsiveMenuItem>
        </ResponsiveMenuContent>
      </ResponsiveMenu>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteDescription", { name: projectName })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {error ? (
            <p
              className="text-sm text-[color:var(--danger-contrast)]"
              role="alert"
            >
              {error}
            </p>
          ) : null}
          <AlertDialogFooter className="mt-1.5">
            <Button
              type="button"
              variant="pill"
              disabled={pending}
              onClick={() => setConfirmOpen(false)}
            >
              {t("deleteCancel")}
            </Button>
            <Button type="button" isLoading={pending} onClick={onConfirmDelete}>
              {t("deleteConfirm")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
