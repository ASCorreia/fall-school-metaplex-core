import * as anchor from "@anchor-lang/core";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { SoulboundNft } from "../../target/types/soulbound_nft";

const MPL_CORE = new PublicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");

async function main() {
  // Reads ANCHOR_PROVIDER_URL and ANCHOR_WALLET
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.SoulboundNft as anchor.Program<SoulboundNft>;

  const asset = Keypair.generate(); // the new NFT's address

  console.log("Minting from wallet:", provider.wallet.publicKey.toBase58());
  console.log("Calling program:", program.programId.toBase58());

  const sig = await program.methods
    .mintSoulboundNft(
      "dren712's Soulbound Diploma",
      "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json"
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

  console.log("\nSuccessfully minted soulbound NFT on Devnet!");
  console.log("Asset address:", asset.publicKey.toBase58());
  console.log(`Asset explorer: https://explorer.solana.com/address/${asset.publicKey.toBase58()}?cluster=devnet`);
  console.log(`Transaction: https://explorer.solana.com/tx/${sig}?cluster=devnet`);
}

main().catch((err) => {
  console.error("Error minting:", err);
  process.exit(1);
});
