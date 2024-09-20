import NodeCache from "node-cache";
import { BaseConnector } from "./connectors/base_connector";
import { BinanceConnector } from "./connectors/binance";
import { BTCConnector } from "./connectors/btc";
import { DebankConnector } from "./connectors/debank";
import { HackConnector } from "./connectors/hack";
import { IndexaConnector } from "./connectors/indexa";
import { ZapperConnector } from "./connectors/zapper";
import { CurrencyExchange } from "./currencyExchange";
import { TTLConnectorWrapper } from "./TTLConnectorWrapper";

type AccountType = "fiat" | "investment";

type ConnectorSetting = "string" | "number" | "boolean";
type ConnectorId = "binance" | "indexa" | "debank" | "btc" | "hack" | "zapper";

type Connector = {
  id: ConnectorId;
  name: string;
  type?: AccountType;
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
    id: "zapper",
    name: "ETH / DeFi (EVM chains portfolios)",
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
    id: "debank",
    name: "Debank (ETH / EVM)",
    type: "investment",
    icon: "debank.png",
    settings: [
      {
        key: "api_key",
        type: "string",
        hint: "API key",
        extraInstructions: "Get a Debank API Key",
      },
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
  {
    id: "btc",
    name: "BTC",
    type: "investment",
    icon: "btc.png",
    settings: [
      {
        key: "addresses",
        type: "string",
        hint: "Addresses",
        extraInstructions: "A comma separated list of BTC addresses",
      },
    ],
  },
  {
    id: "hack",
    name: "Custom",
    icon: "hack.png",
    settings: [
      {
        key: "url",
        type: "string",
        hint: "URL",
        extraInstructions:
          "We will call your url, needs to return a json with a value key containing the amount (optionally also a cost key)",
      },
    ],
  },
];

export type ConnectorProviderConfig = {
  currencyAPIKey: string;
  zapperAPIKey: string;
};

export class ConnectorProvider {
  currencyExchange: CurrencyExchange;
  config: ConnectorProviderConfig;
  cache = new NodeCache({ checkperiod: 10 * 60 });

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
    return new TTLConnectorWrapper(
      this.getUncachedConnector(id, settings),
      id,
      this.cache
    );
  }

  private getUncachedConnector(
    id: ConnectorId,
    settings: Record<string, any>
  ): BaseConnector {
    if (settings.currency !== "USD" && settings.currency !== "EUR") {
      throw new Error("Currency must be USD or EUR");
    }

    switch (id) {
      case "binance":
        return new BinanceConnector(settings, this.currencyExchange);
      case "debank":
        return new DebankConnector(settings, this.currencyExchange);
      case "indexa":
        return new IndexaConnector(settings, this.currencyExchange);
      case "btc":
        return new BTCConnector(settings, this.currencyExchange);
      case "hack":
        return new HackConnector(settings);
      case "zapper":
        return new ZapperConnector(
          this.config.zapperAPIKey,
          settings,
          this.currencyExchange
        );
    }
  }
}

export type { Connector, ConnectorId, ConnectorSetting };
