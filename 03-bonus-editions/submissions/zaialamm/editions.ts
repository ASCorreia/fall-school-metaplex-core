/**
 * BONUS CHALLENGE (YOUR TASK): Print Editions with different royalties.
 * Run from 03-bonus-editions: npx tsx submissions/zaialamm/editions.ts
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
import { getUmi, explorerAddress } from "../../../shared/umi";

const URI =
  "https://gist.githubusercontent.com/zaialamm/213830f29409d1816fda07c27b162f87/raw/zai-metadata.json"; // your metadata JSON
const COLLECTION_NAME = "Zai as Hiro Hamada Prints";
const MAX_SUPPLY = 3;
// Royalties are in basis points: 100 bps = 1%. So 250 = 2.5%, 500 = 5%, 1000 = 10%.
const COLLECTION_ROYALTY = 500;
const ROYALTIES = [250, 500, 1000];

// Devnet RPC nodes can lag a moment behind a just-confirmed write; retry reads.
async function withRetry<T>(fn: () => Promise<T>, attempts = 6, delayMs = 2000): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await fn();
    } catch (e) {
      if (attempt >= attempts) throw e;
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
}

async function main() {
  const umi = getUmi();
  console.log("Wallet:", umi.identity.publicKey.toString());

  // ── YOUR CODE STARTS HERE ────────────────────────────────────────────

  // Who gets paid on every resale. Percentages must add up to 100.
  const creators = [{ address: umi.identity.publicKey, percentage: 100 }];

  // TODO 1: the collection is the "original painting".
  //   MasterEdition (maxSupply: 3) marks it as the original with 3 prints.
  //   Royalties (500 bps = 5%) is the collection-level default.
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
        creators,
        ruleSet: ruleSet("None"), // no marketplace is blocked
      },
    ],
  }).sendAndConfirm(umi);

  console.log("\nCollection:", collectionSigner.publicKey.toString());
  console.log("  ", explorerAddress(collectionSigner.publicKey.toString()));

  // TODO 2: three numbered prints. `create` needs the full collection account,
  //   not just its address, so load it first.
  const collection = await withRetry(() => fetchCollection(umi, collectionSigner.publicKey));
  const editions: string[] = [];

  for (let i = 1; i <= MAX_SUPPLY; i++) {
    const asset = generateSigner(umi);
    await create(umi, {
      asset,
      collection,
      name: `${COLLECTION_NAME} #${i}`,
      uri: URI,
      plugins: [
        // 1. the Edition plugin gives this print its number
        { type: "Edition", number: i },
        // 2. an asset-level Royalties plugin OVERRIDES the collection's 500 bps
        {
          type: "Royalties",
          basisPoints: ROYALTIES[i - 1],
          creators,
          ruleSet: ruleSet("None"),
        },
      ],
    }).sendAndConfirm(umi);

    // TODO 3: print the explorer link for this print, and read its royalty
    //   back from devnet to prove the asset-level plugin won.
    const onChain = await withRetry(() => fetchAsset(umi, asset.publicKey));
    console.log(
      `\nEdition #${onChain.edition?.number}: ${asset.publicKey.toString()}` +
        ` (royalty: ${onChain.royalties?.basisPoints} bps)`
    );
    console.log("  ", explorerAddress(asset.publicKey.toString()));
    editions.push(asset.publicKey.toString());
  }

  console.log("\nAll 4 explorer links:");
  console.log("Collection:", explorerAddress(collectionSigner.publicKey.toString()));
  editions.forEach((e, i) =>
    console.log(`Edition #${i + 1} (${ROYALTIES[i] / 100}%):`, explorerAddress(e))
  );

  // ── YOUR CODE ENDS HERE ──────────────────────────────────────────────
}

main();
