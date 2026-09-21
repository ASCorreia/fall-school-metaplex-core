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
  throw new Error("Not implemented yet: replace this with your code!");
  // ── YOUR CODE ENDS HERE ──────────────────────────────────────────────
}

main();
