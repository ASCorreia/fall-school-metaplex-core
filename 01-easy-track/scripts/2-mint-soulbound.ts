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
const NAME = "Pablo's Solana Fall School Diploma";
const URI =
  "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json";

async function main() {
  const umi = getUmi();
  console.log("Minting from wallet:", umi.identity.publicKey.toString());

  // A Core asset is one account, and it lives at its own fresh address. The
  // keypair has to co-sign the create instruction, which is what proves nobody
  // squatted the address first.
  const asset = generateSigner(umi);

  const { signature } = await create(umi, {
    asset,
    name: NAME,
    uri: URI,
    plugins: [
      {
        type: "PermanentFreezeDelegate",
        // Frozen from birth: MPL Core rejects transfer and burn.
        frozen: true,
        // ...and nobody holds the authority to update the plugin, so nobody
        // can ever thaw it. `frozen: true` alone is only a temporary lock.
        // Both fields are load-bearing; drop either and it is transferable.
        authority: { type: "None" },
      },
    ],
  }).sendAndConfirm(umi);

  const address = asset.publicKey.toString();
  console.log("\nAsset address:", address);
  console.log("Explorer:     ", explorerAddress(address));
  console.log("Transaction:  ", explorerTx(base58.deserialize(signature)[0]));
  console.log("\nVerify it:  npm run verify --", address);
}

main();
