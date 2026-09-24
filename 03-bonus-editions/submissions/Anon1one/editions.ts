import { generateSigner } from "@metaplex-foundation/umi";
import {
  create,
  createCollection,
  fetchCollection,
  ruleSet,
} from "@metaplex-foundation/mpl-core";
import { getUmi, explorerAddress } from "../../../shared/umi";

const URI = "https://example.com/metadata.json";

async function main() {
  const umi = getUmi();
  console.log("Wallet:", umi.identity.publicKey.toString());

  // 1. Create collection with MasterEdition (maxSupply: 3) and collection-level Royalties
  const collectionSigner = generateSigner(umi);
  await createCollection(umi, {
    collection: collectionSigner,
    name: "Odiya Collection",
    uri: URI,
    plugins: [
      { type: "MasterEdition", maxSupply: 3 },
      {
        type: "Royalties",
        basisPoints: 500,
        creators: [{ address: umi.identity.publicKey, percentage: 100 }],
        ruleSet: ruleSet("None"),
      },
    ],
  }).sendAndConfirm(umi, {
    confirm: { commitment: "confirmed" },
  });

  // 2. Fetch the newly created collection account with confirmed commitment
  const collection = await fetchCollection(umi, collectionSigner.publicKey, {
    commitment: "confirmed",
  });

  const ROYALTIES = [250, 500, 1000];

  // 3. Print 3 editions into the collection with different royalty basis points
  for (let i = 1; i <= 3; i++) {
    const asset = generateSigner(umi);
    await create(umi, {
      asset,
      collection,
      name: `Odiya Edition #${i}`,
      uri: URI,
      plugins: [
        { type: "Edition", number: i },
        {
          type: "Royalties",
          basisPoints: ROYALTIES[i - 1],
          creators: [{ address: umi.identity.publicKey, percentage: 100 }],
          ruleSet: ruleSet("None"),
        },
      ],
    }).sendAndConfirm(umi, {
      send: { preflightCommitment: "confirmed" },
      confirm: { commitment: "confirmed" },
    });

    console.log(`Edition #${i}: ${explorerAddress(asset.publicKey)}`);
  }

  console.log(`Collection: ${explorerAddress(collectionSigner.publicKey)}`);
}

main();