/**
 * BONUS CHALLENGE: Print Editions with different royalties.
 */
import { generateSigner } from "@metaplex-foundation/umi";
import {
  create,
  createCollection,
  fetchAsset,
  fetchCollection,
  ruleSet,
} from "@metaplex-foundation/mpl-core";
import { getUmi, explorerAddress } from "../../../shared/umi";

const URI =
  "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json";

// basis points: 250 = 2.5%, 500 = 5%, 1000 = 10%
const ROYALTIES = [250, 500, 1000];

async function fetchCollectionWithRetry(umi: any, address: any, retries = 5, delayMs = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetchCollection(umi, address);
    } catch (e) {
      if (i === retries - 1) throw e;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  return await fetchCollection(umi, address);
}

async function fetchAssetWithRetry(umi: any, address: any, retries = 5, delayMs = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetchAsset(umi, address);
    } catch (e) {
      if (i === retries - 1) throw e;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  return await fetchAsset(umi, address);
}

async function main() {
  const umi = getUmi();
  console.log("Wallet:", umi.identity.publicKey.toString());

  // 1. Collection with the MasterEdition plugin (the "original painting")
  const collectionSigner = generateSigner(umi);
  await createCollection(umi, {
    collection: collectionSigner,
    name: "subutai Master Edition",
    uri: URI,
    plugins: [
      {
        type: "MasterEdition",
        maxSupply: 3,
        name: undefined,
        uri: undefined,
      },
      {
        // collection-level default royalty (5%)
        type: "Royalties",
        basisPoints: 500,
        creators: [{ address: umi.identity.publicKey, percentage: 100 }],
        ruleSet: ruleSet("None"),
      },
    ],
  }).sendAndConfirm(umi);

  console.log("\nMaster Edition collection:", collectionSigner.publicKey.toString());
  console.log("Collection link:", explorerAddress(collectionSigner.publicKey.toString()));

  const collection = await fetchCollectionWithRetry(umi, collectionSigner.publicKey);

  // 2. Print 3 Editions, each with its own royalty
  for (let i = 1; i <= 3; i++) {
    const asset = generateSigner(umi);
    await create(umi, {
      asset,
      collection,
      name: `subutai Print #${i}`,
      uri: URI,
      plugins: [
        { type: "Edition", number: i },
        {
          // asset-level royalty OVERRIDES the collection-level one
          type: "Royalties",
          basisPoints: ROYALTIES[i - 1],
          creators: [{ address: umi.identity.publicKey, percentage: 100 }],
          ruleSet: ruleSet("None"),
        },
      ],
    }).sendAndConfirm(umi);

    const onChain = await fetchAssetWithRetry(umi, asset.publicKey);
    console.log(
      `\nEdition #${i} (royalty ${ROYALTIES[i - 1] / 100}%, on-chain basisPoints: ${onChain.royalties?.basisPoints}):`
    );
    console.log("Asset address:", asset.publicKey.toString());
    console.log("Explorer link:", explorerAddress(asset.publicKey.toString()));
  }
}

main().catch((err) => {
  console.error("Error creating editions:", err);
  process.exit(1);
});
