/**
 * Client script for the Anchor track: calls `mint_soulbound_nft` on the
 * deployed devnet program and mints a soulbound Core asset to your wallet.
 *
 * Run from 02-anchor-track (after `anchor build` + `anchor deploy --provider.cluster devnet`):
 *   ANCHOR_PROVIDER_URL=https://api.devnet.solana.com \
 *   ANCHOR_WALLET=~/.config/solana/id.json \
 *   npx ts-node submissions/the-axmc/mint.ts
 */
import * as anchor from "@anchor-lang/core";
import { Program } from "@anchor-lang/core";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import idl from "../../target/idl/soulbound_nft.json";
import type { SoulboundNft } from "../../target/types/soulbound_nft";

const MPL_CORE_PROGRAM_ID = new PublicKey(
  "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d",
);

const NAME = "the-axmc | Fall School Diploma (Anchor)";
const URI =
  "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json";

const explorer = (kind: "address" | "tx", id: string) =>
  `https://explorer.solana.com/${kind}/${id}?cluster=devnet`;

async function main() {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = new Program(idl as SoulboundNft, provider);

  // Fresh keypair for the Core asset: it must co-sign its own creation.
  const asset = Keypair.generate();
  // The NFT is bound forever to the provider wallet.
  const owner = provider.wallet.publicKey;

  console.log("Program:", program.programId.toBase58());
  console.log("Owner:  ", owner.toBase58());

  const signature = await program.methods
    .mintSoulboundNft(NAME, URI)
    .accountsPartial({
      payer: provider.wallet.publicKey,
      asset: asset.publicKey,
      owner,
      mplCoreProgram: MPL_CORE_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .signers([asset])
    .rpc();

  console.log("Asset:  ", asset.publicKey.toBase58());
  console.log("Asset explorer:", explorer("address", asset.publicKey.toBase58()));
  console.log("Tx explorer:   ", explorer("tx", signature));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
