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

const COLLECTION_NAME = "Pablo's Fall School Prints";
const MAX_SUPPLY = 3;

// Basis points: 100 bp = 1%. Print #1 = 2.5%, #2 = 5%, #3 = 10%.
const ROYALTIES = [250, 500, 1000];
// The collection's own royalty. Every asset that does NOT carry its own
// Royalties plugin inherits this one.
const COLLECTION_ROYALTY = 500;

/**
 * `sendAndConfirm` confirms at `confirmed` commitment, but the next read can
 * land on an RPC node that has not caught up yet -- public devnet is a load
 * balancer over many nodes. Retry with backoff instead of a blind sleep, so
 * the happy path stays fast and a genuinely missing account still fails.
 */
async function fetchCollectionWhenVisible(
  umi: ReturnType<typeof getUmi>,
  address: Parameters<typeof fetchCollection>[1],
  attempts = 8
): Promise<Awaited<ReturnType<typeof fetchCollection>>> {
  for (let i = 1; i <= attempts; i++) {
    try {
      return await fetchCollection(umi, address);
    } catch (err) {
      if (i === attempts) throw err;
      console.log(`  collection not visible yet, retrying (${i}/${attempts - 1})...`);
      await new Promise((resolve) => setTimeout(resolve, 1000 * i));
    }
  }
  throw new Error("unreachable");
}

async function main() {
  const umi = getUmi();
  console.log("Wallet:", umi.identity.publicKey.toString());

  // ── The original ────────────────────────────────────────────────────
  const collectionSigner = generateSigner(umi);

  await createCollection(umi, {
    collection: collectionSigner,
    name: COLLECTION_NAME,
    uri: URI,
    plugins: [
      // Marks this as the original and caps the run at MAX_SUPPLY prints.
      { type: "MasterEdition", maxSupply: MAX_SUPPLY },
      {
        type: "Royalties",
        basisPoints: COLLECTION_ROYALTY,
        // Percentages across all creators must sum to 100.
        creators: [{ address: umi.identity.publicKey, percentage: 100 }],
        // No marketplace program is allow- or deny-listed.
        ruleSet: ruleSet("None"),
      },
    ],
  }).sendAndConfirm(umi);

  console.log("\nCollection:", explorerAddress(collectionSigner.publicKey.toString()));
  console.log(`  MasterEdition maxSupply ${MAX_SUPPLY}, royalty ${COLLECTION_ROYALTY / 100}%`);

  // `create` needs the whole collection account, not just its address: it
  // reads the collection's plugins to validate the mint (MasterEdition's
  // supply cap) and to bump num_minted / current_size.
  const collection = await fetchCollectionWhenVisible(umi, collectionSigner.publicKey);

  // ── The prints ──────────────────────────────────────────────────────
  for (let i = 1; i <= MAX_SUPPLY; i++) {
    const basisPoints = ROYALTIES[i - 1];
    const asset = generateSigner(umi);

    await create(umi, {
      asset,
      collection,
      name: `${COLLECTION_NAME} #${i}`,
      uri: URI,
      plugins: [
        // This print's number within the run.
        { type: "Edition", number: i },
        // An asset-level plugin SHADOWS the collection's plugin of the same
        // type, so this royalty is what applies to this print -- not the
        // collection's COLLECTION_ROYALTY.
        {
          type: "Royalties",
          basisPoints,
          creators: [{ address: umi.identity.publicKey, percentage: 100 }],
          ruleSet: ruleSet("None"),
        },
      ],
      // No freeze plugin here on purpose: royalties are only ever paid on a
      // sale, and a frozen asset can never be sold.
    }).sendAndConfirm(umi);

    console.log(`\nEdition #${i} (royalty ${basisPoints / 100}%):`);
    console.log("  " + explorerAddress(asset.publicKey.toString()));
  }
}

main();
