/**
 * Step 2 (YOUR TASK): mint a soulbound NFT on devnet.
 * Run: npm run mint
 */
import { generateSigner } from "@metaplex-foundation/umi";
import { create } from "@metaplex-foundation/mpl-core";
import { getUmi, explorerAddress } from "../../shared/umi";

// Personalize these! NAME should include your name or nickname.
const NAME = "Reuben Soh's Diploma";
const URI =
  "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json";

async function main() {
  const umi = getUmi();
  console.log("Minting from wallet:", umi.identity.publicKey.toString());

  // TODO 1: Generate a fresh address keypair for the asset
  const asset = generateSigner(umi);

  // TODO 2: Create the Core asset with PermanentFreezeDelegate plugin
  await create(umi, {
    asset,
    name: NAME,
    uri: URI,
    plugins: [
      {
        type: "PermanentFreezeDelegate",
        frozen: true,
        authority: { type: "None" },
      },
    ],
  }).sendAndConfirm(umi);

  // TODO 3: Print the asset address and Explorer link
  console.log(`Asset address: ${asset.publicKey.toString()}`);
  console.log(`Explorer: ${explorerAddress(asset.publicKey.toString())}`);
}

main();