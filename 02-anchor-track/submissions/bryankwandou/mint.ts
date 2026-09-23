// Mints a soulbound Core NFT on devnet through the deployed soulbound-nft program.
// Run from 02-anchor-track:
//   ANCHOR_PROVIDER_URL=https://api.devnet.solana.com ANCHOR_WALLET=<keypair path> \
//     npx ts-node submissions/bryankwandou/mint.ts
import * as anchor from "@anchor-lang/core";
import { Program } from "@anchor-lang/core";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { publicKey } from "@metaplex-foundation/umi";
import { fetchAsset } from "@metaplex-foundation/mpl-core";
import idl from "../../target/idl/soulbound_nft.json";
import { SoulboundNft } from "../../target/types/soulbound_nft";

const MPL_CORE_PROGRAM_ID = new PublicKey(
  "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d",
);
const NAME = "Bryan Kwandou - Fall School Diploma";
const URI =
  "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json";

async function main() {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = new Program<SoulboundNft>(idl as SoulboundNft, provider);

  const asset = Keypair.generate();
  const owner = provider.wallet.publicKey;

  const sig = await program.methods
    .mintSoulboundNft(NAME, URI)
    .accountsPartial({
      payer: provider.wallet.publicKey,
      asset: asset.publicKey,
      owner,
      mplCoreProgram: MPL_CORE_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .signers([asset])
    .rpc({ commitment: "confirmed" });

  console.log("Program:", program.programId.toBase58());
  console.log("Asset:  ", asset.publicKey.toBase58());
  console.log("Tx:     ", `https://explorer.solana.com/tx/${sig}?cluster=devnet`);
  console.log(
    "Explorer:",
    `https://explorer.solana.com/address/${asset.publicKey.toBase58()}?cluster=devnet`,
  );

  const umi = createUmi(provider.connection.rpcEndpoint);
  for (let attempt = 0; ; attempt++) {
    try {
      const core = await fetchAsset(umi, publicKey(asset.publicKey.toBase58()));
      console.log("Owner:  ", core.owner.toString());
      console.log("Frozen: ", core.permanentFreezeDelegate?.frozen);
      break;
    } catch (e) {
      if (attempt >= 10) throw e;
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
