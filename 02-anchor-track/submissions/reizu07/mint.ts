import * as anchor from "@anchor-lang/core";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { SoulboundNft } from "../../target/types/soulbound_nft";

const MPL_CORE = new PublicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");

async function main() {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SoulboundNft as anchor.Program<SoulboundNft>;
  const asset = Keypair.generate();
  const name = process.env.NFT_NAME ?? "reizu07's Diploma";

  const signature = await program.methods
    .mintSoulboundNft(name, "https://arweave.net/diploma.json")
    .accountsPartial({
      payer: provider.wallet.publicKey,
      asset: asset.publicKey,
      owner: provider.wallet.publicKey,
      mplCoreProgram: MPL_CORE,
      systemProgram: SystemProgram.programId,
    })
    .signers([asset])
    .rpc();

  console.log("Asset address:", asset.publicKey.toBase58());
  console.log("Transaction signature:", signature);
  console.log(
    "Explorer asset:",
    `https://explorer.solana.com/address/${asset.publicKey.toBase58()}?cluster=devnet`,
  );
  console.log(
    "Explorer transaction:",
    `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
