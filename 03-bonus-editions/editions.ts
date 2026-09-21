import { generateSigner } from "@metaplex-foundation/umi";
import {
  create,
  createCollection,
  fetchCollection,
  ruleSet,
} from "@metaplex-foundation/mpl-core";
import { getUmi, explorerAddress } from "../shared/umi";

const URI = "https://example.com/metadata.json"; // your metadata JSON
const NAME = "SouthenEmpire Collection";

async function main() {
  const umi = getUmi();
  console.log("Wallet:", umi.identity.publicKey.toString());

  const collectionSigner = generateSigner(umi);
  await createCollection(umi, {
    collection: collectionSigner,
    name: NAME,
    uri: URI,
    plugins: [
      { type: "MasterEdition", maxSupply: 3 },
      { 
        type: "Royalties", 
        basisPoints: 500,
        creators: [{ address: umi.identity.publicKey, percentage: 100 }],
        ruleSet: ruleSet("None") 
      },
    ],
  }).sendAndConfirm(umi);

  console.log("Collection created:", explorerAddress(collectionSigner.publicKey.toString()));

  await new Promise(r => setTimeout(r, 2000));
  const collection = await fetchCollection(umi, collectionSigner.publicKey, { commitment: "confirmed" });
  const ROYALTIES = [250, 500, 1000];

  for (let i = 1; i <= 3; i++) {
    const asset = generateSigner(umi);
    await create(umi, { 
      asset, 
      collection: collection.publicKey, 
      name: `PRINT #${i}`, 
      uri: URI,
      plugins: [
        { type: "Edition", number: i },
        { 
          type: "Royalties", 
          basisPoints: ROYALTIES[i - 1],
          creators: [{ address: umi.identity.publicKey, percentage: 100 }],
          ruleSet: ruleSet("None") 
        },
      ],
    }).sendAndConfirm(umi);
    
    console.log(`Print #${i}:`, explorerAddress(asset.publicKey.toString()));
  }
}

main();
