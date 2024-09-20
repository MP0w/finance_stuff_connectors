import { configDotenv } from "dotenv";
import { CurrencyExchange } from "./currencyExchange";
import { ConnectorProvider } from ".";

configDotenv({ path: ".env.local" });

const provider = new ConnectorProvider({
  currencyAPIKey: process.env.CURRENCY_API_KEY ?? "",
  zapperAPIKey: process.env.ZAPPER_API_KEY ?? "",
});

const currency = "EUR";

// ## Currency Exchange

// provider.currencyExchange.getExchangeEURUSDRate().then((rate) => {
//   console.log("rate", rate);
// });

// ## Binance
// const connection = provider.getConnector("binance", {
//   currency,
//   api_key: process.env.BINANCE_API_KEY!,
//   api_secret: process.env.BINANCE_API_SECRET!,
// });

// ## Debank
// const connection = provider.getConnector("debank", {
//   currency,
//   address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
//   api_key: process.env.DEBANK_API_KEY ?? ""
// });

// ## Indexa
// const connection = provider.getConnector("indexa", {
//   currency,
//   token: process.env.INDEXA_TOKEN!,
//   // account: "XXXXX",
// });

// ## BTC
// const connection = provider.getConnector("btc", {
//   currency,
//   token: process.env.INDEXA_TOKEN!,
//   addresses: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa,1BM1sAcrfV6d4zPKytzziu4McLQDsFC2Qc",
// });

// ## Custom
// const connection = provider.getConnector("hack", {
//   currency,
//   url: "https://gist.githubusercontent.com/MP0w/1f3fe84bbca6015c3c9960ab469a77b6/raw/52fbb64478a183944853388537e21822537d6a6f/gistfile1.txt",
// });

// ## Zapper
const connection = provider.getConnector("zapper", {
  currency,
  address: "0x0827Eb25A34801e09e5F9B823e667871B7FE9992",
});

connection.getBalance().then((balance) => {
  console.log("balance", balance);
});
