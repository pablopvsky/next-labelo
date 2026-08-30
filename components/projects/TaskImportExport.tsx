"use client";

import { useRef, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import {
  ClipboardCopyIcon,
  DotsHorizontalIcon,
  DownloadIcon,
  UploadIcon,
} from "@radix-ui/react-icons";

import AlertStatus from "@/components/AlertStatus";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import {
  ResponsiveMenu,
  ResponsiveMenuContent,
  ResponsiveMenuItem,
  ResponsiveMenuLabel,
  ResponsiveMenuSeparator,
  ResponsiveMenuTrigger,
} from "@/components/ui/ResponsiveMenu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Textarea } from "@/components/ui/Textarea";
import { importTasksAction } from "@/lib/tasks/actions";
import {
  TASK_IMPORT_EXAMPLE_JSON,
  TASK_IMPORT_SCHEMA,
  serializeTaskExport,
} from "@/lib/tasks/import-schema";
import type { TaskStatusValue } from "@/lib/tasks/statuses";
import { validateFormData } from "@/utils/web-validation";

type ExportableTask = {
  title: string;
  status: TaskStatusValue;
  position: number;
};

function formatAjvErrors(
  errors: NonNullable<ReturnType<typeof validateFormData>["errors"]>,
): string {
  return errors
    .map((error) => {
      const path = error.instancePath || "/";
      return `${path}: ${error.message ?? "invalid"}`;
    })
    .join("; ");
}

function parseImportText(raw: string):
  | { ok: true; payload: unknown }
  | { ok: false; error: string } {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: false, error: "empty" };
  }
  try {
    return { ok: true, payload: JSON.parse(trimmed) as unknown };
  } catch {
    return { ok: false, error: "json" };
  }
}

