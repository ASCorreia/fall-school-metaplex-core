import * as anchor from "@anchor-lang/core";
import { Program } from "@anchor-lang/core";
import { Keypair, PublicKey } from "@solana/web3.js";
import { SoulboundNft } from "../../target/types/soulbound_nft";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

const MPL_CORE_PROGRAM_ID = new PublicKey(
  "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d",
);

async function main() {
  // Set up the provider from the environment (reads ANCHOR_PROVIDER_URL / ANCHOR_WALLET)
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SoulboundNft as Program<SoulboundNft>;

  // Fresh keypair for the new Core asset (must co-sign creation)
  const assetKeypair = Keypair.generate();

  // The wallet the NFT is permanently bound to — mint to our own wallet
  const recipient = provider.wallet.publicKey;

  const name = "Solana Fall School Diploma";
  const uri = "https://arweave.net/diploma.json";

  console.log("🚀 Minting soul-bound NFT...");
  console.log(`   Program:   ${program.programId.toBase58()}`);
  console.log(`   Asset:     ${assetKeypair.publicKey.toBase58()}`);
  console.log(`   Recipient: ${recipient.toBase58()}`);
  console.log(`   Name:      ${name}`);
  console.log(`   URI:       ${uri}`);

  const txSig = await program.methods
    .mintSoulboundNft(name, uri)
    .accountsPartial({
      payer: provider.wallet.publicKey,
      asset: assetKeypair.publicKey,
      owner: recipient,
      mplCoreProgram: MPL_CORE_PROGRAM_ID,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([assetKeypair])
    .rpc();

  console.log("\n✅ Soul-bound NFT minted successfully!");
  console.log(`   Transaction: ${txSig}`);
  console.log(
    `   Explorer:    https://explorer.solana.com/tx/${txSig}?cluster=devnet`,
  );
  console.log(
    `   Asset:       https://explorer.solana.com/address/${assetKeypair.publicKey.toBase58()}?cluster=devnet`,
  );
}

main().catch((err) => {
  console.error("❌ Minting failed:", err);
  process.exit(1);
});

