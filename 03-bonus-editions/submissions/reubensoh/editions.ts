import { generateSigner } from "@metaplex-foundation/umi";
import { create, createCollection, fetchCollection, ruleSet, fetchAsset } from "@metaplex-foundation/mpl-core";
import { getUmi, explorerAddress } from "../shared/umi";

const NAME = "Reuben's Masterpiece";
const URI = "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json";

async function main() {
  const umi = getUmi();
  console.log("Minting from wallet:", umi.identity.publicKey.toString());

  // TODO 1: The collection (The original painting)
  const collectionSigner = generateSigner(umi);
  await createCollection(umi, {
    collection: collectionSigner,
    name: NAME,
    uri: URI,
    plugins: [
      { type: "MasterEdition", maxSupply: 3 },
      {
        type: "Royalties",
        basisPoints: 500, // 5% default
        creators: [{ address: umi.identity.publicKey, percentage: 100 }],
        ruleSet: ruleSet("None"),
      },
    ],
  }).sendAndConfirm(umi);

  console.log(`Collection address: ${collectionSigner.publicKey.toString()}`);
  console.log(`Collection Explorer: ${explorerAddress(collectionSigner.publicKey.toString())}\n`);

  // Load the collection first so we can pass it to the assets
  const collection = await fetchCollection(umi, collectionSigner.publicKey);
  const ROYALTIES = [250, 500, 1000]; // 2.5%, 5%, 10%

  // TODO 2: Three prints in a loop
  for (let i = 1; i <= 3; i++) {
    const asset = generateSigner(umi);
    await create(umi, {
      asset,
      collection,
      name: `${NAME} #${i}`,
      uri: URI,
      plugins: [
        { type: "Edition", number: i }, 
        {
          type: "Royalties",
          basisPoints: ROYALTIES[i - 1], 
          creators: [{ address: umi.identity.publicKey, percentage: 100 }],
          ruleSet: ruleSet("None"),
        }
      ],
    }).sendAndConfirm(umi);

    // TODO 3: Print the explorer link for this asset
    console.log(`Print #${i} address: ${asset.publicKey.toString()}`);
    console.log(`Print #${i} Explorer: ${explorerAddress(asset.publicKey.toString())}`);
    
    // Proving the override
    const onChain = await fetchAsset(umi, asset.publicKey);
    console.log(`Print #${i} actual on-chain royalty: ${onChain.royalties?.basisPoints} bps\n`);
  }
}

main();