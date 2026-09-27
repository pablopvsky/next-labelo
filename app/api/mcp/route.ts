import { createMcpHandler, withMcpAuth } from "mcp-handler";

import { verifyMcpBearerToken } from "@/lib/mcp/auth";
import { registerLabeloMcpTools } from "@/lib/mcp/register-tools";
import { MCP_READ_SCOPE } from "@/lib/mcp/tokens";

const handler = createMcpHandler(
  (server) => {
    registerLabeloMcpTools(server);
  },
  {
    serverInfo: {
      name: "labelo",
      version: "0.1.0",
    },
  },
);

const authHandler = withMcpAuth(handler, verifyMcpBearerToken, {
  required: true,
  requiredScopes: [MCP_READ_SCOPE],
  resourceMetadataPath: "/.well-known/oauth-protected-resource",
});

export { authHandler as GET, authHandler as POST };
