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
      "Vedansh's Fall School Diploma",
      "https://gist.githubusercontent.com/VedanshShuklaa/9d58706a42892a0ec6010a18ce609bd4/raw/dfe93c99d24a8b49a728f27fbddf118ed3c0d04a/soulbound-diploma.json",
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

  console.log("Minted soul-bound Core NFT via Anchor program!");
  console.log("Asset address:", asset.publicKey.toString());
  console.log(
    "Asset explorer link:",
    `https://explorer.solana.com/address/${asset.publicKey.toString()}?cluster=devnet`,
  );
  console.log("Transaction:", sig);
  console.log(
    "Transaction explorer link:",
    `https://explorer.solana.com/tx/${sig}?cluster=devnet`,
  );
}

main();
