import * as anchor from "@anchor-lang/core";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { SoulboundNft } from "../../target/types/soulbound_nft";

const MPL_CORE = new PublicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");
const URI =
  "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json";

async function main() {
  // Use the CLI wallet and devnet endpoint from ANCHOR_WALLET and
  // ANCHOR_PROVIDER_URL. The asset keypair is ephemeral, never committed.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.SoulboundNft as anchor.Program<SoulboundNft>;
  const asset = Keypair.generate();

  const signature = await program.methods
    .mintSoulboundNft("Manjeet Singh's Soulbound Diploma", URI)
    .accountsPartial({
      payer: provider.wallet.publicKey,
      asset: asset.publicKey,
      owner: provider.wallet.publicKey,
      mplCoreProgram: MPL_CORE,
      systemProgram: SystemProgram.programId,
    })
    .signers([asset])
    .rpc();

  console.log("Program ID:", program.programId.toBase58());
  console.log("Asset:", asset.publicKey.toBase58());
  console.log("Asset explorer:", `https://explorer.solana.com/address/${asset.publicKey.toBase58()}?cluster=devnet`);
  console.log("Mint transaction:", `https://explorer.solana.com/tx/${signature}?cluster=devnet`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
