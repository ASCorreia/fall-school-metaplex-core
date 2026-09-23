/**
 * BONUS CHALLENGE: Print Editions with different royalties.
 * Run: npm run editions
 *
 * Requirements:
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
import { getUmi, explorerAddress } from "../../../shared/umi";

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
    name: "useing123 Master Edition",
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

  // Allow devnet RPC nodes to sync
  let collection;
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      collection = await fetchCollection(umi, collectionSigner.publicKey);
      break;
    } catch (err) {
      if (attempt === 4) throw err;
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  if (!collection) throw new Error("Failed to fetch collection");

  // 2. Print 3 Editions, each with its own royalty
  for (let i = 1; i <= 3; i++) {
    const asset = generateSigner(umi);
    await create(umi, {
      asset,
      collection,
      name: `useing123 Print #${i}`,
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
