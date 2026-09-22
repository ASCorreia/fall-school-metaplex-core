import * as anchor from "@anchor-lang/core";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { SoulboundNft } from "../../target/types/soulbound_nft";

const MPL_CORE = new PublicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");

async function main() {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.SoulboundNft as anchor.Program<SoulboundNft>;

  const asset = Keypair.generate();

  const sig = await program.methods
    .mintSoulboundNft(
      "Stathis's Soulbound Diploma",
      "https://gist.githubusercontent.com/stathisKyrilis/c3095bd491672fd9cc20732978e16605/raw/ac63c42b682cc17e03f7c3df73fe8dbd852c32c3/stathis-soulbound-diploma.jpg"
    )
    .accountsPartial({
      payer: provider.wallet.publicKey,
      asset: asset.publicKey,
      owner: provider.wallet.publicKey,
      mplCoreProgram: MPL_CORE,
      systemProgram: SystemProgram.programId,
    })
    .signers([asset])
    .rpc();

  console.log("Asset address:", asset.publicKey.toString());
  console.log("Transaction signature:", sig);
  console.log(
    "Explorer (asset):",
    `https://explorer.solana.com/address/${asset.publicKey.toString()}?cluster=devnet`
  );
  console.log(
    "Explorer (tx):",
    `https://explorer.solana.com/tx/${sig}?cluster=devnet`
  );
}

main();
