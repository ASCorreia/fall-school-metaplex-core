import * as anchor from "@anchor-lang/core";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { SoulboundNft } from "../../target/types/soulbound_nft";

const MPL_CORE = new PublicKey(
  "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d",
);
const URI =
  "https://gist.githubusercontent.com/ziffer07/2fe867b7ab45005a86f089a7d793baea/raw/2a7f0743dec1b00266b51ea06a1dc0b92d14bad0/gistfile1.txt";

async function main() {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.SoulboundNft as anchor.Program<SoulboundNft>;

  const asset = Keypair.generate();
  const owner = provider.wallet.publicKey;

  const signature = await program.methods
    .mintSoulboundNft("MOODI JI's Diploma", URI)
    .accountsPartial({
      payer: owner,
      asset: asset.publicKey,
      owner,
      mplCoreProgram: MPL_CORE,
      systemProgram: SystemProgram.programId,
    })
    .signers([asset])
    .rpc();

  const assetAddress = asset.publicKey.toBase58();
  const cluster = "?cluster=devnet";
  console.log("Asset address:", assetAddress);
  console.log(
    "Asset Explorer:",
    `https://explorer.solana.com/address/${assetAddress}${cluster}`,
  );
  console.log("Transaction:", signature);
  console.log(
    "Transaction Explorer:",
    `https://explorer.solana.com/tx/${signature}${cluster}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
