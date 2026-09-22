/**
 * Step 2: Mint a soulbound Metaplex Core NFT on Solana devnet.
 *
 * Run:
 *   npm run mint
 *
 * A soulbound NFT stays permanently attached to its owner's wallet.
 * It cannot be transferred or sold.
 */

import { generateSigner } from "@metaplex-foundation/umi";
import { create } from "@metaplex-foundation/mpl-core";
import { getUmi, explorerAddress } from "../../shared/umi";

/**
 * The name stored inside the Metaplex Core asset.
 *
 * Including my name makes it clear that this is my Solana School
 * homework asset.
 */
const NAME = "Christian's Solana School Soulbound NFT";

/**
 * This URI points to the off-chain JSON metadata for the asset.
 *
 * The metadata contains information such as the image, description,
 * and other display properties used by wallets and explorers.
 */
const URI =
  "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json";

async function main() {
  /**
   * Create the Umi client.
   *
   * The shared helper connects Umi to Solana devnet and loads the
   * wallet stored in the repository's wallet.json file.
   */
  const umi = getUmi();

  console.log(
    "Minting from wallet:",
    umi.identity.publicKey.toString()
  );

  /**
   * Every Metaplex Core asset is its own Solana account.
   *
   * generateSigner creates a fresh keypair for that new asset account.
   * This is the address we will later inspect in Solana Explorer.
   */
  const asset = generateSigner(umi);

  /**
   * Create the Metaplex Core asset.
   *
   * PermanentFreezeDelegate makes the asset permanently frozen:
   *
   * - frozen: true
   *   The NFT begins in a frozen state.
   *
   * - authority: { type: "None" }
   *   Nobody has permission to unfreeze it later.
   *
   * Together, these settings make the NFT soulbound and prevent its
   * owner—or anyone else—from transferring it to another wallet.
   */
  await create(umi, {
    asset,
    name: NAME,
    uri: URI,
    plugins: [
      {
        type: "PermanentFreezeDelegate",
        frozen: true,
        authority: {
          type: "None",
        },
      },
    ],
  }).sendAndConfirm(umi);

  /**
   * Print the asset address so it can be passed to the verification
   * script and included with the homework submission.
   */
  const assetAddress = asset.publicKey.toString();

  console.log("\nSoulbound NFT created successfully!");
  console.log("Asset address:", assetAddress);
  console.log("Explorer:", explorerAddress(assetAddress));
}

main().catch((error) => {
  console.error("\nFailed to mint the soulbound NFT:");
  console.error(error);
  process.exit(1);
});