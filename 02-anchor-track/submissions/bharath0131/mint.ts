import * as anchor from "@anchor-lang/core";
import { Program } from "@anchor-lang/core";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import idl from "../../target/idl/soulbound_nft.json";
import { SoulboundNft } from "../../target/types/soulbound_nft";

const MPL_CORE_PROGRAM_ID = new PublicKey(
  "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d",
);

const NAME = "Bharath Fall School Anchor Soulbound Diploma";
const URI =
  "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json";

async function main() {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = new Program<SoulboundNft>(idl as SoulboundNft, provider);
  const asset = Keypair.generate();
  const owner = provider.wallet.publicKey;

  const signature = await program.methods
    .mintSoulboundNft(NAME, URI)
    .accountsPartial({
      payer: owner,
      asset: asset.publicKey,
      owner,
      mplCoreProgram: MPL_CORE_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .signers([asset])
    .rpc();

  console.log("Program:", program.programId.toBase58());
  console.log("Asset:", asset.publicKey.toBase58());
  console.log("Mint transaction:", signature);
  console.log(
    `Program explorer: https://explorer.solana.com/address/${program.programId.toBase58()}?cluster=devnet`,
  );
  console.log(
    `Asset explorer: https://explorer.solana.com/address/${asset.publicKey.toBase58()}?cluster=devnet`,
  );
  console.log(
    `Transaction explorer: https://explorer.solana.com/tx/${signature}?cluster=devnet`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
