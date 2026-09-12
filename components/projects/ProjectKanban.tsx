"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useOptimistic,
  useRef,
  useState,
  useTransition,
} from "react";
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import { useTranslations } from "next-intl";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  DotsHorizontalIcon,
  Pencil1Icon,
  PlusIcon,
  TrashIcon,
} from "@radix-ui/react-icons";

import { TaskImportExport } from "@/components/projects/TaskImportExport";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
  createTaskAction,
  deleteTaskAction,
  moveTaskAction,
  updateTaskAction,
} from "@/lib/tasks/actions";
import {
  BACKLOG_STATUS,
  FLOW_STATUSES,
  type FlowStatusValue,
  type TaskStatusValue,
} from "@/lib/tasks/statuses";
import { cn } from "@/utils/class-names";

export type KanbanTask = {
  id: string;
  title: string;
  status: TaskStatusValue;
  position: number;
};

type CarouselApi = UseEmblaCarouselType[1];

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

function LabelActions({
  task,
  onEdit,
  onDelete,
  onChangeStatus,
}: {
  task: KanbanTask;
  onEdit: () => void;
  onDelete: () => void;
  onChangeStatus: (status: FlowStatusValue) => void;
}) {
  const t = useTranslations("tasks");
  const tStatuses = useTranslations("statuses");

  return (
    <ResponsiveMenu>
      <ResponsiveMenuTrigger asChild>
        <Button
          type="button"
          variant="pill"
          size="icon"
          className="bg-gray-a2 backdrop-blur-md"
          aria-label={t("actions")}
        >
          <DotsHorizontalIcon className="icon" />
        </Button>
      </ResponsiveMenuTrigger>
      <ResponsiveMenuContent title={t("actions")} align="end">
        <ResponsiveMenuItem onSelect={onEdit}>
          <Pencil1Icon className="icon" />
          {t("edit")}
        </ResponsiveMenuItem>
        <ResponsiveMenuSeparator />
        <ResponsiveMenuLabel>{t("changeStatus")}</ResponsiveMenuLabel>
        {FLOW_STATUSES.map((status) => {
          const isCurrent = status === task.status;
          return (
            <ResponsiveMenuItem
              key={status}
              disabled={isCurrent}
              onSelect={() => onChangeStatus(status)}
            >
              <CheckIcon
                className={cn("icon", isCurrent ? "opacity-100" : "opacity-0")}
                aria-hidden
              />
              {tStatuses(status)}
            </ResponsiveMenuItem>
          );
        })}
        <ResponsiveMenuSeparator />
        <ResponsiveMenuItem
          onSelect={onDelete}
          className="text-danger-contrast"
        >
          <TrashIcon className="icon" />
          {t("delete")}
        </ResponsiveMenuItem>
      </ResponsiveMenuContent>
    </ResponsiveMenu>
  );
}

