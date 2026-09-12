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
  ArchiveIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  DotsHorizontalIcon,
  Pencil1Icon,
  PlusIcon,
  TrashIcon,
} from "@radix-ui/react-icons";

import {
  TaskImportExportMenuItems,
  TaskImportExportProvider,
} from "@/components/projects/TaskImportExport";
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

/** Vaul keeps focus until the drawer finishes closing, so dialogs open on the next tick. */
function openAfterDrawer(open: () => void) {
  window.setTimeout(open, 0);
}

function BoardActions({
  status,
  task,
  backlogCount,
  projectName,
  teamName,
  open,
  onOpenChange,
  onAdd,
  onEdit,
  onDelete,
  onChangeStatus,
  onOpenBacklog,
}: {
  status: FlowStatusValue;
  task: KanbanTask | null;
  backlogCount: number;
  projectName: string;
  teamName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onChangeStatus: (status: FlowStatusValue) => void;
  onOpenBacklog: () => void;
}) {
  const t = useTranslations("tasks");
  const tStatuses = useTranslations("statuses");
  const editOnCloseRef = useRef(false);

  return (
    <ResponsiveMenu alwaysDrawer open={open} onOpenChange={onOpenChange}>
      <ResponsiveMenuTrigger asChild>
        <Button
          type="button"
          variant="pill"
          size="icon"
          className="pointer-events-auto justify-self-end bg-gray-a2 backdrop-blur-md"
          aria-label={t("boardMenu")}
        >
          <DotsHorizontalIcon className="icon" />
        </Button>
      </ResponsiveMenuTrigger>
      <ResponsiveMenuContent
        title={t("boardMenu")}
        description={`${projectName} · ${teamName}`}
        drawerClassName="mx-auto sm:max-w-[440px]"
        onCloseAutoFocus={(event) => {
          if (!editOnCloseRef.current) return;
          editOnCloseRef.current = false;
          // Start editing once the menu releases focus so the caret lands in the title.
          event.preventDefault();
          onEdit();
        }}
      >
        <ResponsiveMenuLabel>{tStatuses(status)}</ResponsiveMenuLabel>
        <ResponsiveMenuItem onSelect={() => openAfterDrawer(onAdd)}>
          <PlusIcon className="icon" />
          {t("add")}
        </ResponsiveMenuItem>

        {task ? (
          <>
            <ResponsiveMenuItem
              onSelect={() => {
                editOnCloseRef.current = true;
              }}
            >
              <Pencil1Icon className="icon" />
              {t("edit")}
            </ResponsiveMenuItem>
            <ResponsiveMenuSeparator />
            <ResponsiveMenuLabel>{t("changeStatus")}</ResponsiveMenuLabel>
            {FLOW_STATUSES.map((flowStatus) => {
              const isCurrent = flowStatus === task.status;
              return (
                <ResponsiveMenuItem
                  key={flowStatus}
                  disabled={isCurrent}
                  onSelect={() => onChangeStatus(flowStatus)}
                >
                  <CheckIcon
                    className={cn(
                      "icon",
                      isCurrent ? "opacity-100" : "opacity-0",
                    )}
                    aria-hidden
                  />
                  {tStatuses(flowStatus)}
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
          </>
        ) : null}

        <ResponsiveMenuSeparator />
        <ResponsiveMenuLabel>{t("boardMenu")}</ResponsiveMenuLabel>
        <ResponsiveMenuItem onSelect={() => openAfterDrawer(onOpenBacklog)}>
          <ArchiveIcon className="icon" />
          {t("showBacklog")}
          {backlogCount > 0 ? (
            <span className="text-xs text-gray-11">{backlogCount}</span>
          ) : null}
        </ResponsiveMenuItem>
        <TaskImportExportMenuItems />
      </ResponsiveMenuContent>
    </ResponsiveMenu>
  );
}

function AddLabelDialog({
  projectId,
  status,
  open,
  onOpenChange,
}: {
  projectId: string;
  status: FlowStatusValue;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("tasks");
  const tStatuses = useTranslations("statuses");
  const [pending, startTransition] = useTransition();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              onOpenChange(false);
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
              onClick={() => onOpenChange(false)}
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
  );
}

/** Edits the label title in place, keeping the same typographic scale as the board. */
function LabelTitleEditor({
  title,
  onSave,
  onCancel,
}: {
  title: string;
  onSave: (title: string) => void;
  onCancel: () => void;
}) {
  const t = useTranslations("tasks");
  const fieldRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState(title);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    field.focus({ preventScroll: true });
    field.setSelectionRange(field.value.length, field.value.length);
  }, []);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    field.style.height = "auto";
    field.style.height = `${field.scrollHeight}px`;
  }, [value]);

  function save() {
    const next = value.trim();
    if (!next) return;
    if (next !== title) onSave(next);
    onCancel();
  }

  return (
    <div className="flex w-full flex-col items-center gap-1">
      <textarea
        ref={fieldRef}
        rows={1}
        value={value}
        aria-label={t("editTitle")}
        placeholder={t("titlePlaceholder")}
        className="h1 w-full resize-none overflow-hidden rounded-sm border border-gray-7 bg-gray-1 p-0.5 text-center leading-[1.12] text-gray-12 outline-none focus-visible:border-accent-8 focus-visible:ring-2 focus-visible:ring-accent-8"
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            save();
          }
          if (event.key === "Escape") {
            event.preventDefault();
            onCancel();
          }
        }}
      />
      <p className="sr-only">{t("editDescription")}</p>
      <div className="flex items-center gap-0.5">
        <Button type="button" variant="pill" size="sm" onClick={onCancel}>
          {t("editCancel")}
        </Button>
        <Button
          type="button"
          size="sm"
          disabled={!value.trim()}
          onClick={save}
        >
          {t("save")}
        </Button>
      </div>
    </div>
  );
}

