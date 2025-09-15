import { defineChain } from "thirdweb/chains";


export const SomniaTestnet = defineChain({
id: 50312,
rpc: "https://dream-rpc.somnia.network/",
nativeCurrency: {
name: "Somnia-Testnet",
symbol: "STT",
decimals: 18,
},
blockExplorers: [
  {
    name: "Somnia Explorer",
    url: "https://shannon-explorer.somnia.network/",
  },
],
});
