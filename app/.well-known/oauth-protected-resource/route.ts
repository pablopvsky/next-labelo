import {
  metadataCorsOptionsRequestHandler,
  protectedResourceHandler,
} from "mcp-handler";

/**
 * RFC 9728 Protected Resource Metadata for the Labelo MCP endpoint.
 * Auth is personal access tokens (Bearer), not a full OAuth authorization server.
 */
const handler = protectedResourceHandler({
  authServerUrls: [],
});

export { handler as GET, metadataCorsOptionsRequestHandler as OPTIONS };
