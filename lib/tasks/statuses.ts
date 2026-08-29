/** Workflow stages shown on the project status board (top → bottom). */
export const FLOW_STATUSES = [
  "requerimiento",
  "analisis",
  "preproduccion",
  "produccion",
  "divulgacion",
  "liberacion",
] as const;

/** Holding area outside the workflow; promote only into `requerimiento`. */
export const BACKLOG_STATUS = "backlog" as const;

export const TASK_STATUSES = [BACKLOG_STATUS, ...FLOW_STATUSES] as const;

export type FlowStatusValue = (typeof FLOW_STATUSES)[number];
export type TaskStatusValue = (typeof TASK_STATUSES)[number];

export function isFlowStatus(value: string): value is FlowStatusValue {
  return (FLOW_STATUSES as readonly string[]).includes(value);
}

export function isTaskStatus(value: string): value is TaskStatusValue {
  return (TASK_STATUSES as readonly string[]).includes(value);
}
