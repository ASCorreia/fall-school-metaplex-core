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

const URI =
  "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json";

const COLLECTION_NAME = "Anna's Fall School Prints";
const MAX_SUPPLY = 3;

// Basis points: 100 bp = 1%, so these are 2.5%, 5% and 10%.
// The collection itself carries 500 (5%); each print overrides it with its own.
const COLLECTION_ROYALTY = 500;
const ROYALTIES = [250, 500, 1000];

/**
 * Devnet's read path lags its write path: an account can be confirmed by
 * sendAndConfirm and still 404 on the very next fetch. Retry briefly rather
 * than failing a run that actually succeeded on-chain.
 */
async function withRetry<T>(label: string, fn: () => Promise<T>, attempts = 8): Promise<T> {
  for (let i = 1; ; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i >= attempts) throw err;
      console.log(`  (${label} not visible yet, retry ${i}/${attempts - 1})`);
      await new Promise((r) => setTimeout(r, 1000 * i));
    }
  }
}

async function main() {
  const umi = getUmi();
  console.log("Wallet:", umi.identity.publicKey.toString());

  // ── YOUR CODE STARTS HERE ────────────────────────────────────────────

  // The collection is the "original". MasterEdition marks it as such and
  // maxSupply caps how many prints may exist. No freeze plugin anywhere here:
  // royalties are only ever paid on a sale, and a frozen asset can never be
  // sold, so soulbinding a print would make its royalty meaningless.
  const collectionSigner = generateSigner(umi);

  await createCollection(umi, {
    collection: collectionSigner,
    name: COLLECTION_NAME,
    uri: URI,
    plugins: [
      { type: "MasterEdition", maxSupply: MAX_SUPPLY },
      {
        type: "Royalties",
        basisPoints: COLLECTION_ROYALTY,
        creators: [{ address: umi.identity.publicKey, percentage: 100 }],
        ruleSet: ruleSet("None"),
      },
    ],
  }).sendAndConfirm(umi);

  console.log("\nCollection:", explorerAddress(collectionSigner.publicKey.toString()));

  // create() needs the whole collection, not just its address, so read it back.
  const collection = await withRetry("collection", () =>
    fetchCollection(umi, collectionSigner.publicKey)
  );

  for (let i = 1; i <= MAX_SUPPLY; i++) {
    const asset = generateSigner(umi);
    const basisPoints = ROYALTIES[i - 1];

    await create(umi, {
      asset,
      collection,
      name: `${COLLECTION_NAME} — PRINT #${i}`,
      uri: URI,
      plugins: [
        { type: "Edition", number: i },
        {
          // An asset-level Royalties plugin overrides the collection's, which
          // is the whole mechanism behind three prints paying three rates.
          type: "Royalties",
          basisPoints,
          creators: [{ address: umi.identity.publicKey, percentage: 100 }],
          ruleSet: ruleSet("None"),
        },
      ],
    }).sendAndConfirm(umi);

    // Read it back rather than trusting the request: if the override failed
    // silently we would otherwise see the collection's 500 three times.
    const onChain = await withRetry(`print #${i}`, () => fetchAsset(umi, asset.publicKey));
    console.log(
      `Print #${i}: ${explorerAddress(asset.publicKey.toString())}` +
        `  (edition ${onChain.edition?.number}, royalty ${onChain.royalties?.basisPoints} bp)`
    );
  }

  // ── YOUR CODE ENDS HERE ──────────────────────────────────────────────
}

main();
