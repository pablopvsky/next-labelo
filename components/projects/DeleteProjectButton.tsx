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
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

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
      <ResponsiveMenu>
        <ResponsiveMenuTrigger asChild>
          <Button
            type="button"
            variant="menu"
            size="icon"
            className="shrink-0"
            aria-label={t("actions")}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
          >
            <DotsHorizontalIcon className="icon" />
          </Button>
        </ResponsiveMenuTrigger>
        <ResponsiveMenuContent title={t("actions")} align="end">
          <ResponsiveMenuItem
            onSelect={() => {
              setError(null);
              setConfirmOpen(true);
            }}
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
