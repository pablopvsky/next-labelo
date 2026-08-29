"use client";

import { useMemo, useOptimistic, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  closestCorners,
  pointerWithin,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  CheckIcon,
  CopyIcon,
  DotsHorizontalIcon,
  PlusIcon,
  TrashIcon,
} from "@radix-ui/react-icons";

import { Button } from "@/components/ui/Button";
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
  duplicateTaskAction,
  moveTaskAction,
} from "@/lib/tasks/actions";
import {
  TASK_STATUSES,
  type TaskStatusValue,
} from "@/lib/tasks/statuses";
import { cn } from "@/utils/class-names";

export type KanbanTask = {
  id: string;
  title: string;
  status: TaskStatusValue;
  position: number;
};

const collisionDetection: CollisionDetection = (args) => {
  const pointerHits = pointerWithin(args);
  if (pointerHits.length > 0) return pointerHits;
  return closestCorners(args);
};

function TaskCard({
  task,
  onDuplicate,
  onDelete,
  onChangeStatus,
  overlay,
}: {
  task: KanbanTask;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onChangeStatus?: (status: TaskStatusValue) => void;
  overlay?: boolean;
}) {
  const t = useTranslations("tasks");
  const tStatuses = useTranslations("statuses");
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
      data: { type: "task", status: task.status },
      disabled: overlay,
    });

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  return (
    <div
      ref={overlay ? undefined : setNodeRef}
      style={overlay ? undefined : style}
      className={cn(
        "w-[min(100%,220px)] shrink-0 rounded-md border border-gray-6 bg-gray-2 p-1 shadow-sm touch-none",
        isDragging && !overlay && "opacity-40",
        overlay && "shadow-md",
      )}
      {...(overlay ? {} : { ...attributes, ...listeners })}
    >
      <div className="flex items-start justify-between gap-0.5">
        <p className="text-sm font-medium text-gray-12">{task.title}</p>
        {!overlay ? (
          <ResponsiveMenu>
            <ResponsiveMenuTrigger asChild>
              <Button
                type="button"
                variant="menu"
                size="icon"
                className="shrink-0"
                aria-label={t("actions")}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <DotsHorizontalIcon className="icon" />
              </Button>
            </ResponsiveMenuTrigger>
            <ResponsiveMenuContent title={t("actions")} align="end">
              <ResponsiveMenuItem onSelect={() => onDuplicate?.()}>
                <CopyIcon className="icon" />
                {t("duplicate")}
              </ResponsiveMenuItem>
              <ResponsiveMenuSeparator />
              <ResponsiveMenuLabel>{t("changeStatus")}</ResponsiveMenuLabel>
              {TASK_STATUSES.map((status) => {
                const isCurrent = status === task.status;
                return (
                  <ResponsiveMenuItem
                    key={status}
                    disabled={isCurrent}
                    onSelect={() => onChangeStatus?.(status)}
                  >
                    <span className="flex min-w-0 flex-1 items-center gap-1">
                      <CheckIcon
                        className={cn(
                          "icon shrink-0",
                          isCurrent ? "opacity-100" : "opacity-0",
                        )}
                        aria-hidden
                      />
                      <span className="truncate">{tStatuses(status)}</span>
                    </span>
                  </ResponsiveMenuItem>
                );
              })}
              <ResponsiveMenuSeparator />
              <ResponsiveMenuItem
                onSelect={() => onDelete?.()}
                className="text-[color:var(--danger-contrast)]"
              >
                <TrashIcon className="icon" />
                {t("delete")}
              </ResponsiveMenuItem>
            </ResponsiveMenuContent>
          </ResponsiveMenu>
        ) : null}
      </div>
    </div>
  );
}

function StatusLane({
  status,
  tasks,
  projectId,
  onDuplicate,
  onDelete,
  onChangeStatus,
}: {
  status: TaskStatusValue;
  tasks: KanbanTask[];
  projectId: string;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onChangeStatus: (id: string, status: TaskStatusValue) => void;
}) {
  const t = useTranslations("statuses");
  const tTasks = useTranslations("tasks");
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: { type: "column", status },
  });
  const [adding, setAdding] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <section
      ref={setNodeRef}
      className={cn(
        "flex flex-col gap-1 rounded-md border border-gray-6 bg-gray-1 p-1",
        isOver && "border-accent-8 bg-accent-a2",
      )}
    >
      <div className="flex items-center justify-between gap-1">
        <div className="flex items-baseline gap-0.5">
          <h2 className="text-sm font-semibold text-gray-12">{t(status)}</h2>
          <span className="text-xs text-gray-11">{tasks.length}</span>
        </div>
        <Button
          type="button"
          variant="pill"
          size="xs"
          onClick={() => setAdding((v) => !v)}
        >
          <PlusIcon className="icon" />
          {tTasks("add")}
        </Button>
      </div>

      {adding ? (
        <form
          className="flex flex-wrap items-center gap-0.5"
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
            placeholder={tTasks("titlePlaceholder")}
            className="h-3 min-w-[160px] flex-1 rounded-md border border-gray-7 bg-gray-2 px-1 text-sm text-gray-12"
          />
          <Button type="submit" size="sm" isLoading={pending}>
            {tTasks("save")}
          </Button>
        </form>
      ) : null}

      <div className="flex min-h-4 gap-1 overflow-x-auto pb-0.5 snap-x snap-mandatory">
        {tasks.map((task) => (
          <div key={task.id} className="snap-start">
            <TaskCard
              task={task}
              onDuplicate={() => onDuplicate(task.id)}
              onDelete={() => onDelete(task.id)}
              onChangeStatus={(nextStatus) =>
                onChangeStatus(task.id, nextStatus)
              }
            />
          </div>
        ))}
        {tasks.length === 0 ? (
          <p className="text-xs text-gray-11 py-1 px-0.5">{tTasks("emptyLane")}</p>
        ) : null}
      </div>
    </section>
  );
}

