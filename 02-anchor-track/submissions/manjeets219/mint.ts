import * as anchor from "@anchor-lang/core";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { SoulboundNft } from "../../target/types/soulbound_nft";
import idl from "../../target/idl/soulbound_nft.json";

const MPL_CORE = new PublicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");
const DEPLOYED_PROGRAM_ID = "BDjtgYKVR41ogxPCiNTYb5KkQpTGor64xrTgUbgZ9tQy";
const URI =
  "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json";

async function main() {
  // Use the CLI wallet and devnet endpoint from ANCHOR_WALLET and
  // ANCHOR_PROVIDER_URL. The asset keypair is ephemeral, never committed.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  // Local `anchor keys sync` generates a new keypair on another machine.
  // Keep its generated instruction layout but target this submission's
  // already-deployed devnet program, not the reviewer's local program ID.
  const program = new anchor.Program<SoulboundNft>(
    { ...idl, address: DEPLOYED_PROGRAM_ID },
    provider,
  );
  const asset = Keypair.generate();

  const signature = await program.methods
    .mintSoulboundNft("Manjeet Singh's Soulbound Diploma", URI)
    .accountsPartial({
      payer: provider.wallet.publicKey,
      asset: asset.publicKey,
      owner: provider.wallet.publicKey,
      mplCoreProgram: MPL_CORE,
      systemProgram: SystemProgram.programId,
    })
    .signers([asset])
    .rpc();

  console.log("Program ID:", program.programId.toBase58());
  console.log("Asset:", asset.publicKey.toBase58());
  console.log("Asset explorer:", `https://explorer.solana.com/address/${asset.publicKey.toBase58()}?cluster=devnet`);
  console.log("Mint transaction:", `https://explorer.solana.com/tx/${signature}?cluster=devnet`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
