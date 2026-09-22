/**
 * Step 2 (YOUR TASK): mint a soulbound NFT on devnet.
 * Run: npm run mint
 *
 * Requirements (see README.md):
 *  - Create a Metaplex Core asset on devnet
 *  - Attach the PermanentFreezeDelegate plugin so it can NEVER be transferred
 *  - Print the asset address and its Solana Explorer link
 *
 * Docs: https://www.metaplex.com/docs/smart-contracts/core/guides/create-soulbound-nft-asset
 */
import { generateSigner } from "@metaplex-foundation/umi";
import { create } from "@metaplex-foundation/mpl-core";
import { getUmi, explorerAddress } from "../../shared/umi";

// Personalize these! NAME should include your name or nickname.
const NAME = "LunaticAss";
const URI =
  "https://gist.githubusercontent.com/DweetParikh/148123c22b2e68a0058fde4f09721ceb/raw/c78836c70280881c5ea825f8c8028df446578aa4/gistfile1.txt";

async function main() {
  const umi = getUmi();
  console.log("Minting from wallet:", umi.identity.publicKey.toString());

  const asset = generateSigner(umi);            // Signer for the asset

  const {signature} = await create(umi,{  
    asset,
    name: NAME,
    uri: URI,
    plugins: [
      {
        type: "PermanentFreezeDelegate",
        frozen: true,                           // Plugins for a Soulbound NFT
        authority: {type: "None"},
      },
    ],
  }).sendAndConfirm(umi);

  console.log("Asset Address: ", asset.publicKey.toString());
  console.log("Explorer: ", explorerAddress(asset.publicKey.toString()));
}

main();
