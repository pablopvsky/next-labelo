export const TASK_STATUSES = [
  "requerimiento",
  "analisis",
  "preproduccion",
  "produccion",
  "divulgacion",
  "liberacion",
] as const;

export type TaskStatusValue = (typeof TASK_STATUSES)[number];

export function isTaskStatus(value: string): value is TaskStatusValue {
  return (TASK_STATUSES as readonly string[]).includes(value);
}
