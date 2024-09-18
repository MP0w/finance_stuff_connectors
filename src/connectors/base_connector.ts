export interface BaseConnector {
  getBalance(): Promise<number>;
}
