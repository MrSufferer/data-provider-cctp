import type { PluginRegistry } from "every-plugin";
import { createLocalPluginRuntime } from "every-plugin/testing";

import CCTPPlugin from "../../cctp/src/index";

const REGISTRY: PluginRegistry = {
  "@MrSufferer/cctp": {
    remoteUrl: "http://localhost:3014/remoteEntry.js",
    version: "0.0.1",
    description: "Circle CCTP data provider plugin",
  },
};

const PLUGIN_MAP = {
  "@MrSufferer/cctp": CCTPPlugin,
} as const;

const runtime = createLocalPluginRuntime<typeof PLUGIN_MAP>(
  {
    registry: REGISTRY,
    secrets: {
      SUBGRAPH_API_KEY: process.env.SUBGRAPH_API_KEY || "",
    },
  },
  PLUGIN_MAP
);

export const { router: dataProviderRouter } = await runtime.usePlugin("@MrSufferer/cctp", {
  variables: {
    timeout: Number(process.env.DATA_PROVIDER_TIMEOUT) || 10000,
    maxRetries: Number(process.env.CCTP_MAX_RETRIES) || 3,
    requestsPerSecond: Number(process.env.CCTP_REQUESTS_PER_SECOND) || 5,
    subgraphBaseUrl: process.env.CCTP_SUBGRAPH_BASE_URL || "https://gateway.thegraph.com/api",
  },
  secrets: { 
    subgraphApiKey: "{{SUBGRAPH_API_KEY}}",
  },
});
