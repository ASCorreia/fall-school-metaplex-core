import * as anchor from "@anchor-lang/core";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { SoulboundNft } from "../../target/types/soulbound_nft";

const MPL_CORE = new PublicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");

async function main() {
  // Reads ANCHOR_PROVIDER_URL and ANCHOR_WALLET (see the run command below)
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.SoulboundNft as anchor.Program<SoulboundNft>;

  const asset = Keypair.generate();   // the new NFT's address

  const sig = await program.methods
    .mintSoulboundNft("init-ikuya's Diploma", "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json")
    .accountsPartial({
        payer: provider.wallet.publicKey,
        asset: asset.publicKey,
        owner: provider.wallet.publicKey,
    })
    .signers([asset])
    .rpc();

  // print the asset address and the transaction signature
  console.log(`asset address: ${asset.publicKey}`)
  console.log(`tx signature: ${sig}`)
}

main();