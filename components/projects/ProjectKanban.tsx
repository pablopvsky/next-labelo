"use client";

import { useMemo, useOptimistic, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  CopyIcon,
  DotsHorizontalIcon,
  PlusIcon,
  TrashIcon,
} from "@radix-ui/react-icons";

import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Input } from "@/components/ui/Input";
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

function TaskCard({
  task,
  onDuplicate,
  onDelete,
  overlay,
}: {
  task: KanbanTask;
  onDuplicate?: () => void;
  onDelete?: () => void;
  overlay?: boolean;
}) {
  const t = useTranslations("tasks");
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { status: task.status } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={overlay ? undefined : setNodeRef}
      style={overlay ? undefined : style}
      className={cn(
        "w-[min(100%,220px)] shrink-0 rounded-md border border-gray-6 bg-gray-2 p-1 shadow-sm",
        isDragging && !overlay && "opacity-40",
        overlay && "shadow-md",
      )}
      {...(overlay ? {} : { ...attributes, ...listeners })}
    >
      <div className="flex items-start justify-between gap-0.5">
        <p className="text-sm font-medium text-gray-12">{task.title}</p>
        {!overlay ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
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
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onSelect={() => onDuplicate?.()}
              >
                <CopyIcon className="icon" />
                {t("duplicate")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => onDelete?.()}
                className="text-[color:var(--danger-contrast)]"
              >
                <TrashIcon className="icon" />
                {t("delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
}: {
  status: TaskStatusValue;
  tasks: KanbanTask[];
  projectId: string;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const t = useTranslations("statuses");
  const tTasks = useTranslations("tasks");
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const [adding, setAdding] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <section
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
            className="h-3 min-w-[160px] flex-1 rounded-md border border-gray-7 bg-gray-2 px-1 text-gray-12"
          />
          <Button type="submit" size="sm" isLoading={pending}>
            {tTasks("save")}
          </Button>
        </form>
      ) : null}

      <div
        ref={setNodeRef}
        className="flex gap-1 overflow-x-auto pb-0.5 snap-x snap-mandatory"
      >
        <SortableContext
          items={tasks.map((task) => task.id)}
          strategy={horizontalListSortingStrategy}
        >
          {tasks.map((task) => (
            <div key={task.id} className="snap-start">
              <TaskCard
                task={task}
                onDuplicate={() => onDuplicate(task.id)}
                onDelete={() => onDelete(task.id)}
              />
            </div>
          ))}
        </SortableContext>
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
    (
      current,
      next: KanbanTask[],
    ) => next,
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
    if (isStatus(overId)) {
      nextStatus = overId;
      nextPosition = byStatus[nextStatus].length;
    } else {
      const overTask = optimisticTasks.find((item) => item.id === overId);
      if (!overTask) return;
      nextStatus = overTask.status;
      nextPosition = byStatus[nextStatus].findIndex((item) => item.id === overId);
      if (nextPosition < 0) nextPosition = byStatus[nextStatus].length;
    }

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

    startTransition(() => {
      setOptimisticTasks(nextTasks);
      void moveTaskAction({
        taskId,
        status: nextStatus,
        position: nextPosition,
      });
    });
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
      collisionDetection={closestCorners}
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
