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
const NAME = "Zai as Hiro Hamada";
const URI =
  "https://gist.githubusercontent.com/zaialamm/213830f29409d1816fda07c27b162f87/raw/zai-metadata.json";

async function main() {
  const umi = getUmi();
  console.log("Minting from wallet:", umi.identity.publicKey.toString());

  // ── YOUR CODE STARTS HERE ────────────────────────────────────────────

  // TODO 1: every Core asset lives at its own fresh address.
  const asset = generateSigner(umi);

  // TODO 2: create the asset with the PermanentFreezeDelegate plugin.
  //   frozen: true       -> frozen from birth, MPL Core rejects every transfer/burn
  //   authority: None    -> nobody can ever update the plugin, so it can never be thawed
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

  // TODO 3: print the asset address and its explorer link.
  console.log("Asset address:", asset.publicKey.toString());
  console.log("Explorer:", explorerAddress(asset.publicKey.toString()));
  console.log("Transaction:", explorerTx(base58.deserialize(signature)[0]));

  // ── YOUR CODE ENDS HERE ──────────────────────────────────────────────
}

main();
