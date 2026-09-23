/**
 * Anchor track client: mints a soul-bound Core NFT on devnet by calling
 * YOUR deployed soulbound-nft program (CPI -> Metaplex Core).
 *
 * Run from inside 02-anchor-track:
 *   ANCHOR_PROVIDER_URL=https://api.devnet.solana.com \
 *   ANCHOR_WALLET=$HOME/.config/solana/id.json \
 *   npx ts-node submissions/kuroryujinn/mint.ts
 */
import * as anchor from "@anchor-lang/core";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { SoulboundNft } from "../../target/types/soulbound_nft";

const MPL_CORE = new PublicKey(
  "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d",
);

const EXPLORER = (addr: string) =>
  `https://explorer.solana.com/address/${addr}?cluster=devnet`;
const EXPLORER_TX = (sig: string) =>
  `https://explorer.solana.com/tx/${sig}?cluster=devnet`;

async function main() {
  // Reads ANCHOR_PROVIDER_URL and ANCHOR_WALLET from the environment.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.SoulboundNft as anchor.Program<SoulboundNft>;

  console.log("Program:", program.programId.toString());
  console.log("Payer/owner:", provider.wallet.publicKey.toString());

  const asset = Keypair.generate(); // the new NFT's address (must co-sign)

  const sig = await program.methods
    .mintSoulboundNft(
      "Tanmay's On-chain Soulbound Diploma",
      "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json",
    )
    .accountsPartial({
      payer: provider.wallet.publicKey,
      asset: asset.publicKey,
      // The NFT is bound to this wallet forever.
      owner: provider.wallet.publicKey,
      mplCoreProgram: MPL_CORE,
      systemProgram: SystemProgram.programId,
    })
    .signers([asset]) // Metaplex Core requires the new asset to sign
    .rpc();

  console.log("\nSoulbound NFT minted by our own Anchor program!");
  console.log("Asset address:", asset.publicKey.toString());
  console.log("Explorer:", EXPLORER(asset.publicKey.toString()));
  console.log("Transaction:", EXPLORER_TX(sig));
}

main();
