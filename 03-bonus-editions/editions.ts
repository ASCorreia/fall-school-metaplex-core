/**
 * BONUS CHALLENGE (YOUR TASK): Print Editions with different royalties.
 * Run: npm run editions
 *
 * Requirements (see README.md):
 *  1. Collection with the MasterEdition plugin (maxSupply: 3)
 *     and a collection-level Royalties plugin
 *  2. Three assets printed into it with the Edition plugin (numbers 1-3)
 *  3. Each edition gets a DIFFERENT asset-level Royalties plugin
 *
 * Docs: https://www.metaplex.com/docs/smart-contracts/core/guides/print-editions
 */
import { generateSigner } from "@metaplex-foundation/umi";
import {
  create,
  createCollection,
  fetchCollection,
  ruleSet,
} from "@metaplex-foundation/mpl-core";
import { getUmi, explorerAddress } from "../shared/umi";

const URI = "https://example.com/metadata.json"; // your metadata JSON

async function main() {
  const umi = getUmi();
  console.log("Wallet:", umi.identity.publicKey.toString());

  const creators = [{ address: umi.identity.publicKey, percentage: 100 }];

  const collectionSigner = generateSigner(umi);
  await createCollection(umi, {
    collection: collectionSigner,
    name: "Bryan Fall School Editions",
    uri: URI,
    plugins: [
      { type: "MasterEdition", maxSupply: 3 },
      { type: "Royalties", basisPoints: 500, creators, ruleSet: ruleSet("None") },
    ],
  }).sendAndConfirm(umi);
  console.log("Collection:", explorerAddress(collectionSigner.publicKey.toString()));

  let collection;
  for (let attempt = 0; ; attempt++) {
    try {
      collection = await fetchCollection(umi, collectionSigner.publicKey);
      break;
    } catch (e) {
      if (attempt >= 10) throw e;
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  const ROYALTIES = [250, 500, 1000];
  for (let i = 1; i <= 3; i++) {
    const asset = generateSigner(umi);
    await create(umi, {
      asset,
      collection,
      name: `PRINT #${i}`,
      uri: URI,
      plugins: [
        { type: "Edition", number: i },
        { type: "Royalties", basisPoints: ROYALTIES[i - 1], creators, ruleSet: ruleSet("None") },
      ],
    }).sendAndConfirm(umi);
    console.log(`Edition #${i} (${ROYALTIES[i - 1] / 100}%):`, explorerAddress(asset.publicKey.toString()));
  }
}

main();
