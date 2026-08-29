import {
  CalendarIcon,
  CheckCircledIcon,
  ClockIcon,
  EnvelopeClosedIcon,
  GlobeIcon,
  IdCardIcon,
} from "@radix-ui/react-icons";
import type { User as WorkOSUser } from "@workos-inc/node";

import { AccountLocaleSelect } from "@/components/AccountLocaleSelect";
import { ProfileFormRow } from "@/components/dashboard/ProfileFormRow";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Separator } from "@/components/ui/Separator";

export type AccountProfileCardLabels = {
  profileType: string;
  email: string;
  lastSignIn: string;
  displayName: string;
  userId: string;
  memberSince: string;
  verified: string;
  notVerified: string;
  notSyncedYet: string;
  syncFooterLabel: string;
  refreshHint: string;
};

export type AccountProfileCardProps = {
  workosUser: WorkOSUser;
  dbUser: {
    createdAt: Date;
    updatedAt: Date;
  } | null;
  labels: AccountProfileCardLabels;
};

function displayName(user: {
  firstName: string | null;
  lastName: string | null;
  email: string;
}) {
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  return name || user.email;
}

function initials(user: {
  firstName: string | null;
  lastName: string | null;
  email: string;
}) {
  if (user.firstName && user.lastName) {
    return `${user.firstName[0]!}${user.lastName[0]!}`.toUpperCase();
  }
  if (user.firstName) return user.firstName.slice(0, 2).toUpperCase();
  return user.email.slice(0, 2).toUpperCase();
}

function formatDateTime(value: Date | null | undefined) {
  if (!value) return "—";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

const shellInputClassName =
  "h-auto min-w-0 flex-1 border-0 bg-transparent px-0 py-0.5 text-sm text-gray-12 shadow-none focus-visible:outline-none focus-visible:ring-0";

export function AccountProfileCard({
  workosUser,
  dbUser,
  labels,
}: AccountProfileCardProps) {
  const fullName = displayName(workosUser);
  const nameForForm =
    [workosUser.firstName, workosUser.lastName].filter(Boolean).join(" ").trim() ||
    "—";

  return (
    <Card className="border-gray-6 bg-gray-1 shadow-sm">
      <CardHeader className="gap-1 border-b border-gray-6 px-2 py-1.5">
        <div className="flex items-center justify-between gap-1">
          <Badge variant="secondary" className="rounded-sm font-medium">
            {labels.profileType}
          </Badge>
        </div>
        <div className="flex items-center gap-1.5">
          <Avatar className="size-3 shrink-0 rounded-full border border-gray-6">
            {workosUser.profilePictureUrl ? (
              <AvatarImage
                src={workosUser.profilePictureUrl}
                alt={fullName}
              />
            ) : null}
            <AvatarFallback className="text-sm font-medium text-gray-12">
              {initials(workosUser)}
            </AvatarFallback>
          </Avatar>
          <Input
            readOnly
            value={nameForForm}
            className={`h4 font-medium ${shellInputClassName}`}
            aria-label={labels.displayName}
          />
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-0 px-2 py-1">
        <ProfileFormRow icon={<EnvelopeClosedIcon className="icon" />}>
          <Input
            readOnly
            value={workosUser.email}
            className={shellInputClassName}
            aria-label={labels.email}
          />
          <div className="flex flex-wrap items-center gap-1">
            {workosUser.emailVerified ? (
              <Badge
                variant="secondary"
                status="success"
                className="shrink-0 gap-0.5"
              >
                <CheckCircledIcon className="icon" aria-hidden />
                {labels.verified}
              </Badge>
            ) : (
              <Badge variant="secondary" className="shrink-0">
                {labels.notVerified}
              </Badge>
            )}
          </div>
        </ProfileFormRow>

        <ProfileFormRow icon={<GlobeIcon className="icon" />}>
          <AccountLocaleSelect />
        </ProfileFormRow>

        <ProfileFormRow icon={<ClockIcon className="icon" />}>
          <Input
            readOnly
            value={formatDateTime(
              workosUser.lastSignInAt
                ? new Date(workosUser.lastSignInAt)
                : null,
            )}
            className={shellInputClassName}
            aria-label={labels.lastSignIn}
          />
        </ProfileFormRow>

        <Separator className="my-0.5" />

        <ProfileFormRow icon={<IdCardIcon className="icon" />}>
          <Input
            readOnly
            value={workosUser.id}
            className={`${shellInputClassName} font-mono`}
            aria-label={labels.userId}
          />
        </ProfileFormRow>

        <ProfileFormRow icon={<CalendarIcon className="icon" />}>
          <Input
            readOnly
            value={
              dbUser ? formatDateTime(dbUser.createdAt) : labels.notSyncedYet
            }
            className={shellInputClassName}
            aria-label={labels.memberSince}
          />
        </ProfileFormRow>
      </CardContent>

      <CardFooter className="flex-col items-stretch gap-1.5 px-2 py-1.5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-gray-11">
          <span className="font-medium text-gray-12">
            {labels.syncFooterLabel}:{" "}
          </span>
          {dbUser ? formatDateTime(dbUser.updatedAt) : labels.notSyncedYet}
        </p>
        <p className="text-xs text-gray-11 sm:max-w-[14rem] sm:text-right">
          {labels.refreshHint}
        </p>
      </CardFooter>
    </Card>
  );
}
