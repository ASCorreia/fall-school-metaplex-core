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
      "web3theo's Soulbound Diploma",
      "https://gist.githubusercontent.com/Theophilus2003/6c19f3918a9f2ca3020a486a5a2ece14/raw/3cbe743a6b14a866bbad2a62d3a9ed9795570010/metadata.json"
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
