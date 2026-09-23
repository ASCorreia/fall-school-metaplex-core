import * as anchor from "@anchor-lang/core";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { SoulboundNft } from "../../target/types/soulbound_nft";

const MPL_CORE = new PublicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");

async function main() {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.SoulboundNft as anchor.Program<SoulboundNft>;

  const asset = Keypair.generate();

  const name = "Gaurav Mandal's Diploma";
  const uri =
    "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json";

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

  console.log("Minted soulbound NFT via Anchor program!");
  console.log("Program ID:", program.programId.toBase58());
  console.log("Asset address:", asset.publicKey.toBase58());
  console.log(
    `Asset explorer link: https://explorer.solana.com/address/${asset.publicKey.toBase58()}?cluster=devnet`
  );
  console.log(`Transaction: https://explorer.solana.com/tx/${sig}?cluster=devnet`);
}

main();
