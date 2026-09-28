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

// Basis points, one per print: 2.5%, 5%, 10%. 100 bp = 1%.
const ROYALTIES = [250, 500, 1000];

async function main() {
  const umi = getUmi();
  console.log("Wallet:", umi.identity.publicKey.toString());

  // ── YOUR CODE STARTS HERE ────────────────────────────────────────────

  const creators = [{ address: umi.identity.publicKey, percentage: 100 }];

  // The collection is the original painting. MasterEdition caps how many
  // prints can exist; the collection-level Royalties plugin is the default
  // each print inherits unless it carries one of its own.
  const collectionSigner = generateSigner(umi);
  await createCollection(umi, {
    collection: collectionSigner,
    name: "Saba — Fall School Prints",
    uri: URI,
    plugins: [
      { type: "MasterEdition", maxSupply: ROYALTIES.length },
      {
        type: "Royalties",
        basisPoints: 500,
        creators,
        // ruleSet('None') leaves royalties advisory: any program may transfer
        // these assets. Core limits who can move an asset; it never pays
        // anyone. Enforcement would need ProgramAllowList.
        ruleSet: ruleSet("None"),
      },
    ],
  }).sendAndConfirm(umi);

  // create() needs the fetched collection, not just its address: it reads the
  // collection's own plugins to validate the print against them.
  const collection = await fetchCollection(umi, collectionSigner.publicKey);

  const editions: string[] = [];

  for (let i = 0; i < ROYALTIES.length; i++) {
    const number = i + 1;
    const asset = generateSigner(umi);

    await create(umi, {
      asset,
      collection,
      name: `PRINT #${number}`,
      uri: URI,
      plugins: [
        // Edition carries this print's number. MasterEdition on the
        // collection is what makes the numbering meaningful and bounded.
        { type: "Edition", number },
        // An asset-level plugin overrides the same plugin on the collection,
        // so this royalty — not the collection's 500 — is what applies here.
        {
          type: "Royalties",
          basisPoints: ROYALTIES[i],
          creators,
          ruleSet: ruleSet("None"),
        },
      ],
      // No freeze plugin: a print that cannot be sold has no use for a
      // royalty, since royalties only ever apply on a sale.
    }).sendAndConfirm(umi);

    editions.push(asset.publicKey.toString());
  }

  console.log("\nCollection:", explorerAddress(collectionSigner.publicKey.toString()));
  editions.forEach((address, i) => {
    console.log(
      `Edition #${i + 1} (${ROYALTIES[i]} bp):`,
      explorerAddress(address),
    );
  });

  // ── YOUR CODE ENDS HERE ──────────────────────────────────────────────
}

main();
