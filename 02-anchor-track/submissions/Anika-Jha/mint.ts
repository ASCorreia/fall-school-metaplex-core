import * as anchor from "@anchor-lang/core";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { SoulboundNft } from "../../target/types/soulbound_nft";

const MPL_CORE = new PublicKey(
  "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
);

async function main() {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SoulboundNft as anchor.Program<SoulboundNft>;

  const asset = Keypair.generate();

  const name = "Anika_Jha's Soulbound Diploma";
  const uri =
    "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json";

  console.log("Program:", program.programId.toString());
  console.log("Owner:", provider.wallet.publicKey.toString());
  console.log("Asset:", asset.publicKey.toString());

  const sig = await program.methods
    .mintSoulboundNft(name, uri)
    .accountsPartial({
      payer: provider.wallet.publicKey,
      asset: asset.publicKey,
      owner: provider.wallet.publicKey,
      mplCoreProgram: MPL_CORE,
      systemProgram: SystemProgram.programId,
    })
    .signers([asset])
    .rpc();

  console.log("Transaction:", sig);
  console.log(
    "Explorer:",
    `https://explorer.solana.com/address/${asset.publicKey.toString()}?cluster=devnet`
  );
  console.log(
    "Transaction Explorer:",
    `https://explorer.solana.com/tx/${sig}?cluster=devnet`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});