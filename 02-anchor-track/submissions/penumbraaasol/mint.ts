/**
 * Track 2 — mint a soulbound Core asset on devnet through our own program.
 *
 * Run from inside 02-anchor-track, so Anchor can resolve the workspace:
 *
 *   ANCHOR_PROVIDER_URL=https://api.devnet.solana.com \
 *   ANCHOR_WALLET=$HOME/.config/solana/id.json \
 *   npx ts-node submissions/penumbraaasol/mint.ts
 */
import * as anchor from "@anchor-lang/core";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { SoulboundNft } from "../../target/types/soulbound_nft";

const MPL_CORE = new PublicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");

const NAME = "Anna's Solana Fall School Diploma";
const URI =
  "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json";

async function main() {
  // Reads ANCHOR_PROVIDER_URL and ANCHOR_WALLET from the environment.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  // Resolved from target/idl/soulbound_nft.json, so this calls whichever
  // program ID the last `anchor build` produced. Rebuild and redeploy after
  // any `anchor keys sync`, or this points at a stale address.
  const program = anchor.workspace.SoulboundNft as anchor.Program<SoulboundNft>;

  // Core creates the asset account itself, and requires the new address to
  // co-sign — so this is a keypair, not just a public key.
  const asset = Keypair.generate();

  console.log("Program:", program.programId.toBase58());
  console.log("Payer / owner:", provider.wallet.publicKey.toBase58());
  console.log("Asset:", asset.publicKey.toBase58());

  const sig = await program.methods
    .mintSoulboundNft(NAME, URI)
    .accountsPartial({
      payer: provider.wallet.publicKey,
      asset: asset.publicKey,
      // Bound to this wallet forever. Core stores the address and the
      // PermanentFreezeDelegate plugin stops it ever changing.
      owner: provider.wallet.publicKey,
      mplCoreProgram: MPL_CORE,
      systemProgram: SystemProgram.programId,
    })
    // The payer is the provider wallet and signs automatically; only the new
    // asset keypair has to be added here.
    .signers([asset])
    .rpc();

  console.log("\nMinted.");
  console.log(
    "Asset:",
    `https://explorer.solana.com/address/${asset.publicKey.toBase58()}?cluster=devnet`,
  );
  console.log(
    "Tx:   ",
    `https://explorer.solana.com/tx/${sig}?cluster=devnet`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
