/**
 * Step 2 (YOUR TASK): mint a soulbound NFT on devnet.
 * Run: npm run mint
 *
 * Requirements (see GUIDE.md):
 *  - Create a Metaplex Core asset on devnet
 *  - Attach the PermanentFreezeDelegate plugin so it can NEVER be transferred
 *  - Print the asset address and its Solana Explorer link
 *
 * Docs: https://www.metaplex.com/docs/smart-contracts/core/guides/create-soulbound-nft-asset
 */
import { generateSigner } from "@metaplex-foundation/umi";
import { create } from "@metaplex-foundation/mpl-core";
import { getUmi, explorerAddress, explorerTx } from "./umi";

// Personalize these! NAME should include your name or nickname.
const NAME = "Time";
const URI =
  "01-easy-track/metadata.json";

async function main() {
  const umi = getUmi();
  console.log("Minting from wallet:", umi.identity.publicKey.toString());

  const asset = generateSigner(umi);
  const { signature } = await create(umi, {
    asset,
    name: NAME,
    uri: URI,
    plugins: [{
      type: "PermanentFreezeDelegate",
      frozen: true,
      authority: { type: "None" }
    }],
  }).sendAndConfirm(umi);
  console.log("Asset address:", asset.publicKey.toString());
  console.log("Explorer:", explorerAddress(asset.publicKey.toString()));
  console.log("Transaction:", explorerTx(signature.toString()));
}

main();
