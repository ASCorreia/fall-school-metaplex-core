/**
 * Step 2: mint a soulbound NFT on devnet.
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
const NAME = "Xinyan Liu's Solana Fall School Diploma";
const URI =
  "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json";

async function main() {
  const umi = getUmi();
  console.log("Minting from wallet:", umi.identity.publicKey.toString());

  // TODO 1: every Core asset lives at its own fresh address, so we generate a
  // signer for it (it must sign the creation transaction).
  const asset = generateSigner(umi);

  // TODO 2: create the asset with the PermanentFreezeDelegate plugin.
  //   frozen: true            -> born frozen: MPL Core rejects transfers & burns
  //   authority: { type: "None" } -> nobody can update the plugin, so nobody can
  //                                  ever thaw it. That is what makes it permanent.
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

  // TODO 3: print the result (address + clickable explorer links).
  console.log("\nMinted soulbound NFT:", NAME);
  console.log("Asset address:", asset.publicKey.toString());
  console.log("Asset explorer link:", explorerAddress(asset.publicKey.toString()));
  console.log("Transaction:", explorerTx(base58.deserialize(signature)[0]));
}

main();
