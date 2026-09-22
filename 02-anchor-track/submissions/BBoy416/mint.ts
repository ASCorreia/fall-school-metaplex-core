/**
 * Christian Tomicic / BBoy416
 *
 * Devnet client for the Anchor soulbound NFT program.
 *
 * This script:
 * 1. Connects to Solana devnet.
 * 2. Loads the wallet specified by ANCHOR_WALLET.
 * 3. Generates a fresh address for the Metaplex Core asset.
 * 4. Calls our deployed Anchor program.
 * 5. Our program invokes MPL Core through CPI.
 * 6. The resulting asset is permanently frozen and non-transferable.
 *
 * Run from 02-anchor-track:
 *
 * ANCHOR_PROVIDER_URL=https://api.devnet.solana.com \
 * ANCHOR_WALLET="$HOME/.config/solana/id.json" \
 * npx ts-node submissions/BBoy416/mint.ts
 */

import * as anchor from "@anchor-lang/core";
import { Program } from "@anchor-lang/core";
import {
  Keypair,
  PublicKey,
  SystemProgram,
} from "@solana/web3.js";
import {
  createUmi,
} from "@metaplex-foundation/umi-bundle-defaults";
import {
  publicKey,
} from "@metaplex-foundation/umi";
import {
  fetchAsset,
} from "@metaplex-foundation/mpl-core";

import { SoulboundNft } from "../../target/types/soulbound_nft";

// The official Metaplex Core program address.
const MPL_CORE_PROGRAM_ID = new PublicKey(
  "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d",
);

// Information stored in the new Metaplex Core asset.
const NAME = "Christian's Anchor Soulbound NFT";

const URI =
  "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json";

async function main() {
  /**
   * AnchorProvider.env() reads:
   *
   * ANCHOR_PROVIDER_URL — the Solana RPC endpoint
   * ANCHOR_WALLET       — the wallet keypair file
   */
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  /**
   * Load the generated IDL.
   *
   * The IDL contains the deployed program address:
   * GKCedV7gKDyc57xiwvmKDZTMCiCgEr4a9C7qR9XGDHvA
   */
  const idl = require("../../target/idl/soulbound_nft.json");

  const program =
    new anchor.Program<SoulboundNft>(idl, provider);

  /**
   * Every Metaplex Core asset has its own Solana account.
   *
   * This fresh keypair supplies the new asset address and must sign
   * the creation transaction.
   */
  const asset = Keypair.generate();

  // Permanently bind the soulbound NFT to our deployment wallet.
  const owner = provider.wallet.publicKey;

  console.log("RPC endpoint:", provider.connection.rpcEndpoint);
  console.log("Anchor program:", program.programId.toBase58());
  console.log("Payer and owner:", owner.toBase58());
  console.log("New asset address:", asset.publicKey.toBase58());
  console.log("\nSending mint transaction...");

  /**
   * Call our deployed Anchor instruction.
   *
   * Our program then performs a CPI into Metaplex Core and attaches:
   *
   * PermanentFreezeDelegate {
   *   frozen: true,
   *   authority: None
   * }
   *
   * Because no plugin authority exists, nobody can thaw the NFT.
   */
  const signature = await program.methods
    .mintSoulboundNft(NAME, URI)
    .accountsPartial({
      payer: provider.wallet.publicKey,
      asset: asset.publicKey,
      owner,
      mplCoreProgram: MPL_CORE_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .signers([asset])
    .rpc();

  console.log("\nMint transaction confirmed!");

  /**
   * Print the important submission information immediately.
   *
   * This happens before fetching the asset because devnet RPC nodes may
   * take a few seconds to make a newly created account available.
   */
  const programAddress = program.programId.toBase58();
  const assetAddress = asset.publicKey.toBase58();

  console.log("Program ID:", programAddress);
  console.log("Asset address:", assetAddress);
  console.log("Transaction signature:", signature);

  console.log(
    "\nProgram Explorer:",
    `https://explorer.solana.com/address/${programAddress}?cluster=devnet`,
  );

  console.log(
    "Asset Explorer:",
    `https://explorer.solana.com/address/${assetAddress}?cluster=devnet`,
  );

  console.log(
    "Transaction Explorer:",
    `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
  );

  /**
   * Confirm that Metaplex can decode the newly created asset.
   *
   * A confirmed transaction can reach the RPC before the new account is
   * available through every RPC node. Retry instead of treating that
   * temporary indexing delay as a failed mint.
   */
  const umi = createUmi(provider.connection.rpcEndpoint);

  let coreAsset:
    | Awaited<ReturnType<typeof fetchAsset>>
    | undefined;

  for (let attempt = 1; attempt <= 10; attempt += 1) {
    try {
      coreAsset = await fetchAsset(
        umi,
        publicKey(assetAddress),
      );

      break;
    } catch (error) {
      if (attempt === 10) {
        throw error;
      }

      console.log(
        `Asset not visible through the RPC yet. Retrying (${attempt}/10)...`,
      );

      await new Promise((resolve) =>
        setTimeout(resolve, 2_000),
      );
    }
  }

  if (!coreAsset) {
    throw new Error("The asset could not be loaded after minting.");
  }

  if (coreAsset.permanentFreezeDelegate?.frozen !== true) {
    throw new Error(
      "The asset exists, but PermanentFreezeDelegate is not frozen.",
    );
  }

  console.log("\nPASS: Metaplex Core asset exists");
  console.log("PASS: PermanentFreezeDelegate is frozen");
  console.log("PASS: Soulbound NFT owner:", coreAsset.owner);
}

main().catch((error) => {
  console.error("\nFailed to mint the soulbound NFT:");
  console.error(error);
  process.exit(1);
});