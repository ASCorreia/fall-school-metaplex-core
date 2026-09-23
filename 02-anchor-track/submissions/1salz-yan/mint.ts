/**
 * Anchor track client: calls `mint_soulbound_nft` on the deployed devnet
 * program and mints a soul-bound Metaplex Core asset to my own wallet.
 *
 * Run from inside 02-anchor-track:
 *
 *   ANCHOR_PROVIDER_URL=https://api.devnet.solana.com \
 *   ANCHOR_WALLET=$HOME/.config/solana/id.json \
 *   npx ts-node submissions/1salz-yan/mint.ts
 *
 * Behind a proxy also export:
 *   NODE_USE_ENV_PROXY=1
 *   NODE_OPTIONS="--require $HOME/.hermes/scripts/sol-proxy-shim.cjs"
 * (otherwise the websocket confirm never returns and web3.js throws
 *  TransactionExpiredBlockheightExceededError even though the tx landed)
 */
import * as anchor from "@anchor-lang/core";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { SoulboundNft } from "../../target/types/soulbound_nft";

const MPL_CORE = new PublicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");

const NAME = "Xinyan Liu's Fall School Diploma (Anchor)";
const URI =
  "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json";

const EXPLORER = (kind: "address" | "tx", value: string) =>
  `https://explorer.solana.com/${kind}/${value}?cluster=devnet`;

async function main() {
  // Reads ANCHOR_PROVIDER_URL and ANCHOR_WALLET (see the run command above)
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.SoulboundNft as anchor.Program<SoulboundNft>;

  console.log("Program:", program.programId.toString());
  console.log("Wallet :", provider.wallet.publicKey.toString());

  // The new NFT's address: a fresh keypair that must co-sign its creation.
  const asset = Keypair.generate();

  const sig = await program.methods
    .mintSoulboundNft(NAME, URI)
    .accountsPartial({
      // payer and owner are the same wallet: it pays, and the NFT is bound to it
      payer: provider.wallet.publicKey,
      asset: asset.publicKey,
      owner: provider.wallet.publicKey,
      mplCoreProgram: MPL_CORE,
      systemProgram: SystemProgram.programId,
    })
    .signers([asset])
    .rpc();

  const assetAddress = asset.publicKey.toBase58();
  console.log("\nMinted soul-bound asset!");
  console.log("Asset address    :", assetAddress);
  console.log("Asset explorer   :", EXPLORER("address", assetAddress));
  console.log("Mint transaction :", EXPLORER("tx", sig));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
