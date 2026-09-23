/**
 * Calls our own program on devnet to mint the soul-bound Core asset.
 *
 * Run from inside 02-anchor-track, after `anchor build` and
 * `anchor deploy --provider.cluster devnet`:
 *
 *   ANCHOR_PROVIDER_URL=https://api.devnet.solana.com \
 *   ANCHOR_WALLET=$HOME/.config/solana/id.json \
 *   npx ts-node submissions/intignosis/mint.ts
 */
import * as anchor from "@anchor-lang/core";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { SoulboundNft } from "../../target/types/soulbound_nft";

const MPL_CORE = new PublicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");

const NAME = "Pablo's Solana Fall School Diploma";
const URI =
  "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json";

async function main() {
  // Reads ANCHOR_PROVIDER_URL and ANCHOR_WALLET from the environment.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SoulboundNft as anchor.Program<SoulboundNft>;

  // The new asset's address. MPL Core requires the asset account to sign its
  // own creation, so the keypair goes in .signers([...]).
  const asset = Keypair.generate();

  console.log("Program:", program.programId.toBase58());
  console.log("Payer / owner:", provider.wallet.publicKey.toBase58());
  console.log("New asset:", asset.publicKey.toBase58());

  const sig = await program.methods
    .mintSoulboundNft(NAME, URI)
    .accountsPartial({
      payer: provider.wallet.publicKey,
      asset: asset.publicKey,
      // Bound to this wallet forever.
      owner: provider.wallet.publicKey,
      mplCoreProgram: MPL_CORE,
      systemProgram: SystemProgram.programId,
    })
    // The provider wallet signs automatically; only the asset keypair is added.
    .signers([asset])
    .rpc();

  const cluster = "?cluster=devnet";
  console.log("\nAsset:      https://explorer.solana.com/address/" + asset.publicKey.toBase58() + cluster);
  console.log("Transaction: https://explorer.solana.com/tx/" + sig + cluster);
  console.log("Program:     https://explorer.solana.com/address/" + program.programId.toBase58() + cluster);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
