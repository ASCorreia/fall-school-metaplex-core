import { generateSigner, publicKey } from "@metaplex-foundation/umi";
import {
  create,
  createCollection,
  fetchCollection,
  ruleSet,
} from "@metaplex-foundation/mpl-core";
import { getUmi, explorerAddress } from "./umi";

const URI =
  "https://raw.githubusercontent.com/ABICITYE/summer-school-metaplex-core/main/Metadata.json";

const ROYALTIES = [100, 250, 500];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchWithRetry(umi: any, address: any, tries = 15) {
  for (let i = 0; i < tries; i++) {
    try {
      return await fetchCollection(umi, address);
    } catch {
      console.log(`  waiting for collection... (${i + 1})`);
      await sleep(3000);
    }
  }
  throw new Error("Collection never became readable");
}

async function main() {
  const umi = getUmi();
  console.log("Wallet:", umi.identity.publicKey.toString());

  const creators = [{ address: umi.identity.publicKey, percentage: 100 }];
  const collectionSigner = generateSigner(umi);

  await createCollection(umi, {
    collection: collectionSigner,
    name: "Abicity Editions",
    uri: URI,
    plugins: [
      { type: "MasterEdition", maxSupply: 3, name: "Abicity Editions", uri: URI },
      { type: "Royalties", basisPoints: 500, creators, ruleSet: ruleSet("None") },
    ],
  }).sendAndConfirm(umi);

  console.log("Collection:", explorerAddress(collectionSigner.publicKey));

  const collection = await fetchWithRetry(umi, collectionSigner.publicKey);

  for (let i = 1; i <= 3; i++) {
    const editionSigner = generateSigner(umi);

    await create(umi, {
      asset: editionSigner,
      collection,
      name: `Abicity Edition #${i}`,
      uri: URI,
      plugins: [
        { type: "Edition", number: i },
        {
          type: "Royalties",
          basisPoints: ROYALTIES[i - 1],
          creators,
          ruleSet: ruleSet("None"),
        },
      ],
    }).sendAndConfirm(umi);

    console.log(
      `Edition #${i} (${ROYALTIES[i - 1]} bps):`,
      explorerAddress(editionSigner.publicKey)
    );

    await sleep(1000);
  }
}

main();
