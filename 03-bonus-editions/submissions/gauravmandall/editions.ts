import { generateSigner } from "@metaplex-foundation/umi";
import {
  create,
  createCollection,
  fetchCollection,
  ruleSet,
} from "@metaplex-foundation/mpl-core";
import { getUmi, explorerAddress } from "../../shared/umi";

const URI =
  "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json";

// basis points: 250 = 2.5%, 500 = 5%, 1000 = 10%
const ROYALTIES = [250, 500, 1000];

async function main() {
  const umi = getUmi();
  console.log("Wallet:", umi.identity.publicKey.toString());

  // 1. Collection with the MasterEdition plugin
  const collectionSigner = generateSigner(umi);
  await createCollection(umi, {
    collection: collectionSigner,
    name: "Gaurav Mandal Master Edition",
    uri: URI,
    plugins: [
      {
        type: "MasterEdition",
        maxSupply: 3,
        name: undefined,
        uri: undefined,
      },
      {
        type: "Royalties",
        basisPoints: 500,
        creators: [{ address: umi.identity.publicKey, percentage: 100 }],
        ruleSet: ruleSet("None"),
      },
    ],
  }).sendAndConfirm(umi);
  console.log("\nMaster Edition collection:", collectionSigner.publicKey.toString());
  console.log(explorerAddress(collectionSigner.publicKey.toString()));

  // 2. Fetch collection with retry for devnet indexing
  let collection;
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      await new Promise((r) => setTimeout(r, 2000));
      collection = await fetchCollection(umi, collectionSigner.publicKey);
      break;
    } catch (e) {
      if (attempt === 4) throw e;
    }
  }
  if (!collection) {
    collection = await fetchCollection(umi, collectionSigner.publicKey);
  }

  // 3. Print 3 Editions, each with its own royalty
  for (let i = 1; i <= 3; i++) {
    const asset = generateSigner(umi);
    await create(umi, {
      asset,
      collection,
      name: `Gaurav Mandal Print #${i}`,
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
    }).sendAndConfirm(umi);

    console.log(
      `\nEdition #${i} (royalty ${ROYALTIES[i - 1] / 100}%):`,
      asset.publicKey.toString()
    );
    console.log(explorerAddress(asset.publicKey.toString()));
  }
}

main();
