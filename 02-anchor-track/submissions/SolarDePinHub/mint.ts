import * as anchor from "@anchor-lang/core";
import { Program } from "@anchor-lang/core";
import { Keypair, PublicKey } from "@solana/web3.js";
import { SoulboundNft } from "../../target/types/soulbound_nft";

const MPL_CORE_PROGRAM_ID = new PublicKey(
  "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d",
);

async function main() {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.SoulboundNft as Program<SoulboundNft>;
  const asset = Keypair.generate();

  const sig = await program.methods
    .mintSoulboundNft(
      "Vadym SolarDePin Soulbound",
      "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json",
    )
    .accountsPartial({
      payer: provider.wallet.publicKey,
      asset: asset.publicKey,
      owner: provider.wallet.publicKey,
      mplCoreProgram: MPL_CORE_PROGRAM_ID,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([asset])
    .rpc();

  console.log("ASSET", asset.publicKey.toBase58());
  console.log("TX", sig);
  console.log(
    "ASSET_URL https://explorer.solana.com/address/" +
      asset.publicKey.toBase58() +
      "?cluster=devnet",
  );
  console.log(
    "TX_URL https://explorer.solana.com/tx/" + sig + "?cluster=devnet",
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
