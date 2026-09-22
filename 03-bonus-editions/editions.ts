import { generateSigner } from "@metaplex-foundation/umi";
import { create, createCollection, fetchCollection, ruleSet } from "@metaplex-foundation/mpl-core";
import { getUmi, explorerAddress } from "../shared/umi";

const URI = "https://gist.githubusercontent.com/DweetParikh/148123c22b2e68a0058fde4f09721ceb/raw/c78836c70280881c5ea825f8c8028df446578aa4/gistfile1.txt";
const ROYALTIES = [250, 500, 1000]; // 2.5% / 5% / 10%

async function fetchCollectionWithRetry(
  umi: Parameters<typeof fetchCollection>[0],
  address: Parameters<typeof fetchCollection>[1],
  attempts = 10,
  delayMs = 2000
) {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fetchCollection(umi, address);
    } catch (e) {
      if (i === attempts - 1) throw e;
      console.log(`Collection not visible yet, retrying (${i + 1}/${attempts})...`);
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw new Error("unreachable");
}

async function main() {
  const umi = getUmi();

  const collectionSigner = generateSigner(umi);
  await createCollection(umi, {
    collection: collectionSigner,
    name: "Fall School Master Edition",
    uri: URI,
    plugins: [
      { type: "MasterEdition", maxSupply: 3 },
      { type: "Royalties", basisPoints: 500,
        creators: [{ address: umi.identity.publicKey, percentage: 100 }],
        ruleSet: ruleSet("None") },
    ],
  }).sendAndConfirm(umi);
  console.log(explorerAddress(collectionSigner.publicKey.toString()));

  const collection = await fetchCollectionWithRetry(umi, collectionSigner.publicKey);

  for (let i = 1; i <= 3; i++) {
    const asset = generateSigner(umi);
    await create(umi, {
      asset, collection, name: `Fall School Print #${i}`, uri: URI,
      plugins: [
        { type: "Edition", number: i },
        { type: "Royalties", basisPoints: ROYALTIES[i - 1],
          creators: [{ address: umi.identity.publicKey, percentage: 100 }],
          ruleSet: ruleSet("None") },
      ],
    }).sendAndConfirm(umi);
    console.log(`Edition #${i}:`, explorerAddress(asset.publicKey.toString()));
  }
}
main();
