import { generateSigner } from "@metaplex-foundation/umi";
import {
  create,
  createCollection,
  fetchCollection,
  ruleSet,
} from "@metaplex-foundation/mpl-core";
import { getUmi, explorerAddress } from "../../../shared/umi";

const URI =
  "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json";
const ROYALTIES = [250, 500, 1000];

async function main() {
  const umi = getUmi();
  const collectionSigner = generateSigner(umi);

  await createCollection(umi, {
    collection: collectionSigner,
    name: "Aditya's Master Edition",
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

  console.log("Master Edition collection:");
  console.log(explorerAddress(collectionSigner.publicKey.toString()));

  const collection = await fetchCollection(umi, collectionSigner.publicKey);
  for (let i = 1; i <= 3; i++) {
    const asset = generateSigner(umi);
    const basisPoints = ROYALTIES[i - 1];
    await create(umi, {
      asset,
      collection,
      name: `Aditya's Print #${i}`,
      uri: URI,
      plugins: [
        { type: "Edition", number: i },
        {
          type: "Royalties",
          basisPoints,
          creators: [{ address: umi.identity.publicKey, percentage: 100 }],
          ruleSet: ruleSet("None"),
        },
      ],
    }).sendAndConfirm(umi);

    console.log(`Edition #${i} (royalty ${basisPoints / 100}%):`);
    console.log(explorerAddress(asset.publicKey.toString()));
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
