"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectorSettings = void 0;
exports.getConnector = getConnector;
const binance_1 = require("./connectors/binance");
const debank_1 = require("./connectors/debank");
const indexa_1 = require("./connectors/indexa");
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
const connectorSettings = getConnectorSettings().map((c) => {
    return {
        ...c,
        icon: `https://mpow.dev/finance_stuff_connectors/icons/${c.icon}`,
    };
});
exports.connectorSettings = connectorSettings;
function getConnector(id, settings) {
    switch (id) {
        case "binance":
            return new binance_1.BinanceConnector(settings);
        case "debank":
            return new debank_1.DebankConnector(settings);
        case "indexa":
            return new indexa_1.IndexaConnector(settings);
    }
}