export function ProjectKanban({
  projectId,
  initialTasks,
}: {
  projectId: string;
  initialTasks: KanbanTask[];
}) {
  const [optimisticTasks, setOptimisticTasks] = useOptimistic(
    initialTasks,
    (_current, next: KanbanTask[]) => next,
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 180, tolerance: 8 },
    }),
  );

  const byStatus = useMemo(() => {
    const map = Object.fromEntries(
      TASK_STATUSES.map((status) => [status, [] as KanbanTask[]]),
    ) as Record<TaskStatusValue, KanbanTask[]>;
    for (const task of optimisticTasks) {
      map[task.status].push(task);
    }
    for (const status of TASK_STATUSES) {
      map[status].sort((a, b) => a.position - b.position);
    }
    return map;
  }, [optimisticTasks]);

  const activeTask = optimisticTasks.find((task) => task.id === activeId);

  function applyMove(
    taskId: string,
    nextStatus: TaskStatusValue,
    nextPosition: number,
  ) {
    const task = optimisticTasks.find((item) => item.id === taskId);
    if (!task) return;
    if (nextStatus === task.status && nextPosition === task.position) return;

    const without = optimisticTasks.filter((item) => item.id !== taskId);
    const column = without
      .filter((item) => item.status === nextStatus)
      .sort((a, b) => a.position - b.position);
    column.splice(nextPosition, 0, { ...task, status: nextStatus });
    const others = without.filter((item) => item.status !== nextStatus);
    const nextTasks = [
      ...others,
      ...column.map((item, index) => ({ ...item, position: index })),
    ];

    startTransition(async () => {
      setOptimisticTasks(nextTasks);
      await moveTaskAction({
        taskId,
        status: nextStatus,
        position: nextPosition,
      });
    });
  }

  function onDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = String(active.id);
    const task = optimisticTasks.find((item) => item.id === taskId);
    if (!task) return;

    let nextStatus: TaskStatusValue = task.status;
    let nextPosition = task.position;

    const overId = String(over.id);
    const overData = over.data.current;

    if (overData?.type === "column" && isStatus(overId)) {
      nextStatus = overId;
      nextPosition = byStatus[nextStatus].filter((item) => item.id !== taskId)
        .length;
    } else if (overData?.type === "task" || !isStatus(overId)) {
      const overTask = optimisticTasks.find((item) => item.id === overId);
      if (!overTask) return;
      nextStatus = overTask.status;
      const column = byStatus[nextStatus].filter((item) => item.id !== taskId);
      const overIndex = column.findIndex((item) => item.id === overId);
      nextPosition = overIndex < 0 ? column.length : overIndex;
    } else if (isStatus(overId)) {
      nextStatus = overId;
      nextPosition = byStatus[nextStatus].filter((item) => item.id !== taskId)
        .length;
    }

    applyMove(taskId, nextStatus, nextPosition);
  }

  function onChangeStatus(taskId: string, nextStatus: TaskStatusValue) {
    const task = optimisticTasks.find((item) => item.id === taskId);
    if (!task || task.status === nextStatus) return;
    const nextPosition = byStatus[nextStatus].length;
    applyMove(taskId, nextStatus, nextPosition);
  }

  function onDuplicate(taskId: string) {
    startTransition(() => {
      void duplicateTaskAction(taskId);
    });
  }

  function onDelete(taskId: string) {
    startTransition(() => {
      setOptimisticTasks(optimisticTasks.filter((task) => task.id !== taskId));
      void deleteTaskAction(taskId);
    });
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="flex flex-col gap-1.5">
        {TASK_STATUSES.map((status) => (
          <StatusLane
            key={status}
            status={status}
            tasks={byStatus[status]}
            projectId={projectId}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
            onChangeStatus={onChangeStatus}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} overlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}

function isStatus(value: string): value is TaskStatusValue {
  return (TASK_STATUSES as readonly string[]).includes(value);
}
