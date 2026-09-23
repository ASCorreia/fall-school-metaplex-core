import * as anchor from "@anchor-lang/core";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { createUmi} from "@metaplex-foundation/umi-bundle-defaults";
import { publicKey} from "@metaplex-foundation/umi";
import { fetchAssetV1, transferV1} from "@metaplex-foundation/mpl-core";
import { SoulboundNft } from "../../target/types/soulbound_nft";

const MPL_CORE_PROGRAM_ID = new PublicKey(
  "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d",
);

const NAME = "Laolu Diploma";

const URI =
  "https://gist.githubusercontent.com/Laolu02/03d624006deefaa245c53fef1e85d799/raw/82d41a2b18d8479e7a9d998d5d158e8f49f79483/gistfile1.txt";

async function main() {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const idl = require("../../target/idl/soulbound_nft.json");

  const program = new anchor.Program<SoulboundNft>(
    idl,
    provider,
  );

  const asset = Keypair.generate();
  const owner = provider.wallet.publicKey;

  console.log("RPC:", provider.connection.rpcEndpoint);
  console.log("Program:", program.programId.toBase58());
  console.log("Owner:", owner.toBase58());
  console.log("Asset:", asset.publicKey.toBase58());

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

  console.log("Signature:", signature);

  const umi = createUmi(provider.connection.rpcEndpoint);

  let coreAsset;

    for (let attempt = 1; attempt <= 10; attempt++) {
    try {
        coreAsset = await fetchAssetV1(
        umi,
        publicKey(asset.publicKey.toBase58()),
        );

        break;
    } catch (error) {
        if (attempt === 10) {
        throw error;
        }

        console.log(
        `Asset not visible yet. Retry ${attempt}/10 in 2 seconds...`,
        );

        await new Promise((resolve) => setTimeout(resolve, 2_000));
    }
    }

    if (!coreAsset) {
    throw new Error("Failed to fetch Core asset after retries");
    }

  console.log("Asset:", coreAsset);
  console.log("Frozen:",coreAsset.permanentFreezeDelegate?.frozen,);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});