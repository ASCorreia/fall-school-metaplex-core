import * as anchor from "@anchor-lang/core";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { SoulboundNft } from "../../target/types/soulbound_nft";

const MPL_CORE = new PublicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");

const NAME = "YMAbee's Diploma";
const URI =
  "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json";

async function main() {
  // Reads ANCHOR_PROVIDER_URL and ANCHOR_WALLET from the environment.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SoulboundNft as anchor.Program<SoulboundNft>;

  // Every Core asset lives at its own fresh address, and must co-sign its
  // own creation, so both the pubkey below and .signers([asset]).
  const asset = Keypair.generate();

  const sig = await program.methods
    .mintSoulboundNft(NAME, URI)
    .accountsPartial({
      payer: provider.wallet.publicKey,
      asset: asset.publicKey,
      // The wallet this NFT is welded to forever.
      owner: provider.wallet.publicKey,
      mplCoreProgram: MPL_CORE,
      systemProgram: SystemProgram.programId,
    })
    .signers([asset])
    .rpc();

  console.log("Program:", program.programId.toBase58());
  console.log("Asset:  ", asset.publicKey.toBase58());
  console.log("Tx:     ", sig);
  console.log();
  console.log(
    `https://explorer.solana.com/address/${asset.publicKey.toBase58()}?cluster=devnet`,
  );
  console.log(`https://explorer.solana.com/tx/${sig}?cluster=devnet`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});