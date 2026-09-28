/**
 * Mints a soulbound Core asset on devnet through the deployed program.
 *
 * Run from 02-anchor-track:
 *   ANCHOR_PROVIDER_URL=https://api.devnet.solana.com \
 *   ANCHOR_WALLET=~/.config/solana/id.json \
 *   npx ts-node submissions/sabaazdn73/mint.ts
 *
 * The owner is the provider wallet, so the asset lands in the same wallet that
 * deployed the program and is visible on its explorer page.
 */
import * as anchor from "@anchor-lang/core";
import { Program } from "@anchor-lang/core";
import { Keypair, PublicKey } from "@solana/web3.js";
import { SoulboundNft } from "../../target/types/soulbound_nft";

const MPL_CORE_PROGRAM_ID = new PublicKey(
  "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d",
);

const NAME = "Saba — Solana Fall School Diploma";
const URI =
  "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json";

async function main() {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SoulboundNft as Program<SoulboundNft>;

  // Every Core asset lives at its own address and co-signs its own creation.
  const asset = Keypair.generate();

  const signature = await program.methods
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

  const explorer = (kind: string, id: string) =>
    `https://explorer.solana.com/${kind}/${id}?cluster=devnet`;

  console.log("Program: ", explorer("address", program.programId.toBase58()));
  console.log("Asset:   ", explorer("address", asset.publicKey.toBase58()));
  console.log("Mint tx: ", explorer("tx", signature));
}

main();
