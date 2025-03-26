import { defineChain } from "thirdweb/chains";


export const lineaTestnet = defineChain({
id: 59141,
rpc: "https://rpc.sepolia.linea.build",
nativeCurrency: {
name: "linea-sepolia",
symbol: "ETH",
decimals: 18,
},
});