export function TaskImportExport({
  projectId,
  projectName,
  tasks,
}: {
  projectId: string;
  projectName?: string;
  tasks: ExportableTask[];
}) {
  const t = useTranslations("tasks");
  const [importOpen, setImportOpen] = useState(false);
  const [mode, setMode] = useState<"paste" | "file">("paste");
  const [pasteText, setPasteText] = useState("");
  const [fileText, setFileText] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [copiedExample, setCopiedExample] = useState(false);
  const [pending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function resetFeedback() {
    setError(null);
    setSuccess(null);
  }

  function activeRaw(): string {
    return mode === "paste" ? pasteText : (fileText ?? "");
  }

  async function copyExample() {
    try {
      await navigator.clipboard.writeText(TASK_IMPORT_EXAMPLE_JSON);
      setCopiedExample(true);
      window.setTimeout(() => setCopiedExample(false), 1500);
    } catch {
      setError(t("importCopyFailed"));
    }
  }

  function downloadExport() {
    const json = serializeTaskExport(tasks);
    const blob = new Blob([json], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const safeName = (projectName ?? "project")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    anchor.href = url;
    anchor.download = `${safeName || "project"}-labels.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function copyExport() {
    try {
      await navigator.clipboard.writeText(serializeTaskExport(tasks));
    } catch {
      // Clipboard can fail in insecure contexts; download remains available.
    }
  }

  function openImportDialog() {
    resetFeedback();
    setCopiedExample(false);
    // Let the mobile drawer finish closing before opening the dialog.
    window.setTimeout(() => setImportOpen(true), 0);
  }

  function onFileChange(file: File | null) {
    resetFeedback();
    setFileText(null);
    setFileName(null);
    if (!file) return;
    if (
      !file.name.toLowerCase().endsWith(".json") &&
      file.type !== "application/json"
    ) {
      setError(t("importInvalidFile"));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      setFileText(text);
      setFileName(file.name);
    };
    reader.onerror = () => setError(t("importFileReadFailed"));
    reader.readAsText(file);
  }

  function runImport() {
    resetFeedback();
    const parsed = parseImportText(activeRaw());
    if (!parsed.ok) {
      setError(
        parsed.error === "empty" ? t("importEmpty") : t("importInvalidJson"),
      );
      return;
    }

    const { isValid, errors } = validateFormData(
      TASK_IMPORT_SCHEMA,
      parsed.payload,
    );
    if (!isValid) {
      setError(
        t("importSchemaError", {
          details: errors ? formatAjvErrors(errors) : "",
        }),
      );
      return;
    }

    startTransition(async () => {
      const result = await importTasksAction({
        projectId,
        payload: parsed.payload,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSuccess(t("importSuccess", { count: result.importedCount ?? 0 }));
      setPasteText("");
      setFileText(null);
      setFileName(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      window.setTimeout(() => setImportOpen(false), 800);
    });
  }

  const canExport = tasks.length > 0;

  return (
    <>
      <ResponsiveMenu>
        <ResponsiveMenuTrigger asChild>
          <Button
            type="button"
            variant="menu"
            size="icon"
            aria-label={t("boardMenu")}
          >
            <DotsHorizontalIcon className="icon" />
          </Button>
        </ResponsiveMenuTrigger>
        <ResponsiveMenuContent title={t("boardMenu")} align="end">
          <ResponsiveMenuLabel>{t("export")}</ResponsiveMenuLabel>
          <ResponsiveMenuItem
            disabled={!canExport}
            onSelect={() => {
              downloadExport();
            }}
          >
            <DownloadIcon className="icon" />
            {t("export")}
          </ResponsiveMenuItem>
          <ResponsiveMenuItem
            disabled={!canExport}
            onSelect={() => {
              void copyExport();
            }}
          >
            <ClipboardCopyIcon className="icon" />
            {t("exportCopy")}
          </ResponsiveMenuItem>
          <ResponsiveMenuSeparator />
          <ResponsiveMenuItem onSelect={() => openImportDialog()}>
            <UploadIcon className="icon" />
            {t("import")}
          </ResponsiveMenuItem>
        </ResponsiveMenuContent>
      </ResponsiveMenu>

      <Dialog
        open={importOpen}
        onOpenChange={(next) => {
          setImportOpen(next);
          if (!next) {
            resetFeedback();
            setCopiedExample(false);
          }
        }}
      >
        <DialogContent className="max-w-[560px] overflow-y-auto">
          <DialogHeader className="flex flex-col gap-0.5 pr-3">
            <DialogTitle className="h5 text-gray-12">
              {t("importTitle")}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-11">
              {t("importDescription")}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-1.5 flex flex-col gap-1.5">
            <section className="flex flex-col gap-0.5 rounded-md border border-gray-6 bg-gray-2 p-1">
              <div className="flex items-center justify-between gap-1">
                <h3 className="text-sm font-semibold text-gray-12">
                  {t("importExample")}
                </h3>
                <Button
                  type="button"
                  variant="pill"
                  size="xs"
                  onClick={() => void copyExample()}
                >
                  <ClipboardCopyIcon className="icon" />
                  {copiedExample ? t("copied") : t("copyExample")}
                </Button>
              </div>
              <pre className="max-h-8 overflow-auto rounded-md bg-gray-1 p-1 text-xs text-gray-12">
                <code>{TASK_IMPORT_EXAMPLE_JSON}</code>
              </pre>
            </section>

            <Tabs
              value={mode}
              onValueChange={(value) => {
                setMode(value as "paste" | "file");
                resetFeedback();
              }}
            >
              <TabsList>
                <TabsTrigger value="paste">{t("importPaste")}</TabsTrigger>
                <TabsTrigger value="file">{t("importFile")}</TabsTrigger>
              </TabsList>
              <TabsContent value="paste" className="pt-1">
                <label className="flex flex-col gap-0.5">
                  <span className="text-sm text-gray-11">
                    {t("importPasteHint")}
                  </span>
                  <Textarea
                    value={pasteText}
                    onChange={(event) => {
                      setPasteText(event.target.value);
                      resetFeedback();
                    }}
                    placeholder={TASK_IMPORT_EXAMPLE_JSON}
                    className="min-h-8 font-mono text-sm"
                    spellCheck={false}
                  />
                </label>
              </TabsContent>
              <TabsContent value="file" className="pt-1">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm text-gray-11">
                    {t("importFileHint")}
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/json,.json"
                    className="block w-full text-sm text-gray-12 file:mr-1 file:rounded-md file:border file:border-gray-6 file:bg-gray-2 file:px-1 file:py-0.5 file:text-sm file:text-gray-12"
                    onChange={(event) =>
                      onFileChange(event.target.files?.[0] ?? null)
                    }
                  />
                  {fileName ? (
                    <p className="text-xs text-gray-11">
                      {t("importFileSelected", { name: fileName })}
                    </p>
                  ) : null}
                </div>
              </TabsContent>
            </Tabs>

            {error ? (
              <AlertStatus status="danger" description={error} />
            ) : null}
            {success ? (
              <AlertStatus status="success" description={success} />
            ) : null}
          </div>

          <DialogFooter className="mt-1.5">
            <Button
              type="button"
              variant="pill"
              size="sm"
              onClick={() => setImportOpen(false)}
            >
              {t("importCancel")}
            </Button>
            <Button
              type="button"
              size="sm"
              isLoading={pending}
              onClick={runImport}
            >
              {t("importSubmit")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
