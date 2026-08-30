import { TASK_STATUSES, type TaskStatusValue } from "@/lib/tasks/statuses";

export const TASK_IMPORT_VERSION = 1 as const;

export type TaskImportItem = {
  title: string;
  status?: TaskStatusValue;
  position?: number;
};

export type TaskImportPayload = {
  version: typeof TASK_IMPORT_VERSION;
  tasks: TaskImportItem[];
};

export type TaskExportItem = {
  title: string;
  status: TaskStatusValue;
  position: number;
};

export type TaskExportPayload = {
  version: typeof TASK_IMPORT_VERSION;
  tasks: TaskExportItem[];
};

/** JSON Schema for label (task) import — validated with AJV before applying. */
export const TASK_IMPORT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["version", "tasks"],
  properties: {
    version: {
      type: "integer",
      const: TASK_IMPORT_VERSION,
      errorMessage: {
        const: "version must be 1",
      },
    },
    tasks: {
      type: "array",
      minItems: 1,
      maxItems: 500,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title"],
        properties: {
          title: {
            type: "string",
            minLength: 1,
            maxLength: 500,
            errorMessage: {
              minLength: "title is required",
              maxLength: "title must be at most 500 characters",
            },
          },
          status: {
            type: "string",
            enum: [...TASK_STATUSES],
            errorMessage: {
              enum: `status must be one of: ${TASK_STATUSES.join(", ")}`,
            },
          },
          position: {
            type: "integer",
            minimum: 0,
          },
        },
        errorMessage: {
          required: {
            title: "each task needs a title",
          },
        },
      },
      errorMessage: {
        minItems: "tasks must include at least one label",
        maxItems: "tasks cannot exceed 500 labels per import",
      },
    },
  },
  errorMessage: {
    required: {
      version: "version is required",
      tasks: "tasks array is required",
    },
  },
} as const;

/** Copy-paste example shown in the importer UI. */
export const TASK_IMPORT_EXAMPLE: TaskImportPayload = {
  version: TASK_IMPORT_VERSION,
  tasks: [
    { title: "Research brief", status: "requerimiento" },
    { title: "Draft script", status: "analisis" },
    { title: "Future idea", status: "backlog" },
  ],
};

export const TASK_IMPORT_EXAMPLE_JSON = `${JSON.stringify(
  TASK_IMPORT_EXAMPLE,
  null,
  2,
)}\n`;

export function buildTaskExportPayload(
  tasks: Array<{ title: string; status: TaskStatusValue; position: number }>,
): TaskExportPayload {
  return {
    version: TASK_IMPORT_VERSION,
    tasks: tasks
      .slice()
      .sort((a, b) => {
        if (a.status === b.status) return a.position - b.position;
        return (
          TASK_STATUSES.indexOf(a.status) - TASK_STATUSES.indexOf(b.status)
        );
      })
      .map((task) => ({
        title: task.title,
        status: task.status,
        position: task.position,
      })),
  };
}

export function serializeTaskExport(
  tasks: Array<{ title: string; status: TaskStatusValue; position: number }>,
): string {
  return `${JSON.stringify(buildTaskExportPayload(tasks), null, 2)}\n`;
}