function StatusCarousel({
  status,
  tasks,
  editingTaskId,
  onActiveIndexChange,
  onAdd,
  onOpenActions,
  onEditSave,
  onEditCancel,
}: {
  status: FlowStatusValue;
  tasks: KanbanTask[];
  editingTaskId: string | null;
  onActiveIndexChange: (status: FlowStatusValue, index: number) => void;
  onAdd: () => void;
  onOpenActions: () => void;
  onEditSave: (taskId: string, title: string) => void;
  onEditCancel: () => void;
}) {
  const t = useTranslations("tasks");
  const tStatuses = useTranslations("statuses");
  const isEditing = tasks.some((task) => task.id === editingTaskId);
  const [viewportRef, api] = useEmblaCarousel({
    axis: "x",
    align: "start",
    containScroll: false,
    watchDrag: tasks.length > 1 && !isEditing,
  });
  const selected = useSelectedSnap(api);
  const slides: Array<KanbanTask | null> = tasks.length > 0 ? tasks : [null];

  useEffect(() => {
    onActiveIndexChange(status, selected);
  }, [onActiveIndexChange, selected, status]);

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
                  "label-safe-area flex h-full overflow-y-auto overscroll-contain bg-gray-1 py-7",
                  index % 2 === 1 && "bg-gray-2",
                )}
              >
                {/* Auto margins keep the slide centered without clipping tall content. */}
                <div className="smesh m-auto flex w-full max-w-full flex-col items-center justify-center gap-1.5 text-center">
                  {task && task.id === editingTaskId ? (
                    <LabelTitleEditor
                      title={task.title}
                      onSave={(title) => onEditSave(task.id, title)}
                      onCancel={onEditCancel}
                    />
                  ) : task ? (
                    <h2 className="h1 whitespace-normal break-words leading-[1.12] text-gray-12">
                      <button
                        type="button"
                        aria-haspopup="dialog"
                        aria-label={`${task.title} — ${t("boardMenu")}`}
                        className="w-full cursor-pointer rounded-sm text-center outline-none focus-visible:ring-2 focus-visible:ring-accent-8"
                        onClick={onOpenActions}
                      >
                        {task.title}
                      </button>
                    </h2>
                  ) : (
                    <>
                      <h2 className="h3 text-gray-12">{tStatuses(status)}</h2>
                      <p className="text-gray-11">{t("emptyLane")}</p>
                      <Button type="button" size="sm" onClick={onAdd}>
                        <PlusIcon className="icon" />
                        {t("add")}
                      </Button>
                    </>
                  )}
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>

      {tasks.length > 1 ? (
        <div
          className="label-safe-area pointer-events-none absolute inset-x-0 bottom-1.5 flex justify-center"
          aria-label={t("labelsNavigation")}
        >
          <div className="pointer-events-auto flex max-w-full gap-0.5 overflow-x-auto rounded-full bg-gray-a2 p-0.5 backdrop-blur-md">
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
        </div>
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
  const [activeIndexByStatus, setActiveIndexByStatus] = useState<
    Record<FlowStatusValue, number>
  >(
    () =>
      Object.fromEntries(
        FLOW_STATUSES.map((status) => [status, 0]),
      ) as Record<FlowStatusValue, number>,
  );
  const [backlogOpen, setBacklogOpen] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [addingStatus, setAddingStatus] = useState<FlowStatusValue | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
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

  const currentStatus = FLOW_STATUSES[selectedStatus] ?? FLOW_STATUSES[0];
  const currentTasks = byStatus[currentStatus];
  const activeIndex = Math.min(
    activeIndexByStatus[currentStatus] ?? 0,
    Math.max(currentTasks.length - 1, 0),
  );
  const activeTask = currentTasks[activeIndex] ?? null;

  const onActiveIndexChange = useCallback(
    (status: FlowStatusValue, index: number) => {
      setActiveIndexByStatus((current) =>
        current[status] === index ? current : { ...current, [status]: index },
      );
    },
    [],
  );

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
    setEditingTaskId((current) => (current === taskId ? null : current));
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
    <TaskImportExportProvider
      projectId={projectId}
      projectName={projectName}
      tasks={optimisticTasks}
    >
      <main
        className="fixed inset-0 z-40 h-dvh overflow-hidden bg-gray-1 text-gray-12"
        data-pull-to-refresh={selectedStatus === 0 ? undefined : "blocked"}
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
              size="icon"
              className="pointer-events-auto justify-self-start bg-gray-a2 backdrop-blur-md"
            >
              <Link href="/dashboard" aria-label={tProjects("back")}>
                <ArrowLeftIcon className="icon" />
              </Link>
            </Button>

            <div className="flex min-w-0 flex-col items-center rounded-md bg-gray-a2 px-1 py-0.5 text-center backdrop-blur-md">
              <p className="m-0 truncate text-xs font-semibold uppercase tracking-[0.05em] text-gray-12">
                {tStatuses(currentStatus)}
              </p>
              <p className="m-0 text-xs text-gray-11">
                {currentTasks.length > 0
                  ? t("labelPosition", {
                      current: activeIndex + 1,
                      total: currentTasks.length,
                    })
                  : t("emptyLane")}
              </p>
            </div>

            <BoardActions
              status={currentStatus}
              task={activeTask}
              backlogCount={byStatus.backlog.length}
              projectName={projectName}
              teamName={teamName}
              open={actionsOpen}
              onOpenChange={setActionsOpen}
              onAdd={() => setAddingStatus(currentStatus)}
              onEdit={() => setEditingTaskId(activeTask?.id ?? null)}
              onDelete={() => activeTask && onDelete(activeTask.id)}
              onChangeStatus={(nextStatus) =>
                activeTask && applyMove(activeTask.id, nextStatus)
              }
              onOpenBacklog={() => setBacklogOpen(true)}
            />
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
                  editingTaskId={editingTaskId}
                  onActiveIndexChange={onActiveIndexChange}
                  onAdd={() => setAddingStatus(status)}
                  onOpenActions={() => setActionsOpen(true)}
                  onEditSave={onEdit}
                  onEditCancel={() => setEditingTaskId(null)}
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

        {addingStatus ? (
          <AddLabelDialog
            projectId={projectId}
            status={addingStatus}
            open
            onOpenChange={(open) => {
              if (!open) setAddingStatus(null);
            }}
          />
        ) : null}

        <BacklogZone
          open={backlogOpen}
          onOpenChange={setBacklogOpen}
          tasks={byStatus.backlog}
          projectId={projectId}
          onPromote={(id) => applyMove(id, "requerimiento")}
          onDelete={onDelete}
        />
      </main>
    </TaskImportExportProvider>
  );
}
