import { BaseConnector } from "./connectors/base_connector";
import NodeCache from "node-cache";

export class TTLConnectorWrapper implements BaseConnector {
  private connector: BaseConnector;
  private cache: NodeCache;
  private connectorType: string;

  constructor(
    connector: BaseConnector,
    connectorType: string,
    cache: NodeCache
  ) {
    this.connector = connector;
    this.cache = cache;
    this.connectorType = connectorType;
  }

  cacheKey(): string {
    return this.connectorType + "://" + this.connector.cacheKey();
  }

  async getBalance() {
    const key = this.cacheKey();
    const cached = this.cache.get<{ value: number; cost?: number }>(key);
    if (cached) {
      return {
        ...cached,
        cached: true,
      };
    }

    const result = await this.connector.getBalance();
    this.cache.set(key, result, result.ttl ?? this.balanceTTLSeconds());

    return {
      cached: false,
      ...result,
    };
  }

  balanceTTLSeconds(): number {
    return this.connector.balanceTTLSeconds();
  }
}
