export interface BaseConnector {
  settings: Record<string, any>;

  getBalance(): Promise<number>;
}
