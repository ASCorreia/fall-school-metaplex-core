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
import { base58 } from "@metaplex-foundation/umi/serializers";
import { getUmi, explorerAddress, explorerTx } from "../../shared/umi";

// Personalize these! NAME should include your name or nickname.
const NAME = "Eshan's Soulbound Fall School NFT";
const URI =
  "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json";

async function main() {
  const umi = getUmi();
  console.log("Minting from wallet:", umi.identity.publicKey.toString());

  // ── YOUR CODE STARTS HERE ────────────────────────────────────────────

  // Every Core asset lives at its own address, and that address must sign the
  // creation transaction. It is a throwaway signer: once the asset exists, the
  // keypair has no further authority over it.
  const asset = generateSigner(umi);

  // The two fields that make this soulbound are both on PermanentFreezeDelegate:
  //
  //   frozen: true          - MPL Core rejects every transfer and burn while set.
  //   authority: { type: "None" } - nobody holds the authority to update the
  //                           plugin, so `frozen` can never be flipped back.
  //
  // Either one alone is not enough. Frozen with an update authority is just a
  // temporary freeze someone can thaw; authority "None" without frozen locks in
  // a plugin that is not actually restricting anything.
  const tx = await create(umi, {
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

  const signature = base58.deserialize(tx.signature)[0];

  console.log("\nSoulbound asset minted.");
  console.log("Asset address:", asset.publicKey.toString());
  console.log("Explorer:     ", explorerAddress(asset.publicKey.toString()));
  console.log("Transaction:  ", explorerTx(signature));

  // ── YOUR CODE ENDS HERE ──────────────────────────────────────────────
}

main();
