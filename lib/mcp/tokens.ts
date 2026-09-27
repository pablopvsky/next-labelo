import { createHash, randomBytes } from "node:crypto";

export const MCP_READ_SCOPE = "mcp:read";
export const MCP_WRITE_SCOPE = "mcp:write";
export const DEFAULT_MCP_SCOPES = [MCP_READ_SCOPE, MCP_WRITE_SCOPE] as const;

export const TOKEN_PREFIX = "lbl_";

export function isMcpTokenPepperConfigured(): boolean {
  return Boolean(process.env.LABELO_MCP_TOKEN_PEPPER?.trim());
}

function getPepper(): string | null {
  const pepper = process.env.LABELO_MCP_TOKEN_PEPPER?.trim();
  return pepper || null;
}

/** Peppered SHA-256 of the raw token. Never store plaintext. */
export function hashPersonalAccessToken(rawToken: string): string | null {
  const pepper = getPepper();
  if (!pepper) return null;
  return createHash("sha256").update(`${pepper}${rawToken}`).digest("hex");
}

export function generatePersonalAccessToken(): {
  rawToken: string;
  tokenPrefix: string;
  tokenHash: string;
} {
  const pepper = getPepper();
  if (!pepper) {
    throw new Error("LABELO_MCP_TOKEN_PEPPER is not configured");
  }

  const rawToken = `${TOKEN_PREFIX}${randomBytes(24).toString("base64url")}`;
  const tokenHash = hashPersonalAccessToken(rawToken);
  if (!tokenHash) {
    throw new Error("LABELO_MCP_TOKEN_PEPPER is not configured");
  }

  return {
    rawToken,
    tokenPrefix: rawToken.slice(0, 10),
    tokenHash,
  };
}
