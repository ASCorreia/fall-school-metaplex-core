import * as anchor from "@anchor-lang/core";
import { Program } from "@anchor-lang/core";
import { Keypair, PublicKey } from "@solana/web3.js";
import { SoulboundNft } from "../../target/types/soulbound_nft";

const MPL_CORE_PROGRAM_ID = new PublicKey(
  "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d",
);

const NAME = "Rohan Saini (roxxcli) | Anchor Soulbound NFT";

const URI =
  "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json";

async function main() {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SoulboundNft as Program<SoulboundNft>;

  // Fresh keypair for the Core asset.
  const asset = Keypair.generate();

  // The provider wallet owns the NFT.
  const owner = provider.wallet.publicKey;

  console.log("Owner:", owner.toBase58());
  console.log("Asset:", asset.publicKey.toBase58());

  const signature = await program.methods
    .mintSoulboundNft(NAME, URI)
    .accountsPartial({
      payer: provider.wallet.publicKey,
      asset: asset.publicKey,
      owner,
      mplCoreProgram: MPL_CORE_PROGRAM_ID,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([asset])
    .rpc();

  console.log("Mint transaction:", signature);

  console.log(
    `Explorer asset: https://explorer.solana.com/address/${asset.publicKey.toBase58()}?cluster=devnet`,
  );

  console.log(
    `Explorer transaction: https://explorer.solana.com/tx/${signature}?cluster=devnet`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});