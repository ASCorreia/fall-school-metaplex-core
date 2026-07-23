/**
 * REFERENCE SOLUTION (spoilers!). Try scripts/2-mint-soulbound.ts yourself first.
 * Run: npm run solution
 */
import { generateSigner } from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { create } from "@metaplex-foundation/mpl-core";
import { getUmi, explorerAddress, explorerTx } from "../scripts/umi";

const NAME = "My Soulbound NFT";
const URI =
  "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json";

async function main() {
  const umi = getUmi();
  console.log("Minting from wallet:", umi.identity.publicKey.toString());

  // Every Core asset lives at its own address. Generate a signer for it.
  const asset = generateSigner(umi);

  // Create the asset with the PermanentFreezeDelegate plugin:
  //  - frozen: true            → born frozen: transfers & burns are rejected
  //  - authority: None         → nobody can ever thaw it → soulbound forever
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

  const sig = base58.deserialize(signature)[0];
  console.log("\nMinted soulbound NFT!");
  console.log("Asset address:", asset.publicKey.toString());
  console.log("Asset explorer link:", explorerAddress(asset.publicKey.toString()));
  console.log("Transaction:", explorerTx(sig));
}

main();
