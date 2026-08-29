"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { PlusIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/Empty";
import { Input } from "@/components/ui/Input";
import {
  createProjectAction,
  type ProjectActionResult,
} from "@/lib/projects/actions";

type ProjectCard = {
  id: string;
  name: string;
  team: { id: string; name: string };
  _count: { tasks: number };
};

const initial: ProjectActionResult | null = null;

export function ProjectGrid({
  projects,
  teamId,
}: {
  projects: ProjectCard[];
  teamId: string;
}) {
  const t = useTranslations("projects");
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(
    async (prev: ProjectActionResult | null, formData: FormData) => {
      const result = await createProjectAction(prev, formData);
      if (result.ok) {
        setOpen(false);
      }
      return result;
    },
    initial,
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-1">
        <div>
          <h2 className="h4 text-gray-12">{t("title")}</h2>
          <p className="text-sm text-gray-11">{t("subtitle")}</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button type="button">
              <PlusIcon className="icon" />
              {t("new")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("new")}</DialogTitle>
              <DialogDescription>{t("newDescription")}</DialogDescription>
            </DialogHeader>
            <form action={action} className="flex flex-col gap-1">
              <input type="hidden" name="teamId" value={teamId} />
              <label className="text-sm text-gray-12" htmlFor="project-name">
                {t("name")}
              </label>
              <Input
                id="project-name"
                name="name"
                required
                placeholder={t("namePlaceholder")}
                className="h-4 rounded-md border border-gray-7 bg-gray-2 px-1 text-gray-12"
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
      </div>

      {projects.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>{t("emptyTitle")}</EmptyTitle>
            <EmptyDescription>{t("emptyDescription")}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/dashboard/projects/${project.id}`}
              className="block transition-transform duration-[250ms] ease-out hover:scale-[1.03] active:scale-[0.97] motion-reduce:transform-none"
            >
              <Card className="h-full hover:bg-gray-3">
                <CardHeader>
                  <CardTitle>{project.name}</CardTitle>
                  <CardDescription>
                    {project.team.name} ·{" "}
                    {t("taskCount", { count: project._count.tasks })}
                  </CardDescription>
                </CardHeader>
                <CardContent />
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
