import * as anchor from "@anchor-lang/core";
import { Program } from "@anchor-lang/core";
import { Keypair, PublicKey } from "@solana/web3.js";
import { SoulboundNft } from "../../target/types/soulbound_nft";

const MPL_CORE_PROGRAM_ID = new PublicKey(
  "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d",
);

const NAME = "SouthenEmpire's Anchor Soulbound";
const URI = "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json";

async function main() {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const idl = require("../../target/idl/soulbound_nft.json");
  const program = new anchor.Program(idl, provider) as Program<SoulboundNft>;

  const asset = Keypair.generate();
  
  console.log("Minting soulbound asset from anchor program...");
  
  const tx = await program.methods
    .mintSoulboundNft(NAME, URI)
    .accountsPartial({
      payer: provider.wallet.publicKey,
      asset: asset.publicKey,
      owner: provider.wallet.publicKey,
      mplCoreProgram: MPL_CORE_PROGRAM_ID,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([asset])
    .rpc();

  console.log("Mint Transaction: https://explorer.solana.com/tx/" + tx + "?cluster=devnet");
  console.log("Asset Address: https://explorer.solana.com/address/" + asset.publicKey.toString() + "?cluster=devnet");
}

main().catch(console.error);
