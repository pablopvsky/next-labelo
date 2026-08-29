import { WorkOS } from "@workos-inc/node";

let client: WorkOS | null = null;

export function getWorkOSClient(): WorkOS {
  const apiKey = process.env.WORKOS_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("WORKOS_API_KEY is not configured");
  }

  if (!client) {
    client = new WorkOS(apiKey);
  }

  return client;
}
