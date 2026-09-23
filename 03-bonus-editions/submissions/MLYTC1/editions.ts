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
  fetchAsset,
  fetchCollection,
  ruleSet,
} from "@metaplex-foundation/mpl-core";

import { getUmi, explorerAddress } from "../shared/umi";

const URI = "https://example.com/metadata.json";

async function main() {
  const umi = getUmi();

  console.log("Wallet:", umi.identity.publicKey.toString());

  // ── YOUR CODE STARTS HERE ────────────────────────────────────────────

  // TODO 1: Create the collection.
  const collectionSigner = generateSigner(umi);

  await createCollection(umi, {
    collection: collectionSigner,
    name: "Print Editions Collection",
    uri: URI,
    plugins: [
      {
        type: "MasterEdition",
        maxSupply: 3,
      },
      {
        type: "Royalties",
        basisPoints: 500,
        creators: [
          {
            address: umi.identity.publicKey,
            percentage: 100,
          },
        ],
        ruleSet: ruleSet("None"),
      },
    ],
  }).sendAndConfirm(umi);

  console.log(
    "Collection:",
    explorerAddress(collectionSigner.publicKey)
  );

  // TODO 2: Fetch the collection.
  // The RPC can take a moment to expose the newly-created account,
  // so retry the fetch a few times.
  let collection;

  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      collection = await fetchCollection(
        umi,
        collectionSigner.publicKey
      );
      break;
    } catch (error) {
      if (attempt === 5) {
        throw error;
      }

      console.log(
        `Waiting for collection... attempt ${attempt}/5`
      );

      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  if (!collection) {
    throw new Error("Collection could not be fetched");
  }

  // Each edition has a different royalty.
  // 250 = 2.5%, 500 = 5%, 1000 = 10%.
  const ROYALTIES = [250, 500, 1000];

  for (let i = 1; i <= 3; i++) {
    const asset = generateSigner(umi);

    await create(umi, {
      asset,
      collection,
      name: `Print Edition #${i}`,
      uri: URI,
      plugins: [
        {
          type: "Edition",
          number: i,
        },
        {
          type: "Royalties",
          basisPoints: ROYALTIES[i - 1],
          creators: [
            {
              address: umi.identity.publicKey,
              percentage: 100,
            },
          ],
          ruleSet: ruleSet("None"),
        },
      ],
    }).sendAndConfirm(umi);

    // TODO 3: Print explorer link.
    console.log(
      `Edition #${i}:`,
      explorerAddress(asset.publicKey)
    );

    // Verify the asset-level royalty overrides the
    // collection-level 500 bps royalty.
    const onChain = await fetchAsset(umi, asset.publicKey);

    console.log(
      `Edition #${i} royalty:`,
      onChain.royalties?.basisPoints
    );
  }

  // ── YOUR CODE ENDS HERE ──────────────────────────────────────────────
}

main();