function EditLabelDialog({
  task,
  open,
  onOpenChange,
  onSave,
}: {
  task: KanbanTask;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (title: string) => void;
}) {
  const t = useTranslations("tasks");
  const [title, setTitle] = useState(task.title);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="flex flex-col gap-0.5 pr-3">
          <DialogTitle className="h5">{t("editTitle")}</DialogTitle>
          <DialogDescription className="text-sm text-gray-11">
            {t("editDescription")}
          </DialogDescription>
        </DialogHeader>
        <form
          className="mt-1.5 flex flex-col gap-1.5"
          onSubmit={(event) => {
            event.preventDefault();
            if (!title.trim()) return;
            onSave(title);
            onOpenChange(false);
          }}
        >
          <Input
            value={title}
            required
            autoFocus
            onChange={(event) => setTitle(event.target.value)}
          />
          <DialogFooter>
            <Button
              type="button"
              variant="pill"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              {t("editCancel")}
            </Button>
            <Button type="submit" size="sm">
              {t("save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function StatusCarousel({
  status,
  tasks,
  projectId,
  onDelete,
  onEdit,
  onChangeStatus,
}: {
  status: FlowStatusValue;
  tasks: KanbanTask[];
  projectId: string;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string) => void;
  onChangeStatus: (id: string, status: FlowStatusValue) => void;
}) {
  const t = useTranslations("tasks");
  const tStatuses = useTranslations("statuses");
  const [viewportRef, api] = useEmblaCarousel({
    axis: "x",
    align: "start",
    containScroll: false,
    watchDrag: tasks.length > 1,
  });
  const selected = useSelectedSnap(api);
  const [editingTask, setEditingTask] = useState<KanbanTask | null>(null);
  const [adding, setAdding] = useState(false);
  const [pending, startTransition] = useTransition();
  const slides: Array<KanbanTask | null> = tasks.length > 0 ? tasks : [null];

  return (
    <div
      className="relative h-full min-h-0"
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") api?.scrollPrev();
        if (event.key === "ArrowRight") api?.scrollNext();
      }}
    >
      <div ref={viewportRef} className="h-full overflow-hidden">
        <div className="flex h-full touch-pan-y">
          {slides.map((task, index) => (
            <div
              key={task?.id ?? `${status}-empty`}
              className="h-full min-w-0 flex-[0_0_100%]"
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} / ${slides.length}`}
            >
              <article
                data-label-scroll
                className={cn(
                  "h-full overflow-y-auto overscroll-contain bg-gray-1 px-2 pb-3 pt-7",
                  index % 2 === 1 && "bg-gray-2",
                )}
              >
                <div className="smesh mx-auto flex min-h-full max-w-full flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.05em] text-gray-11">
                        {tStatuses(status)}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-11">
                        {tasks.length > 0
                          ? t("labelPosition", {
                              current: index + 1,
                              total: tasks.length,
                            })
                          : t("emptyLane")}
                      </p>
                    </div>
                    {task ? (
                      <LabelActions
                        task={task}
                        onEdit={() => setEditingTask(task)}
                        onDelete={() => onDelete(task.id)}
                        onChangeStatus={(nextStatus) =>
                          onChangeStatus(task.id, nextStatus)
                        }
                      />
                    ) : null}
                  </div>

                  <div className="flex flex-1 items-center py-3">
                    {task ? (
                      <h2 className="h1 whitespace-normal break-words leading-[1.12] text-gray-12">
                        {task.title}
                      </h2>
                    ) : (
                      <div className="flex flex-col items-start gap-1.5">
                        <h2 className="h3 text-gray-12">
                          {tStatuses(status)}
                        </h2>
                        <p className="text-gray-11">{t("emptyLane")}</p>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => setAdding(true)}
                        >
                          <PlusIcon className="icon" />
                          {t("add")}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>

      {tasks.length > 0 ? (
        <Button
          type="button"
          variant="pill"
          size="sm"
          className="absolute bottom-1.5 left-2 bg-gray-a2 backdrop-blur-md"
          onClick={() => setAdding(true)}
        >
          <PlusIcon className="icon" />
          {t("add")}
        </Button>
      ) : null}

      {tasks.length > 1 ? (
        <div
          className="absolute bottom-1.5 left-1/2 flex max-w-full -translate-x-1/2 gap-0.5 overflow-x-auto rounded-full bg-gray-a2 p-0.5 backdrop-blur-md"
          aria-label={t("labelsNavigation")}
        >
          {tasks.map((task, index) => (
            <button
              key={task.id}
              type="button"
              className="flex size-2.5 shrink-0 items-center justify-center rounded-full"
              onClick={() => api?.scrollTo(index)}
              aria-label={t("goToLabel", { index: index + 1 })}
              aria-current={index === selected ? "true" : undefined}
            >
              <span
                className={cn(
                  "size-0.5 rounded-full border border-gray-8 transition-transform motion-reduce:transition-none",
                  index === selected
                    ? "scale-100 bg-gray-12"
                    : "scale-75 bg-gray-3",
                )}
                aria-hidden
              />
            </button>
          ))}
        </div>
      ) : null}

      <Dialog open={adding} onOpenChange={setAdding}>
        <DialogContent>
          <DialogHeader className="flex flex-col gap-0.5 pr-3">
            <DialogTitle className="h5">{t("addTitle")}</DialogTitle>
            <DialogDescription className="text-sm text-gray-11">
              {t("addDescription", { status: tStatuses(status) })}
            </DialogDescription>
          </DialogHeader>
          <form
            className="mt-1.5 flex flex-col gap-1.5"
            action={(formData) => {
              startTransition(async () => {
                await createTaskAction(null, formData);
                setAdding(false);
              });
            }}
          >
            <input type="hidden" name="projectId" value={projectId} />
            <input type="hidden" name="status" value={status} />
            <Input
              name="title"
              required
              autoFocus
              placeholder={t("titlePlaceholder")}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="pill"
                size="sm"
                onClick={() => setAdding(false)}
              >
                {t("editCancel")}
              </Button>
              <Button type="submit" size="sm" isLoading={pending}>
                {t("save")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {editingTask ? (
        <EditLabelDialog
          task={editingTask}
          open
          onOpenChange={(open) => {
            if (!open) setEditingTask(null);
          }}
          onSave={(title) => onEdit(editingTask.id, title)}
        />
      ) : null}
    </div>
  );
}

function BacklogZone({
  open,
  onOpenChange,
  tasks,
  projectId,
  onPromote,
  onDelete,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tasks: KanbanTask[];
  projectId: string;
  onPromote: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const t = useTranslations("tasks");
  const tStatuses = useTranslations("statuses");
  const [pending, startTransition] = useTransition();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="smesh h-dvh max-h-dvh w-full max-w-full overflow-y-auto rounded-sm p-2 pt-6">
        <DialogHeader className="smush flex w-full flex-col gap-0.5 pr-3">
          <DialogTitle className="h2">{tStatuses("backlog")}</DialogTitle>
          <DialogDescription className="text-sm text-gray-11">
            {t("backlogCount", { count: tasks.length })}
          </DialogDescription>
        </DialogHeader>

        <div className="smush mt-2 flex w-full flex-col gap-2 pb-3">
          <form
            className="flex flex-col gap-1 sm:flex-row"
            action={(formData) => {
              startTransition(async () => {
                await createTaskAction(null, formData);
              });
            }}
          >
            <input type="hidden" name="projectId" value={projectId} />
            <input type="hidden" name="status" value={BACKLOG_STATUS} />
            <Input
              name="title"
              required
              placeholder={t("titlePlaceholder")}
              className="flex-1"
            />
            <Button type="submit" size="sm" isLoading={pending}>
              <PlusIcon className="icon" />
              {t("add")}
            </Button>
          </form>

          <ul className="flex flex-col gap-1">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-start justify-between gap-1 rounded-md bg-gray-2 p-1.5"
              >
                <p className="min-w-0 flex-1 whitespace-normal break-words text-gray-12">
                  {task.title}
                </p>
                <div className="flex shrink-0 items-center gap-0.5">
                  <Button
                    type="button"
                    variant="menu"
                    size="icon"
                    aria-label={t("moveToFlow")}
                    title={t("moveToFlow")}
                    onClick={() => onPromote(task.id)}
                  >
                    <ArrowRightIcon className="icon" />
                  </Button>
                  <Button
                    type="button"
                    variant="menu"
                    size="icon"
                    aria-label={t("delete")}
                    onClick={() => onDelete(task.id)}
                  >
                    <TrashIcon className="icon" />
                  </Button>
                </div>
              </li>
            ))}
            {tasks.length === 0 ? (
              <li className="rounded-md bg-gray-2 p-2 text-sm text-gray-11">
                {t("emptyBacklog")}
              </li>
            ) : null}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ProjectKanban({
  projectId,
  projectName,
  teamName,
  initialTasks,
}: {
  projectId: string;
  projectName: string;
  teamName: string;
  initialTasks: KanbanTask[];
}) {
  const t = useTranslations("tasks");
  const tProjects = useTranslations("projects");
  const tStatuses = useTranslations("statuses");
  const [viewportRef, verticalApi] = useEmblaCarousel({
    axis: "y",
    align: "start",
    containScroll: false,
  });
  const selectedStatus = useSelectedSnap(verticalApi);
  const [backlogOpen, setBacklogOpen] = useState(false);
  const [optimisticTasks, setOptimisticTasks] = useOptimistic(
    initialTasks,
    (_current, next: KanbanTask[]) => next,
  );
  const [, startTransition] = useTransition();
  const lastWheelAt = useRef(0);

  const byStatus = useMemo(() => {
    const map = {
      [BACKLOG_STATUS]: [] as KanbanTask[],
      ...Object.fromEntries(
        FLOW_STATUSES.map((status) => [status, [] as KanbanTask[]]),
      ),
    } as Record<TaskStatusValue, KanbanTask[]>;
    for (const task of optimisticTasks) map[task.status].push(task);
    for (const status of [BACKLOG_STATUS, ...FLOW_STATUSES]) {
      map[status].sort((a, b) => a.position - b.position);
    }
    return map;
  }, [optimisticTasks]);

  const applyMove = useCallback(
    (taskId: string, nextStatus: TaskStatusValue) => {
      const task = optimisticTasks.find((item) => item.id === taskId);
      if (!task || task.status === nextStatus) return;
      const nextPosition = byStatus[nextStatus].length;
      const nextTasks = optimisticTasks.map((item) =>
        item.id === taskId
          ? { ...item, status: nextStatus, position: nextPosition }
          : item,
      );
      startTransition(async () => {
        setOptimisticTasks(nextTasks);
        await moveTaskAction({ taskId, status: nextStatus, position: nextPosition });
      });
    },
    [byStatus, optimisticTasks, setOptimisticTasks],
  );

  function onDelete(taskId: string) {
    startTransition(async () => {
      setOptimisticTasks(optimisticTasks.filter((task) => task.id !== taskId));
      await deleteTaskAction(taskId);
    });
  }

  function onEdit(taskId: string, title: string) {
    startTransition(async () => {
      setOptimisticTasks(
        optimisticTasks.map((task) =>
          task.id === taskId ? { ...task, title } : task,
        ),
      );
      await updateTaskAction({ taskId, title });
    });
  }

  function handleWheel(event: React.WheelEvent<HTMLDivElement>) {
    if (!verticalApi || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    const scrollArea = (event.target as HTMLElement).closest<HTMLElement>(
      "[data-label-scroll]",
    );
    if (scrollArea) {
      const canScrollDown =
        scrollArea.scrollTop + scrollArea.clientHeight < scrollArea.scrollHeight - 1;
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

  return (
    <main
      className="fixed inset-0 z-40 h-dvh overflow-hidden bg-gray-1 text-gray-12"
      onWheel={handleWheel}
      onKeyDown={(event) => {
        if (event.key === "ArrowUp") verticalApi?.scrollPrev();
        if (event.key === "ArrowDown") verticalApi?.scrollNext();
      }}
    >
      <h1 className="sr-only">{projectName}</h1>

      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 px-1.5 pt-1.5">
        <div className="project-toolbar-grid smesh">
          <Button
            asChild
            variant="pill"
            size="sm"
            className="pointer-events-auto w-fit bg-gray-a2 backdrop-blur-md"
          >
            <Link href="/dashboard">
              <ArrowLeftIcon className="icon" />
              <span className="hidden sm:inline">{tProjects("back")}</span>
            </Link>
          </Button>

          <div className="pointer-events-auto flex items-center justify-center gap-0.5 rounded-md bg-gray-a2 p-0.5 backdrop-blur-md">
            <Button
              type="button"
              variant="menu"
              size="sm"
              onClick={() => setBacklogOpen(true)}
            >
              {t("showBacklog")}
              {byStatus.backlog.length > 0 ? (
                <span className="text-xs text-gray-11">
                  {byStatus.backlog.length}
                </span>
              ) : null}
            </Button>
            <TaskImportExport
              projectId={projectId}
              projectName={projectName}
              tasks={optimisticTasks}
              toolbar
            />
          </div>

          <div className="hidden justify-self-end text-right sm:block">
            <p className="m-0 text-xs font-semibold text-gray-12">{projectName}</p>
            <p className="m-0 text-xs text-gray-11">{teamName}</p>
          </div>
        </div>
      </header>

      <div ref={viewportRef} className="h-full overflow-hidden">
        <div className="flex h-full flex-col touch-pan-x">
          {FLOW_STATUSES.map((status) => (
            <section
              key={status}
              className="h-full min-h-0 flex-[0_0_100%]"
              aria-label={tStatuses(status)}
            >
              <StatusCarousel
                status={status}
                tasks={byStatus[status]}
                projectId={projectId}
                onDelete={onDelete}
                onEdit={onEdit}
                onChangeStatus={applyMove}
              />
            </section>
          ))}
        </div>
      </div>

      <nav
        className="absolute right-1 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-0.5 rounded-full bg-gray-a2 p-0.5 backdrop-blur-md"
        aria-label={t("statusesNavigation")}
      >
        {FLOW_STATUSES.map((status, index) => (
          <button
            key={status}
            type="button"
            className="flex size-2.5 items-center justify-center rounded-full"
            onClick={() => verticalApi?.scrollTo(index)}
            aria-label={t("goToStatus", { status: tStatuses(status) })}
            aria-current={index === selectedStatus ? "step" : undefined}
            title={tStatuses(status)}
          >
            <span
              className={cn(
                "size-0.5 rounded-full border border-gray-8 transition-transform motion-reduce:transition-none",
                index === selectedStatus
                  ? "scale-100 bg-accent-9"
                  : "scale-75 bg-gray-3",
              )}
              aria-hidden
            />
          </button>
        ))}
      </nav>

      <BacklogZone
        open={backlogOpen}
        onOpenChange={setBacklogOpen}
        tasks={byStatus.backlog}
        projectId={projectId}
        onPromote={(id) => applyMove(id, "requerimiento")}
        onDelete={onDelete}
      />
    </main>
  );
}
