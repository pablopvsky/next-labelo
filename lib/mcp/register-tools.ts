import type { AuthInfo, McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";

import { getMcpUserId } from "@/lib/mcp/auth";
import {
  mcpCreateProject,
  mcpCreateTask,
  mcpDeleteProject,
  mcpDeleteTask,
  mcpGetProject,
  mcpListProjects,
  mcpListTasks,
  mcpMoveTask,
  mcpUpdateTask,
} from "@/lib/mcp/projects-tasks";
import { MCP_WRITE_SCOPE } from "@/lib/mcp/tokens";
import { TASK_STATUSES } from "@/lib/tasks/statuses";

function textResult(data: unknown) {
  return {
    content: [
      {
        type: "text" as const,
        text: typeof data === "string" ? data : JSON.stringify(data, null, 2),
      },
    ],
  };
}

function errorResult(error: unknown) {
  const message = error instanceof Error ? error.message : "Unknown error";
  return {
    isError: true as const,
    content: [{ type: "text" as const, text: message }],
  };
}

function requireUserId(authInfo: AuthInfo | undefined) {
  const userId = getMcpUserId(authInfo);
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

function requireWrite(authInfo: AuthInfo | undefined) {
  if (!authInfo?.scopes.includes(MCP_WRITE_SCOPE)) {
    throw new Error("Missing mcp:write scope");
  }
}

const statusSchema = z.enum(TASK_STATUSES);

export function registerLabeloMcpTools(server: McpServer) {
  server.registerTool(
    "list_projects",
    {
      title: "List projects",
      description:
        "List projects for teams the authenticated Labelo user belongs to.",
      inputSchema: z.object({}),
    },
    async (_args, ctx) => {
      try {
        const userId = requireUserId(ctx.http?.authInfo);
        const projects = await mcpListProjects(userId);
        return textResult(projects);
      } catch (error) {
        return errorResult(error);
      }
    },
  );

  server.registerTool(
    "get_project",
    {
      title: "Get project",
      description: "Get one project and its labels (tasks).",
      inputSchema: z.object({
        projectId: z.string().min(1),
      }),
    },
    async ({ projectId }, ctx) => {
      try {
        const userId = requireUserId(ctx.http?.authInfo);
        const project = await mcpGetProject(userId, projectId);
        if (!project) throw new Error("Project not found");
        return textResult(project);
      } catch (error) {
        return errorResult(error);
      }
    },
  );

  server.registerTool(
    "create_project",
    {
      title: "Create project",
      description:
        "Create a project on a team you belong to. Omits teamId to use your first team.",
      inputSchema: z.object({
        name: z.string().min(1).max(120),
        teamId: z.string().min(1).optional(),
      }),
    },
    async (args, ctx) => {
      try {
        const auth = ctx.http?.authInfo;
        requireWrite(auth);
        const userId = requireUserId(auth);
        const project = await mcpCreateProject(userId, args);
        return textResult(project);
      } catch (error) {
        return errorResult(error);
      }
    },
  );

  server.registerTool(
    "delete_project",
    {
      title: "Delete project",
      description: "Permanently delete a project and all of its labels.",
      inputSchema: z.object({
        projectId: z.string().min(1),
      }),
    },
    async ({ projectId }, ctx) => {
      try {
        const auth = ctx.http?.authInfo;
        requireWrite(auth);
        const userId = requireUserId(auth);
        const result = await mcpDeleteProject(userId, projectId);
        return textResult(result);
      } catch (error) {
        return errorResult(error);
      }
    },
  );

  server.registerTool(
    "list_tasks",
    {
      title: "List tasks",
      description: "List labels (tasks) in a project, optionally by status.",
      inputSchema: z.object({
        projectId: z.string().min(1),
        status: statusSchema.optional(),
      }),
    },
    async (args, ctx) => {
      try {
        const userId = requireUserId(ctx.http?.authInfo);
        const tasks = await mcpListTasks(userId, args);
        return textResult(tasks);
      } catch (error) {
        return errorResult(error);
      }
    },
  );

  server.registerTool(
    "create_task",
    {
      title: "Create task",
      description: "Create a label (task) in a project workflow column.",
      inputSchema: z.object({
        projectId: z.string().min(1),
        title: z.string().min(1).max(500),
        status: statusSchema.optional(),
      }),
    },
    async (args, ctx) => {
      try {
        const auth = ctx.http?.authInfo;
        requireWrite(auth);
        const userId = requireUserId(auth);
        const task = await mcpCreateTask(userId, args);
        return textResult(task);
      } catch (error) {
        return errorResult(error);
      }
    },
  );

  server.registerTool(
    "update_task",
    {
      title: "Update task",
      description: "Rename a label (task).",
      inputSchema: z.object({
        taskId: z.string().min(1),
        title: z.string().min(1).max(500),
      }),
    },
    async (args, ctx) => {
      try {
        const auth = ctx.http?.authInfo;
        requireWrite(auth);
        const userId = requireUserId(auth);
        const task = await mcpUpdateTask(userId, args);
        return textResult(task);
      } catch (error) {
        return errorResult(error);
      }
    },
  );

  server.registerTool(
    "move_task",
    {
      title: "Move task",
      description:
        "Move a label to another status column and position (0-based).",
      inputSchema: z.object({
        taskId: z.string().min(1),
        status: statusSchema,
        position: z.number().int().min(0),
      }),
    },
    async (args, ctx) => {
      try {
        const auth = ctx.http?.authInfo;
        requireWrite(auth);
        const userId = requireUserId(auth);
        const task = await mcpMoveTask(userId, args);
        return textResult(task);
      } catch (error) {
        return errorResult(error);
      }
    },
  );

  server.registerTool(
    "delete_task",
    {
      title: "Delete task",
      description: "Permanently delete a label (task).",
      inputSchema: z.object({
        taskId: z.string().min(1),
      }),
    },
    async ({ taskId }, ctx) => {
      try {
        const auth = ctx.http?.authInfo;
        requireWrite(auth);
        const userId = requireUserId(auth);
        const result = await mcpDeleteTask(userId, taskId);
        return textResult(result);
      } catch (error) {
        return errorResult(error);
      }
    },
  );
}
