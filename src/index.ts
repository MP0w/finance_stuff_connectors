import { BaseConnector } from "./connectors/base_connector";
import { BinanceConnector } from "./connectors/binance";
import { DebankConnector } from "./connectors/debank";
import { IndexaConnector } from "./connectors/indexa";

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
  }[];
};

const connectorSettings: Connector[] = [
  {
    id: "binance",
    name: "Binance",
    type: "investment",
    icon: "https://public.bnbstatic.com/20190405/eb2349c3-b2f8-4a93-a286-8f86a62ea9d8.png",
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
    icon: "https://cdn.pixabay.com/photo/2021/05/24/09/15/ethereum-logo-6278329_1280.png",
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
    icon: "https://images.crunchbase.com/image/upload/c_pad,h_256,w_256,f_auto,q_auto:eco,dpr_1/v1450203189/y2gnamiis793yetubktt.png",
    settings: [
      {
        key: "api_key",
        type: "string",
        hint: "API key",
      },
      {
        key: "api_secret",
        type: "string",
        hint: "API secret",
      },
    ],
  },
];

function getConnector(
  id: ConnectorId,
  settings: Record<string, any>
): BaseConnector {
  switch (id) {
    case "binance":
      return new BinanceConnector(settings);
    case "debank":
      return new DebankConnector(settings);
    case "indexa":
      return new IndexaConnector(settings);
  }
}

export { connectorSettings, getConnector };

export type { Connector, ConnectorId, ConnectorSetting, BaseConnector };