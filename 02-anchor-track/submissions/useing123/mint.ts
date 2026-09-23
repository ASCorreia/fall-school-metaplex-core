import * as anchor from "@anchor-lang/core";
import { Program } from "@anchor-lang/core";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { SoulboundNft } from "../../target/types/soulbound_nft";
import idl from "../../target/idl/soulbound_nft.json";

const MPL_CORE_PROGRAM_ID = new PublicKey(
  "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
);

const PROGRAM_ID = new PublicKey("Dy9jeNRGHd5gB66RzhvfUrUBCjoQHJeeS9S71cUwRaMF");
const NAME = "useing123 Anchor Soulbound NFT";
const URI =
  "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json";

async function main() {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = new Program<SoulboundNft>(idl as any, provider);

  const asset = Keypair.generate();
  const recipient = provider.wallet.publicKey;

  console.log("Minting soulbound NFT via Anchor program...");
  console.log("Program ID:", PROGRAM_ID.toBase58());
  console.log("Payer / Owner:", recipient.toBase58());
  console.log("Asset address:", asset.publicKey.toBase58());

  const tx = await program.methods
    .mintSoulboundNft(NAME, URI)
    .accountsPartial({
      payer: recipient,
      asset: asset.publicKey,
      owner: recipient,
      mplCoreProgram: MPL_CORE_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .signers([asset])
    .rpc();

  console.log("\nSuccess!");
  console.log("Transaction:", `https://explorer.solana.com/tx/${tx}?cluster=devnet`);
  console.log("Asset:", `https://explorer.solana.com/address/${asset.publicKey.toBase58()}?cluster=devnet`);
  console.log("Program:", `https://explorer.solana.com/address/${PROGRAM_ID.toBase58()}?cluster=devnet`);
}

main().catch(console.error);
