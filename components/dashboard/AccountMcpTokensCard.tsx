"use client";

import {
  ClipboardCopyIcon,
  Cross2Icon,
  LockClosedIcon,
} from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  createAccountMcpToken,
  revokeAccountMcpToken,
  type McpTokenListItem,
} from "@/lib/mcp/actions";
import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Separator } from "@/components/ui/Separator";

export type AccountMcpTokensCardLabels = {
  title: string;
  description: string;
  pepperMissing: string;
  nameLabel: string;
  namePlaceholder: string;
  generate: string;
  generating: string;
  copyOnceTitle: string;
  copyOnceDescription: string;
  copy: string;
  copied: string;
  empty: string;
  created: string;
  lastUsed: string;
  neverUsed: string;
  revoke: string;
  revoking: string;
  nameRequired: string;
  endpointHint: string;
};

export type AccountMcpTokensCardProps = {
  pepperConfigured: boolean;
  tokens: McpTokenListItem[];
  mcpEndpoint: string;
  labels: AccountMcpTokensCardLabels;
};

function formatDateTime(value: Date | null | undefined) {
  if (!value) return null;
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value instanceof Date ? value : new Date(value));
}

export function AccountMcpTokensCard({
  pepperConfigured,
  tokens,
  mcpEndpoint,
  labels,
}: AccountMcpTokensCardProps) {
  const router = useRouter();
  const [name, setName] = useState("cursor");
  const [rawToken, setRawToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [revokingId, setRevokingId] = useState<string | null>(null);

  function onGenerate() {
    setError(null);
    setCopied(false);
    startTransition(async () => {
      const result = await createAccountMcpToken(name);
      if (!result.ok) {
        if (result.code === "pepper") {
          setError(labels.pepperMissing);
        } else if (result.code === "fields") {
          setError(labels.nameRequired);
        } else {
          setError(result.error ?? labels.nameRequired);
        }
        return;
      }
      setRawToken(result.token.rawToken);
      setName("cursor");
      router.refresh();
    });
  }

  async function onCopy() {
    if (!rawToken) return;
    try {
      await navigator.clipboard.writeText(rawToken);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  function onRevoke(id: string) {
    setError(null);
    setRevokingId(id);
    startTransition(async () => {
      const result = await revokeAccountMcpToken(id);
      setRevokingId(null);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      if (rawToken) setRawToken(null);
      router.refresh();
    });
  }

  return (
    <Card className="border-gray-6 bg-gray-1 shadow-sm">
      <CardHeader className="gap-0.5 border-b border-gray-6 px-2 py-1.5">
        <CardTitle className="h5 text-gray-12">{labels.title}</CardTitle>
        <CardDescription className="text-sm text-gray-11">
          {labels.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-1.5 px-2 py-1.5">
        {!pepperConfigured ? (
          <Alert variant="warning">
            <AlertIcon>
              <LockClosedIcon className="icon" aria-hidden />
            </AlertIcon>
            <AlertContent>
              <AlertTitle>{labels.title}</AlertTitle>
              <AlertDescription>{labels.pepperMissing}</AlertDescription>
            </AlertContent>
          </Alert>
        ) : (
          <>
            <p className="text-xs text-gray-11 font-mono break-all">
              {labels.endpointHint}: {mcpEndpoint}
            </p>

            <div className="flex flex-col gap-0.5 sm:flex-row sm:items-end sm:gap-1">
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <Label htmlFor="mcp-token-name" className="text-sm text-gray-11">
                  {labels.nameLabel}
                </Label>
                <Input
                  id="mcp-token-name"
                  value={name}
                  maxLength={80}
                  onChange={(event) => setName(event.target.value)}
                  placeholder={labels.namePlaceholder}
                  disabled={isPending}
                />
              </div>
              <Button
                type="button"
                size="sm"
                onClick={onGenerate}
                isDisabled={isPending}
                isLoading={isPending && !revokingId}
                isLoadingText={labels.generating}
                label={labels.generate}
              />
            </div>

            {error ? (
              <Alert variant="danger">
                <AlertContent>
                  <AlertDescription>{error}</AlertDescription>
                </AlertContent>
              </Alert>
            ) : null}

            {rawToken ? (
              <Alert variant="success">
                <AlertContent className="flex w-full min-w-0 flex-col gap-1">
                  <AlertTitle>{labels.copyOnceTitle}</AlertTitle>
                  <AlertDescription>
                    {labels.copyOnceDescription}
                  </AlertDescription>
                  <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-1">
                    <Input
                      readOnly
                      value={rawToken}
                      className="font-mono"
                      aria-label={labels.copyOnceTitle}
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="pill"
                      onClick={onCopy}
                      label={
                        <span className="inline-flex items-center gap-0.5">
                          <ClipboardCopyIcon className="icon" aria-hidden />
                          {copied ? labels.copied : labels.copy}
                        </span>
                      }
                    />
                  </div>
                </AlertContent>
              </Alert>
            ) : null}

            <Separator className="my-0.5" />

            {tokens.length === 0 ? (
              <p className="text-sm text-gray-11">{labels.empty}</p>
            ) : (
              <ul className="flex flex-col gap-1">
                {tokens.map((token) => {
                  const created = formatDateTime(token.createdAt);
                  const lastUsed = formatDateTime(token.lastUsedAt);
                  return (
                    <li
                      key={token.id}
                      className="flex items-start justify-between gap-1 rounded-md border border-gray-6 bg-gray-2 px-1 py-1"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-12 truncate">
                          {token.name}
                        </p>
                        <p className="text-xs font-mono text-gray-11">
                          {token.tokenPrefix}…
                        </p>
                        <p className="text-xs text-gray-11 mt-0.5">
                          {labels.created}: {created ?? "—"}
                          {" · "}
                          {labels.lastUsed}:{" "}
                          {lastUsed ?? labels.neverUsed}
                        </p>
                      </div>
                      <Button
                        type="button"
                        size="icon"
                        variant="pill"
                        aria-label={labels.revoke}
                        onClick={() => onRevoke(token.id)}
                        isDisabled={isPending}
                        isLoading={revokingId === token.id}
                        label={<Cross2Icon className="icon" aria-hidden />}
                      />
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
