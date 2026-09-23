import * as anchor from "@anchor-lang/core";
import { Program } from "@anchor-lang/core";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import idl from "../target/idl/soulbound_nft.json";

const MPL_CORE = new PublicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");

async function main() {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = new Program(idl as anchor.Idl, provider);

  const asset = Keypair.generate();
  const owner = provider.wallet.publicKey;

  const sig = await program.methods
    .mintSoulboundNft("Vara Soulbound Anchor", "https://arweave.net/diploma.json")
    .accountsPartial({
      payer: owner,
      asset: asset.publicKey,
      owner,
      mplCoreProgram: MPL_CORE,
      systemProgram: SystemProgram.programId,
    })
    .signers([asset])
    .rpc();

  console.log("Program:", program.programId.toBase58());
  console.log("Asset:", asset.publicKey.toBase58());
  console.log("Owner:", owner.toBase58());
  console.log("Tx:", sig);
  console.log(
    "Asset explorer: https://explorer.solana.com/address/" +
      asset.publicKey.toBase58() +
      "?cluster=devnet",
  );
  console.log(
    "Tx explorer: https://explorer.solana.com/tx/" + sig + "?cluster=devnet",
  );
}

main();
