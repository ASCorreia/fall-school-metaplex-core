import { generateSigner } from "@metaplex-foundation/umi";
import { create } from "@metaplex-foundation/mpl-core";
import { getUmi, explorerAddress } from "../../shared/umi";

const NAME = "SouthenEmpire's Soulbound NFT";
const URI =
  "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json";

async function main() {
  const umi = getUmi();
  console.log("Minting from wallet:", umi.identity.publicKey.toString());

  const asset = generateSigner(umi); 
  await create(umi, { 
    asset, 
    name: NAME, 
    uri: URI, 
    plugins: [ 
      { 
        type: "PermanentFreezeDelegate", 
        frozen: true, 
        authority: { type: "None" }, 
      }, 
    ], 
  }).sendAndConfirm(umi); 
  console.log(asset.publicKey.toString()); 
  console.log(explorerAddress(asset.publicKey.toString())); 
}

main();
