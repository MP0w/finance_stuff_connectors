import { configDotenv } from "dotenv";
import { CurrencyExchange } from "./currencyExchange";
import { ConnectorProvider } from ".";

configDotenv({ path: ".env.local" });

const provider = new ConnectorProvider({
  currencyAPIKey: process.env.CURRENCY_API_KEY ?? "",
  debankAPIKey: process.env.DEBANK_API_KEY ?? "",
});

const currency = "EUR";

// ## Currency Exchange

// provider.currencyExchange.getExchangeEURUSDRate().then((rate) => {
//   console.log("rate", rate);
// });

// ## Binance
// const binance = provider.getConnector("binance", {
//   currency,
//   api_key: process.env.BINANCE_API_KEY!,
//   api_secret: process.env.BINANCE_API_SECRET!,
// });

// binance.getBalance().then((balance) => {
//   console.log("balance", balance);
// });

// ## Debank
// const debank = provider.getConnector("debank", {
//   currency,
//   address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
// });

// debank.getBalance().then((balance) => {
//   console.log("balance", balance);
// });

// ## Indexa
// const indexa = provider.getConnector("indexa", {
//   currency,
//   token: process.env.INDEXA_TOKEN!,
//   // account: "XXXXX",
// });

// indexa.getBalance().then((balance) => {
//   console.log("balance", balance);
// });
