export type Balance = {
  value: number;
  cost?: number;
  outdated?: boolean;
  ttl?: number; // seconds
};

export interface BaseConnector {
  getBalance(): Promise<Balance>;

  balanceTTLSeconds(): number;
  cacheKey(): string;
}
