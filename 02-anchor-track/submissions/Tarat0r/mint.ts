import * as anchor from "@anchor-lang/core";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { SoulboundNft } from "../../target/types/soulbound_nft";

const MPL_CORE = new PublicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");

async function main() {
  // Reads ANCHOR_PROVIDER_URL and ANCHOR_WALLET (see the run command below)
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.SoulboundNft as anchor.Program<SoulboundNft>;

  const asset = Keypair.generate(); // the new NFT's address

  const sig = await program.methods
    .mintSoulboundNft(
      "Vassil's Diploma",
      "https://gist.githubusercontent.com/Tarat0r/6bc520067a6085c9e12766ae27c2f05d/raw/df496eb752c74a260d8a375b8cce138b8a9923c9/gistfile1.txt",
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

  // print the asset address and the transaction signature
  console.log("Minted soulbound NFT with address:", asset.publicKey.toString());
  console.log("Transaction signature:", sig);
}

main();
