import * as anchor from "@anchor-lang/core";
import { Program } from "@anchor-lang/core";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { SoulboundNft } from "../../target/types/soulbound_nft";

const MPL_CORE_PROGRAM_ID = new PublicKey(
  "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d",
);
const NAME = "Muzzy's Fall School Diploma (Anchor)";
const URI = "https://arweave.net/diploma.json";

async function main() {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SoulboundNft as Program<SoulboundNft>;
  const asset = Keypair.generate();

  const signature = await program.methods
    .mintSoulboundNft(NAME, URI)
    .accountsPartial({
      payer: provider.wallet.publicKey,
      asset: asset.publicKey,
      owner: provider.wallet.publicKey,
      mplCoreProgram: MPL_CORE_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .signers([asset])
    .rpc();

  console.log("Program ID:", program.programId.toBase58());
  console.log("Wallet address:", provider.wallet.publicKey.toBase58());
  console.log("Asset address:", asset.publicKey.toBase58());
  console.log(
    "Asset explorer:",
    `https://explorer.solana.com/address/${asset.publicKey.toBase58()}?cluster=devnet`,
  );
  console.log("Mint transaction:", signature);
  console.log(
    "Transaction explorer:",
    `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
  );
}

main();
