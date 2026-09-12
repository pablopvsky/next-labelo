"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import {
  DotsHorizontalIcon,
  PlusIcon,
  TrashIcon,
} from "@radix-ui/react-icons";

import { AccountHomeMenu } from "@/components/dashboard/AccountHomeMenu";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import {
  ResponsiveMenu,
  ResponsiveMenuContent,
  ResponsiveMenuItem,
  ResponsiveMenuLabel,
  ResponsiveMenuSeparator,
  ResponsiveMenuTrigger,
} from "@/components/ui/ResponsiveMenu";
import {
  createProjectAction,
  deleteProjectAction,
  type ProjectActionResult,
} from "@/lib/projects/actions";
import { cn } from "@/utils/class-names";

export type HomeProject = {
  id: string;
  name: string;
  team: { id: string; name: string };
  _count: { tasks: number };
};

type CarouselApi = UseEmblaCarouselType[1];

const createInitial: ProjectActionResult | null = null;

function useSelectedSnap(api: CarouselApi) {
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelected(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  return selected;
}

function openAfterDrawer(open: () => void) {
  window.setTimeout(open, 0);
}

function HomeActions({
  project,
  teamName,
  onAdd,
  onDelete,
}: {
  project: HomeProject | null;
  teamName: string;
  onAdd: () => void;
  onDelete: () => void;
}) {
  const t = useTranslations("projects");

  return (
    <ResponsiveMenu alwaysDrawer>
      <ResponsiveMenuTrigger asChild>
        <Button
          type="button"
          variant="pill"
          size="icon"
          className="pointer-events-auto justify-self-end bg-gray-a2 backdrop-blur-md"
          aria-label={t("actions")}
        >
          <DotsHorizontalIcon className="icon" />
        </Button>
      </ResponsiveMenuTrigger>
      <ResponsiveMenuContent
        title={t("actions")}
        description={project ? `${project.name} · ${teamName}` : teamName}
        drawerClassName="mx-auto sm:max-w-[440px]"
      >
        <ResponsiveMenuItem onSelect={() => openAfterDrawer(onAdd)}>
          <PlusIcon className="icon" />
          {t("new")}
        </ResponsiveMenuItem>
        {project ? (
          <>
            <ResponsiveMenuSeparator />
            <ResponsiveMenuLabel>{project.name}</ResponsiveMenuLabel>
            <ResponsiveMenuItem
              onSelect={() => openAfterDrawer(onDelete)}
              className="text-danger-contrast"
            >
              <TrashIcon className="icon" />
              {t("delete")}
            </ResponsiveMenuItem>
          </>
        ) : null}
      </ResponsiveMenuContent>
    </ResponsiveMenu>
  );
}

function NewProjectDialog({
  teamId,
  open,
  onOpenChange,
}: {
  teamId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("projects");
  const [state, action, pending] = useActionState(
    async (prev: ProjectActionResult | null, formData: FormData) => {
      const result = await createProjectAction(prev, formData);
      if (result.ok) onOpenChange(false);
      return result;
    },
    createInitial,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("new")}</DialogTitle>
          <DialogDescription>{t("newDescription")}</DialogDescription>
        </DialogHeader>
        <form action={action} className="flex flex-col gap-1">
          <input type="hidden" name="teamId" value={teamId} />
          <label className="text-sm text-gray-12" htmlFor="home-project-name">
            {t("name")}
          </label>
          <Input
            id="home-project-name"
            name="name"
            required
            autoFocus
            placeholder={t("namePlaceholder")}
          />
          {state && !state.ok ? (
            <p
              className="text-sm text-[color:var(--danger-contrast)]"
              role="alert"
            >
              {state.error}
            </p>
          ) : null}
          <Button type="submit" isLoading={pending} className="mt-1">
            {t("create")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function ProjectHome({
  projects,
  teamId,
  teamName,
  inviteCode,
}: {
  projects: HomeProject[];
  teamId: string;
  teamName: string;
  inviteCode?: string;
}) {
  const t = useTranslations("projects");
  const router = useRouter();
  const [viewportRef, verticalApi] = useEmblaCarousel({
    axis: "y",
    align: "start",
    containScroll: false,
    watchDrag: projects.length > 1,
  });
  const selected = useSelectedSnap(verticalApi);
  const [createOpen, setCreateOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState(false);
  const lastWheelAt = useRef(0);

  const current = projects[selected] ?? null;
  const slides = projects.length > 0 ? projects : [null];

  function handleWheel(event: React.WheelEvent<HTMLDivElement>) {
    if (!verticalApi || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    const scrollArea = (event.target as HTMLElement).closest<HTMLElement>(
      "[data-label-scroll]",
    );
    if (scrollArea) {
      const canScrollDown =
        scrollArea.scrollTop + scrollArea.clientHeight <
        scrollArea.scrollHeight - 1;
      const canScrollUp = scrollArea.scrollTop > 1;
      if ((event.deltaY > 0 && canScrollDown) || (event.deltaY < 0 && canScrollUp)) {
        return;
      }
    }
    event.preventDefault();
    const now = Date.now();
    if (now - lastWheelAt.current < 500) return;
    lastWheelAt.current = now;
    if (event.deltaY > 0) verticalApi.scrollNext();
    else verticalApi.scrollPrev();
  }

  async function onConfirmDelete() {
    if (!current) return;
    setDeleteError(null);
    setPendingDelete(true);
    const result = await deleteProjectAction(current.id);
    setPendingDelete(false);
    if (!result.ok) {
      setDeleteError(result.error);
      return;
    }
    setConfirmOpen(false);
    router.refresh();
  }

  return (
    <main
      id="main-content"
      className="fixed inset-0 z-40 h-dvh overflow-hidden bg-gray-1 text-gray-12"
      onWheel={handleWheel}
      onKeyDown={(event) => {
        if (event.key === "ArrowUp") verticalApi?.scrollPrev();
        if (event.key === "ArrowDown") verticalApi?.scrollNext();
      }}
    >
      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 px-1.5 pt-1.5">
        <div className="project-toolbar-grid smesh">
          <AccountHomeMenu teamName={teamName} inviteCode={inviteCode} />

          <div className="flex min-w-0 flex-col items-center rounded-md bg-gray-a2 px-1 py-0.5 text-center backdrop-blur-md">
            <p className="m-0 truncate text-xs font-semibold uppercase tracking-[0.05em] text-gray-12">
              {t("title")}
            </p>
            <p className="m-0 text-xs text-gray-11">
              {projects.length > 0
                ? t("projectPosition", {
                    current: selected + 1,
                    total: projects.length,
                  })
                : t("emptyTitle")}
            </p>
          </div>

          <HomeActions
            project={current}
            teamName={teamName}
            onAdd={() => setCreateOpen(true)}
            onDelete={() => {
              setDeleteError(null);
              setConfirmOpen(true);
            }}
          />
        </div>
      </header>

      <div ref={viewportRef} className="h-full overflow-hidden">
        <div className="flex h-full flex-col">
          {slides.map((project, index) => (
            <section
              key={project?.id ?? "empty"}
              className="h-full min-h-0 flex-[0_0_100%]"
              aria-label={project?.name ?? t("emptyTitle")}
            >
              {project ? (
                <Link
                  href={`/dashboard/projects/${project.id}`}
                  data-label-scroll
                  data-rail={projects.length > 1 ? undefined : "none"}
                  className={cn(
                    "label-safe-area flex h-full overflow-y-auto overscroll-contain py-7 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-8",
                    index % 2 === 1 ? "bg-gray-2" : "bg-gray-1",
                  )}
                >
                  <div className="smesh m-auto flex w-full max-w-full flex-col items-center justify-center gap-1.5 text-center">
                    <h1 className="h1 whitespace-normal break-words leading-[1.12] text-gray-12">
                      {project.name}
                    </h1>
                    <p className="text-gray-11">
                      {project.team.name} ·{" "}
                      {t("taskCount", { count: project._count.tasks })}
                    </p>
                    <p className="text-sm text-gray-11">{t("tapToEnter")}</p>
                  </div>
                </Link>
              ) : (
                <div
                  data-label-scroll
                  data-rail="none"
                  className="label-safe-area flex h-full overflow-y-auto overscroll-contain bg-gray-1 py-7"
                >
                  <div className="smesh m-auto flex w-full max-w-full flex-col items-center justify-center gap-1.5 text-center">
                    <h1 className="h3 text-gray-12">{t("emptyTitle")}</h1>
                    <p className="text-gray-11">{t("emptyDescription")}</p>
                    <Button type="button" size="sm" onClick={() => setCreateOpen(true)}>
                      <PlusIcon className="icon" />
                      {t("new")}
                    </Button>
                  </div>
                </div>
              )}
            </section>
          ))}
        </div>
      </div>

      {projects.length > 1 ? (
        <nav
          className="absolute right-1 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-0.5 rounded-full bg-gray-a2 p-0.5 backdrop-blur-md"
          aria-label={t("projectsNavigation")}
        >
          {projects.map((project, index) => (
            <button
              key={project.id}
              type="button"
              className="flex size-2.5 items-center justify-center rounded-full"
              onClick={() => verticalApi?.scrollTo(index)}
              aria-label={t("goToProject", { name: project.name })}
              aria-current={index === selected ? "true" : undefined}
              title={project.name}
            >
              <span
                className={cn(
                  "size-0.5 rounded-full border border-gray-8 transition-transform motion-reduce:transition-none",
                  index === selected
                    ? "scale-100 bg-accent-9"
                    : "scale-75 bg-gray-3",
                )}
                aria-hidden
              />
            </button>
          ))}
        </nav>
      ) : null}

      <NewProjectDialog
        teamId={teamId}
        open={createOpen}
        onOpenChange={setCreateOpen}
      />

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {current
                ? t("deleteDescription", { name: current.name })
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteError ? (
            <p
              className="text-sm text-[color:var(--danger-contrast)]"
              role="alert"
            >
              {deleteError}
            </p>
          ) : null}
          <AlertDialogFooter className="mt-1.5">
            <Button
              type="button"
              variant="pill"
              disabled={pendingDelete}
              onClick={() => setConfirmOpen(false)}
            >
              {t("deleteCancel")}
            </Button>
            <Button
              type="button"
              isLoading={pendingDelete}
              onClick={() => void onConfirmDelete()}
            >
              {t("deleteConfirm")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
