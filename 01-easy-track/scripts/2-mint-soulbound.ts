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
const NAME = "YO_YO_YO_Osotomakanihsotas";
const URI =
  "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json";

async function main() {
  const umi = getUmi();
  console.log("Minting from wallet:", umi.identity.publicKey.toString());

  // ── YOUR CODE STARTS HERE ────────────────────────────────────────────
  //
  // TODO 1: Every Core asset lives at its own fresh address.
  //         Generate a signer for it with generateSigner(umi).
  //
  // TODO 2: Call create(umi, { ... }) with:
  //         - asset, name: NAME, uri: URI
  //         - a `plugins` array containing ONE plugin that makes the
  //           asset frozen forever, with an authority nobody controls.
  //           (Hint: PermanentFreezeDelegate. Which two fields make the
  //           freeze permanent?)
  //         Then .sendAndConfirm(umi)
  //
  // TODO 3: Print the asset address and explorerAddress(...) link.
  //
  const asset = generateSigner(umi);

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

  const transaction = base58.deserialize(signature)[0];
  console.log("Minted soulbound NFT!");
  console.log("Asset address:", asset.publicKey.toString());
  console.log("Asset explorer link:", explorerAddress(asset.publicKey.toString()));
  console.log("Transaction:", explorerTx(transaction));

  // ── YOUR CODE ENDS HERE ──────────────────────────────────────────────
}

main();
