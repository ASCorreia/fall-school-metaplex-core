import * as anchor from "@anchor-lang/core";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import type { SoulboundNft } from "../../target/types/soulbound_nft";

const MPL_CORE = new PublicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");
const NAME  = "Hey Jude";
const URI = "https://gist.githubusercontent.com/Kundankr30/fa83fd17b493692e98b7908f6e190743/raw/428f8cf3614717bf54eebaa9c28a671ab6c5bd09/gistfile1.txt"

async function main() {
  // Reads ANCHOR_PROVIDER_URL and ANCHOR_WALLET (see the run command below)
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.SoulboundNft as anchor.Program<SoulboundNft>;

  const asset = Keypair.generate();   // the new NFT's address

  const sig = await program.methods
    .mintSoulboundNft(NAME, URI)
    .accountsPartial({
      // payer, asset, owner, mplCoreProgram, systemProgram
      payer : provider.wallet.publicKey,
      asset : asset.publicKey,
      owner : provider.wallet.publicKey,
      mplCoreProgram:MPL_CORE,
      systemProgram:SystemProgram.programId,
    })
    .signers([asset])
    .rpc();
  console.log("\nMinted soulbound NFT!");
  console.log("Asset address:", asset.publicKey.toString());
  console.log(
    "Asset explorer link:",
    `https://explorer.solana.com/address/${asset.publicKey.toString()}?cluster=devnet`,
  );
  console.log("Transaction:", `https://explorer.solana.com/tx/${sig}?cluster=devnet`);

}

main();