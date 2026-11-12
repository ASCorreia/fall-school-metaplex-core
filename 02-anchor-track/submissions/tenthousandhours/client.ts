import * as anchor from "@anchor-lang/core";
import { Program } from "@anchor-lang/core";
import { Keypair, PublicKey } from "@solana/web3.js";
import { SoulboundNft } from "./target/types/soulbound_nft";

const MPL_CORE_PROGRAM_ID = new PublicKey(
  "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
);

const NAME = "Antigravity Soulbound";
const URI = "https://jsonblob.com/api/jsonBlob/019f8fa4-d473-71a0-9e54-bc963e0c1daf";

async function main() {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  // Read the program from the workspace
  const program = anchor.workspace.SoulboundNft as Program<SoulboundNft>;

  // Fresh keypair for the new Core asset (must co-sign creation).
  const asset = Keypair.generate();
  
  // The wallet the NFT gets permanently bound to. (In this case, the deployer wallet).
  const recipient = provider.wallet.publicKey;

  console.log("Minting soulbound NFT via Anchor to:", recipient.toBase58());

  const tx = await program.methods
    .mintSoulboundNft(NAME, URI)
    .accountsPartial({
      payer: provider.wallet.publicKey,
      asset: asset.publicKey,
      owner: recipient,
      mplCoreProgram: MPL_CORE_PROGRAM_ID,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([asset])
    .rpc();

  console.log("Transaction Signature:", tx);
  console.log("Asset Address:", asset.publicKey.toBase58());
  console.log(`Explorer Link: https://explorer.solana.com/address/${asset.publicKey.toBase58()}?cluster=devnet`);
}

main().catch((err) => {
  console.error(err);
});
