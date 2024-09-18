import { BaseConnector } from "./connectors/base_connector";
import { BinanceConnector } from "./connectors/binance";
import { DebankConnector } from "./connectors/debank";
import { IndexaConnector } from "./connectors/indexa";
import { CurrencyExchange } from "./currencyExchange";

type AccountType = "fiat" | "investment";

type ConnectorSetting = "string" | "number" | "boolean";
type ConnectorId = "binance" | "indexa" | "debank";

type Connector = {
  id: ConnectorId;
  name: string;
  type: AccountType;
  icon: string | undefined;
  settings: {
    key: string;
    hint: string;
    extraInstructions?: string;
    type: ConnectorSetting;
    optional?: boolean;
  }[];
};

const getConnectorSettings: () => Connector[] = () => [
  {
    id: "binance",
    name: "Binance",
    type: "investment",
    icon: "binance.png",
    settings: [
      {
        key: "api_key",
        type: "string",
        hint: "API key",
        extraInstructions: "Generate a readonly API Key",
      },
      {
        key: "api_secret",
        type: "string",
        hint: "API secret",
      },
    ],
  },
  {
    id: "debank",
    name: "ETH / EVM address (Debank)",
    type: "investment",
    icon: "eth.png",
    settings: [
      {
        key: "address",
        type: "string",
        hint: "ETH / EVM address",
        extraInstructions:
          "Make sure to use a valid ETH / EVM address. This is the address that will be used to connect to Debank and get the balance acrosss all supported chains.",
      },
    ],
  },
  {
    id: "indexa",
    name: "Indexa capital",
    type: "investment",
    icon: "indexa.png",
    settings: [
      {
        key: "token",
        type: "string",
        hint: "API Token",
        extraInstructions:
          "Indexa APIs are readonly, we can't do anything else than reading data. Generate a token following these instructions: https://support.indexacapital.com/es/esp/introduccion-api",
      },
      {
        key: "accounts",
        type: "string",
        hint: "Accounts",
        optional: true,
        extraInstructions:
          "Leave it empty if you want to fetch the balance of all your accounts. Otherwise a comma separated list of accounts, you can find your account number in indexa (e.g. PE4TPPLP)",
      },
    ],
  },
];

export type ConnectorProviderConfig = {
  debankAPIKey: string;
  currencyAPIKey: string;
};

export class ConnectorProvider {
  currencyExchange: CurrencyExchange;
  config: ConnectorProviderConfig;

  constructor(config: ConnectorProviderConfig) {
    this.config = config;
    this.currencyExchange = new CurrencyExchange(config.currencyAPIKey);
  }

  connectorSettings: Connector[] = getConnectorSettings().map((c) => {
    return {
      ...c,
      icon: `https://mpow.dev/finance_stuff_connectors/icons/${c.icon}`,
    };
  });

  getConnector(id: ConnectorId, settings: Record<string, any>): BaseConnector {
    if (settings.currency !== "USD" && settings.currency !== "EUR") {
      throw new Error("Currency must be USD or EUR");
    }

    switch (id) {
      case "binance":
        return new BinanceConnector(settings, this.currencyExchange);
      case "debank":
        return new DebankConnector(
          this.config.debankAPIKey,
          settings,
          this.currencyExchange
        );
      case "indexa":
        return new IndexaConnector(settings, this.currencyExchange);
      default:
        throw new Error("Connector not found");
    }
  }
}

export type { Connector, ConnectorId, ConnectorSetting };
