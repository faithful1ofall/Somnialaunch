import { defineChain } from "thirdweb/chains";


export const RootTestnet = defineChain({
id: 31,
rpc: "https://rootstock-testnet.g.alchemy.com/v2/ZB6Wo-sBf0yX_LQfFlhsnqTFoM6TNnjU",
nativeCurrency: {
name: "RootStock-Testnet",
symbol: "RBTC",
decimals: 18,
},
});
