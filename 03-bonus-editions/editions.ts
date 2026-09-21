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

const URI =
  "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json";

async function main() {
  const umi = getUmi();
  console.log("Wallet:", umi.identity.publicKey.toString());

  // ── YOUR CODE STARTS HERE ────────────────────────────────────────────
  //
  // TODO 1: createCollection(umi, { ... }) with the MasterEdition plugin
  //         (maxSupply: 3) and a Royalties plugin (e.g. basisPoints: 500).
  //
  // TODO 2: fetchCollection(...), then in a loop create 3 assets with:
  //         - the Edition plugin (number: 1, 2, 3)
  //         - a Royalties plugin with a DIFFERENT basisPoints each
  //
  // TODO 3: print all 4 explorer links (collection + 3 editions).
  //
  const royalties = [250, 500, 1000];
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

  console.log("Master Edition collection:", collectionSigner.publicKey.toString());
  let collection;
  for (let attempt = 0; attempt < 10; attempt++) {
    try {
      collection = await fetchCollection(umi, collectionSigner.publicKey);
      break;
    } catch (e) {
      if (attempt === 9) throw e;
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  for (let i = 1; i <= 3; i++) {
    const asset = generateSigner(umi);
    const basisPoints = royalties[i - 1];
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
  // ── YOUR CODE ENDS HERE ──────────────────────────────────────────────
}

main();
