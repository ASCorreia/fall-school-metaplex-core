
import { generateSigner, none } from "@metaplex-foundation/umi";
import { create } from "@metaplex-foundation/mpl-core";
import { getUmi, explorerAddress } from "../../shared/umi";

// Personalize these! NAME should include your name or nickname.
const NAME = "Kundan";
const URI =
  "https://gist.githubusercontent.com/Kundankr30/fa83fd17b493692e98b7908f6e190743/raw/cbf7f7394cea6ff2132ebca03507022d560f47c5/gistfile1.txt";

async function main() {
  const umi = getUmi();
  const asset = generateSigner(umi);
  console.log("Minting from wallet:", umi.identity.publicKey.toString());
  await create(umi, {
  asset,
  name: NAME,
  uri: URI,
  plugins: [
    {
      type: "PermanentFreezeDelegate",
      frozen: true,
      authority:{ type: "None" },
    },
  ],
}).sendAndConfirm(umi);
  console.log("Asset address:", asset.publicKey.toString());
  console.log(explorerAddress(asset.publicKey.toString()));
}

main();
