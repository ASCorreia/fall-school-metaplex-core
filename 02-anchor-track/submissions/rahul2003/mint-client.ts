/**
 * Client script to mint a soulbound NFT using the deployed Anchor program.
 * Run: npx tsx mint-client.ts
 */

import { generateSigner, percentAmount } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplCore } from "@metaplex-foundation/mpl-core";
import { generateKeyPairSigner } from "@metaplex-foundation/umi-web3js-adapters";
import { Keypair, PublicKey } from "@solana/web3.js";
import fs from "fs";
import path from "path";

// Your deployed program ID
const PROGRAM_ID = new PublicKey("FPuSTot8kVs4m9u6JQzYryVCX3XQyK4sdGEnNWiV7Ah6");
const MPL_CORE_ID = new PublicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");

async function main() {
  // Load wallet
  const walletPath = path.resolve(__dirname, "..", "..", "..", "wallet.json");
  const secretKey = new Uint8Array(JSON.parse(fs.readFileSync(walletPath, "utf8")));
  const keypair = Keypair.fromSecretKey(secretKey);

  // Create UMI instance
  const umi = createUmi("https://api.devnet.solana.com").use(mplCore());
  const signer = generateKeyPairSigner(umi, keypair);
  umi.use(keypairIdentity(signer));

  // Generate fresh asset keypair
  const asset = generateSigner(umi);

  // Program IDL (minimal for this instruction)
  const program = umi.programs.programs.get(PROGRAM_ID.toString());
  
  // Call the mint_soulbound_nft instruction
  const tx = await umi.rpc.sendTransaction(
    await umi.programs.programs.get(PROGRAM_ID.toString()).methods
      .mintSoulboundNft("My Soulbound NFT", "https://example.com/metadata.json")
      .accounts({
        payer: signer.publicKey,
        asset: asset.publicKey,
        owner: signer.publicKey,
        mplCoreProgram: MPL_CORE_ID,
        systemProgram: umi.programs.system.programId,
      })
      .signers([asset])
      .build()
  );

  console.log("Mint transaction:", `https://explorer.solana.com/tx/${tx}?cluster=devnet`);
  console.log("Asset address:", `https://explorer.solana.com/address/${asset.publicKey}?cluster=devnet`);

  // Update SUBMISSION.md with the asset address and tx signature
  console.log("\nUpdate SUBMISSION.md with the above links!");
}

import { keypairIdentity } from "@metaplex-foundation/umi";
main().catch(console.error);