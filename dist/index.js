"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectorProvider = void 0;
const binance_1 = require("./connectors/binance");
const debank_1 = require("./connectors/debank");
const indexa_1 = require("./connectors/indexa");
const currencyExchange_1 = require("./currencyExchange");
const getConnectorSettings = () => [
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
                extraInstructions: "Make sure to use a valid ETH / EVM address. This is the address that will be used to connect to Debank and get the balance acrosss all supported chains.",
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
                extraInstructions: "Indexa APIs are readonly, we can't do anything else than reading data. Generate a token following these instructions: https://support.indexacapital.com/es/esp/introduccion-api",
            },
            {
                key: "accounts",
                type: "string",
                hint: "Accounts",
                optional: true,
                extraInstructions: "Leave it empty if you want to fetch the balance of all your accounts. Otherwise a comma separated list of accounts, you can find your account number in indexa (e.g. PE4TPPLP)",
            },
        ],
    },
];
class ConnectorProvider {
    constructor(config) {
        this.connectorSettings = getConnectorSettings().map((c) => {
            return {
                ...c,
                icon: `https://mpow.dev/finance_stuff_connectors/icons/${c.icon}`,
            };
        });
        this.config = config;
        this.currencyExchange = new currencyExchange_1.CurrencyExchange(config.currencyAPIKey);
    }
    getConnector(id, settings) {
        if (settings.currency !== "USD" && settings.currency !== "EUR") {
            throw new Error("Currency must be USD or EUR");
        }
        switch (id) {
            case "binance":
                return new binance_1.BinanceConnector(settings, this.currencyExchange);
            case "debank":
                return new debank_1.DebankConnector(this.config.debankAPIKey, settings, this.currencyExchange);
            case "indexa":
                return new indexa_1.IndexaConnector(settings, this.currencyExchange);
            default:
                throw new Error("Connector not found");
        }
    }
}
exports.ConnectorProvider = ConnectorProvider;
