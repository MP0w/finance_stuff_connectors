"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectorSettings = void 0;
exports.getConnector = getConnector;
const binance_1 = require("./connectors/binance");
const debank_1 = require("./connectors/debank");
const indexa_1 = require("./connectors/indexa");
const connectorSettings = [
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
                extraInstructions: "Make sure to use a valid ETH / EVM address. This is the address that will be used to connect to Debank and get the balance acrosss all supported chains.",
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
