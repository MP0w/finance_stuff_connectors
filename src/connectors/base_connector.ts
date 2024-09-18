export interface BaseConnector {
  getBalance(): Promise<{ value: number; cost?: number }>;
}
