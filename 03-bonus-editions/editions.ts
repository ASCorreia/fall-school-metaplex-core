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

  // ── YOUR CODE STARTS HERE ────────────────────────────────────────────

  // TODO 1: the "painting". A collection with:
  //   - MasterEdition: marks it as the original and caps prints at 3
  //   - Royalties (5%): the collection-level default every print inherits
  //     unless the print overrides it with its own Royalties plugin.
  const collectionSigner = generateSigner(umi);
  await createCollection(umi, {
    collection: collectionSigner,
    name: "the-axmc | Fall School Master Edition",
    uri: URI,
    plugins: [
      { type: "MasterEdition", maxSupply: 3 },
      {
        type: "Royalties",
        basisPoints: 500,
        creators: [{ address: umi.identity.publicKey, percentage: 100 }],
        ruleSet: ruleSet("None"),
      },
    ],
  }).sendAndConfirm(umi);
  console.log("Collection created:", collectionSigner.publicKey.toString());

  // TODO 2: the numbered prints. Each asset joins the collection, carries
  // its Edition number, and overrides the collection royalty with its own.
  // 100 basis points = 1%, so 250 / 500 / 1000 = 2.5% / 5% / 10%.
  // No freeze plugin here on purpose: a print must be sellable for
  // royalties to mean anything.
  // Devnet RPC nodes are load-balanced, so the node answering the read may
  // lag a second behind the one that confirmed the write. Retry briefly.
  let collection;
  for (let attempt = 1; ; attempt++) {
    try {
      collection = await fetchCollection(umi, collectionSigner.publicKey, {
        commitment: "confirmed",
      });
      break;
    } catch (err) {
      if (attempt >= 10) throw err;
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  const ROYALTY_BPS = [250, 500, 1000];
  const editions: string[] = [];

  for (let i = 1; i <= 3; i++) {
    const asset = generateSigner(umi);
    await create(umi, {
      asset,
      collection,
      name: `the-axmc | Fall School Print #${i}`,
      uri: URI,
      plugins: [
        { type: "Edition", number: i },
        {
          type: "Royalties",
          basisPoints: ROYALTY_BPS[i - 1],
          creators: [{ address: umi.identity.publicKey, percentage: 100 }],
          ruleSet: ruleSet("None"),
        },
      ],
    }).sendAndConfirm(umi);
    editions.push(asset.publicKey.toString());
    console.log(`Edition #${i} (${ROYALTY_BPS[i - 1] / 100}%):`, editions[i - 1]);
  }

  // TODO 3: the four explorer links.
  console.log("\nExplorer links:");
  console.log("Collection:", explorerAddress(collectionSigner.publicKey.toString()));
  editions.forEach((address, idx) =>
    console.log(`Edition #${idx + 1}:`, explorerAddress(address))
  );

  // ── YOUR CODE ENDS HERE ──────────────────────────────────────────────
}

main();
