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
import { base58 } from "@metaplex-foundation/umi/serializers";
import { create } from "@metaplex-foundation/mpl-core";
import { getUmi, explorerAddress, explorerTx } from "../../shared/umi";

// Personalize these! NAME should include your name or nickname.
const NAME = "the-axmc | Solana Fall School Diploma";
const URI =
  "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json";

async function main() {
  const umi = getUmi();
  console.log("Minting from wallet:", umi.identity.publicKey.toString());

  // ── YOUR CODE STARTS HERE ────────────────────────────────────────────

  // TODO 1: a Core asset is a single account at a brand-new address, so we
  // need a fresh keypair that co-signs its creation.
  const asset = generateSigner(umi);

  // TODO 2: create the asset with the PermanentFreezeDelegate plugin.
  //   frozen: true      -> Core rejects every transfer and burn from birth
  //   authority: None   -> nobody can ever update the plugin, so it can
  //                        never be thawed. Together these make it soulbound.
  //   (Permanent plugins can only be added at creation time.)
  const { signature } = await create(umi, {
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

  // TODO 3: print the address and the explorer links.
  const address = asset.publicKey.toString();
  console.log("Asset address:", address);
  console.log("Explorer:", explorerAddress(address));
  console.log("Mint tx:", explorerTx(base58.deserialize(signature)[0]));

  // ── YOUR CODE ENDS HERE ──────────────────────────────────────────────
}

main();
