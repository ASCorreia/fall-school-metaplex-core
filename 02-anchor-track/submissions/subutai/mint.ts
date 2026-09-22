import * as anchor from "@anchor-lang/core";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { SoulboundNft } from "../../target/types/soulbound_nft";

const MPL_CORE = new PublicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");

const NAME = "subutai's Diploma";
const URI =
  "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json";

async function main() {
  // Reads ANCHOR_PROVIDER_URL and ANCHOR_WALLET (see the run command)
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SoulboundNft as anchor.Program<SoulboundNft>;
  const asset = Keypair.generate(); // the new NFT's address

  console.log("Minting soulbound NFT to wallet:", provider.wallet.publicKey.toBase58());
  console.log("Asset address:", asset.publicKey.toBase58());

  const sig = await program.methods
    .mintSoulboundNft(NAME, URI)
    .accountsPartial({
      payer: provider.wallet.publicKey,
      asset: asset.publicKey,
      owner: provider.wallet.publicKey,
      mplCoreProgram: MPL_CORE,
      systemProgram: SystemProgram.programId,
    })
    .signers([asset])
    .rpc();

  console.log("\nMint successful!");
  console.log("Asset address:", asset.publicKey.toBase58());
  console.log("Transaction signature:", sig);
  console.log(
    `Asset link: https://explorer.solana.com/address/${asset.publicKey.toBase58()}?cluster=devnet`
  );
  console.log(`Transaction link: https://explorer.solana.com/tx/${sig}?cluster=devnet`);
}

main().catch((err) => {
  console.error("Mint failed:", err);
  process.exit(1);
});
