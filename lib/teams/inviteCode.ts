import { customAlphabet } from "@/lib/teams/inviteCodeAlphabet";

const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const generate = customAlphabet(alphabet, 8);

export function createInviteCode() {
  return generate();
}
