import * as anchor from "@anchor-lang/core";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { SoulboundNft } from "../../target/types/soulbound_nft.js";

const MPL_CORE = new PublicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");

async function main() {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.SoulboundNft as anchor.Program<SoulboundNft>;

  const asset = Keypair.generate();

  const sig = await program.methods
    .mintSoulboundNft("Arkiteckt's Diploma", "https://arweave.net/diploma.json")
    .accountsPartial({
      payer: provider.wallet.publicKey,
      asset: asset.publicKey,
      owner: provider.wallet.publicKey,
      mplCoreProgram: MPL_CORE,
      systemProgram: SystemProgram.programId,
    })
    .signers([asset])
    .rpc();

  console.log("Asset:", asset.publicKey.toString());
  console.log("Asset explorer:", `https://explorer.solana.com/address/${asset.publicKey.toString()}?cluster=devnet`);
  console.log("Tx explorer:", `https://explorer.solana.com/tx/${sig}?cluster=devnet`);
}

main();
