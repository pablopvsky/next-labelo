"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  createTeamAction,
  joinTeamAction,
  type ActionResult,
} from "@/lib/teams/actions";

type Mode = "welcome" | "create" | "join";

const initialState: ActionResult | null = null;

export function OnboardingFlow() {
  const t = useTranslations("onboarding");
  const [mode, setMode] = useState<Mode>("welcome");
  const [createState, createAction, createPending] = useActionState(
    createTeamAction,
    initialState,
  );
  const [joinState, joinAction, joinPending] = useActionState(
    joinTeamAction,
    initialState,
  );

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-xl flex-col justify-center gap-2 px-2 py-3">
      <p className="text-sm font-semibold text-accent-11">{t("brand")}</p>
      <h1 className="h2 text-gray-12">{t("title")}</h1>
      <p className="text-gray-11">{t("description")}</p>

      {mode === "welcome" ? (
        <div className="mt-2 flex flex-col gap-1">
          <Button type="button" onClick={() => setMode("create")}>
            {t("createTeam")}
          </Button>
          <Button
            type="button"
            variant="pill"
            onClick={() => setMode("join")}
          >
            {t("joinTeam")}
          </Button>
        </div>
      ) : null}

      {mode === "create" ? (
        <form action={createAction} className="mt-2 flex flex-col gap-1">
          <label className="text-sm text-gray-12" htmlFor="team-name">
            {t("teamName")}
          </label>
          <Input
            id="team-name"
            name="name"
            required
            autoFocus
            placeholder={t("teamNamePlaceholder")}
            className="h-4 rounded-md border border-gray-7 bg-gray-2 px-1 text-gray-12"
          />
          {createState && !createState.ok ? (
            <p className="text-sm text-[color:var(--danger-contrast)]" role="alert">
              {createState.error}
            </p>
          ) : null}
          <div className="mt-1 flex flex-wrap gap-1">
            <Button type="submit" isLoading={createPending}>
              {t("continue")}
            </Button>
            <Button
              type="button"
              variant="pill"
              onClick={() => setMode("welcome")}
            >
              {t("back")}
            </Button>
          </div>
        </form>
      ) : null}

      {mode === "join" ? (
        <form action={joinAction} className="mt-2 flex flex-col gap-1">
          <label className="text-sm text-gray-12" htmlFor="invite-code">
            {t("inviteCode")}
          </label>
          <Input
            id="invite-code"
            name="inviteCode"
            required
            autoFocus
            autoCapitalize="characters"
            placeholder={t("inviteCodePlaceholder")}
            className="h-4 rounded-md border border-gray-7 bg-gray-2 px-1 text-gray-12 uppercase"
          />
          {joinState && !joinState.ok ? (
            <p className="text-sm text-[color:var(--danger-contrast)]" role="alert">
              {joinState.error}
            </p>
          ) : null}
          <div className="mt-1 flex flex-wrap gap-1">
            <Button type="submit" isLoading={joinPending}>
              {t("continue")}
            </Button>
            <Button
              type="button"
              variant="pill"
              onClick={() => setMode("welcome")}
            >
              {t("back")}
            </Button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
