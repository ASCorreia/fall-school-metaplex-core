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

const COLLECTION_URI =
  "https://raw.githubusercontent.com/Portaudit/fall-school-metaplex-core/main/03-bonus-editions/metadata/collection.json";

const PRINT_URIS = [
  "https://raw.githubusercontent.com/Portaudit/fall-school-metaplex-core/main/03-bonus-editions/metadata/print-1.json",
  "https://raw.githubusercontent.com/Portaudit/fall-school-metaplex-core/main/03-bonus-editions/metadata/print-2.json",
  "https://raw.githubusercontent.com/Portaudit/fall-school-metaplex-core/main/03-bonus-editions/metadata/print-3.json",
];

async function main() {
  const umi = getUmi();
  console.log("Wallet:", umi.identity.publicKey.toString());

  // ── YOUR CODE STARTS HERE ────────────────────────────────────────────

  // TODO 1: the collection
  const collectionSigner = generateSigner(umi);

  await createCollection(umi, {
    collection: collectionSigner,
    name: "Portaudit Collection",
    uri: COLLECTION_URI,
    plugins: [
      { type: "MasterEdition", maxSupply: 3 },
      {
        type: "Royalties",
        basisPoints: 500,
        creators: [{ address: umi.identity.publicKey, percentage: 100 }],
        ruleSet: ruleSet("None"),
      },
    ],
  }).sendAndConfirm(umi, { confirm: { commitment: "finalized" } });

  console.log("Collection address:", collectionSigner.publicKey.toString());
  console.log("Collection Explorer:", explorerAddress(collectionSigner.publicKey.toString()));

  // TODO 2: three prints in a loop
  // Small delay to avoid devnet RPC propagation lag after finalized confirm
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const collection = await fetchCollection(umi, collectionSigner.publicKey);
  const ROYALTIES = [250, 500, 1000];

  for (let i = 1; i <= 3; i++) {
    const asset = generateSigner(umi);
    await create(umi, {
      asset,
      collection,
      name: `Portaudit Print #${i}`,
      uri: PRINT_URIS[i - 1],
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

    // TODO 3: print the explorer link for this asset
    console.log(`Print #${i} address:`, asset.publicKey.toString());
    console.log(`Print #${i} Explorer:`, explorerAddress(asset.publicKey.toString()));
  }

  // ── YOUR CODE ENDS HERE ──────────────────────────────────────────────
}

main();
