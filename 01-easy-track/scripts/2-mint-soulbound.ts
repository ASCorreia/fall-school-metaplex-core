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
const NAME = "web3theo's Soulbound Diploma";
const URI =
  "https://gist.githubusercontent.com/Theophilus2003/6c19f3918a9f2ca3020a486a5a2ece14/raw/3cbe743a6b14a866bbad2a62d3a9ed9795570010/metadata.json";

async function main() {
  const umi = getUmi();
  console.log("Minting from wallet:", umi.identity.publicKey.toString());

  // ── YOUR CODE STARTS HERE ────────────────────────────────────────────

  // TODO 1: Every Core asset lives at its own fresh address.
  const asset = generateSigner(umi);

  // TODO 2: Create it with the PermanentFreezeDelegate plugin, frozen
  //         forever (frozen: true), with no authority able to unfreeze it
  //         (authority: { type: "None" }).
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

  // TODO 3: Print the asset address and explorer link.
  console.log("Asset address:", asset.publicKey.toString());
  console.log("Explorer:", explorerAddress(asset.publicKey.toString()));

  // ── YOUR CODE ENDS HERE ──────────────────────────────────────────────
}

main();
