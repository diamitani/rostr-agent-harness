/**
 * ROSTR MCP & Composio Tool Integrator
 * 
 * Compiles Model Context Protocol (MCP) server definitions and Composio OAuth connectors
 * so agents can securely access external services without embedding credentials in prompts.
 */

export interface McpServerDefinition {
  name: string;
  command: string;
  args: string[];
  env?: Record<string, string>;
  description: string;
}

export interface ComposioAppIntegration {
  appName: string;
  actions: string[];
  connectedAccountId?: string;
}

export class McpBuilder {
  private servers: Map<string, McpServerDefinition> = new Map();

  constructor() {
    this.registerStandardServers();
  }

  private registerStandardServers(): void {
    this.servers.set("filesystem", {
      name: "filesystem",
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-filesystem", "./projects"],
      description: "Secure local sandboxed file operations",
    });

    this.servers.set("memory", {
      name: "memory",
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-memory"],
      description: "Knowledge graph persistent memory",
    });
  }

  public registerServer(def: McpServerDefinition): void {
    this.servers.set(def.name, def);
  }

  public generateMcpConfigJson(): Record<string, unknown> {
    const mcpServers: Record<string, unknown> = {};
    for (const [name, server] of this.servers.entries()) {
      mcpServers[name] = {
        command: server.command,
        args: server.args,
        env: server.env || {},
      };
    }
    return { mcpServers };
  }

  public buildComposioOAuthTool(appName: string, action: string) {
    return {
      type: "composio_oauth",
      app: appName,
      action: action,
      requiresAuth: true,
      authEndpoint: `https://backend.composio.dev/api/v1/auth/${appName}`,
    };
  }
}

export const mcpBuilder = new McpBuilder();
