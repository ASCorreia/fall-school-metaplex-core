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
import { generateSigner, PublicKey, Umi } from "@metaplex-foundation/umi";
import {
  create,
  createCollection,
  fetchCollection,
  ruleSet,
} from "@metaplex-foundation/mpl-core";
import { getUmi, explorerAddress } from "../shared/umi";

const URI =
  "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json";

/** The collection-level default: what an edition inherits if it has no plugin of its own. */
const COLLECTION_ROYALTY_BPS = 500; // 5%

/** Per-edition overrides. Each differs, and each overrides the 5% above. */
const EDITION_ROYALTY_BPS = [250, 500, 1000]; // 2.5%, 5%, 10%

/**
 * Waits until `address` is visible at umi's default commitment.
 *
 * `sendAndConfirm` returns at "confirmed", but umi's RPC reads default to a
 * stricter commitment, so fetching straight afterwards can miss an account that
 * definitely exists. Polling here rather than racing it.
 */
async function waitForAccount(umi: Umi, address: PublicKey, label: string) {
  process.stdout.write(`Waiting for ${label} to finalize`);
  for (let i = 0; i < 60; i++) {
    if ((await umi.rpc.getAccount(address)).exists) {
      console.log(" ok");
      return;
    }
    process.stdout.write(".");
    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error(`${label} never became visible at the default commitment`);
}

async function main() {
  const umi = getUmi();
  console.log("Wallet:", umi.identity.publicKey.toString());

  // ── YOUR CODE STARTS HERE ────────────────────────────────────────────

  // The "original painting": a collection carrying the MasterEdition plugin.
  // maxSupply caps how many prints can ever exist, and the collection-level
  // Royalties plugin is the default every edition inherits unless it carries
  // one of its own.
  const collection = generateSigner(umi);
  const creator = umi.identity.publicKey;

  await createCollection(umi, {
    collection,
    name: "Eshan's Fall School Master Edition",
    uri: URI,
    plugins: [
      {
        type: "MasterEdition",
        maxSupply: 3,
        name: "Eshan's Fall School Master Edition",
        uri: URI,
      },
      {
        type: "Royalties",
        basisPoints: COLLECTION_ROYALTY_BPS,
        creators: [{ address: creator, percentage: 100 }],
        ruleSet: ruleSet("None"),
      },
    ],
  }).sendAndConfirm(umi);

  console.log("\nCollection (MasterEdition):", collection.publicKey.toString());
  console.log("  ", explorerAddress(collection.publicKey.toString()));
  console.log(`   collection-level royalty: ${COLLECTION_ROYALTY_BPS / 100}%`);

  // `create` needs the fetched collection so it can validate the print against
  // the MasterEdition plugin (supply, numbering) before minting.
  await waitForAccount(umi, collection.publicKey, "the collection");
  const collectionData = await fetchCollection(umi, collection.publicKey);

  // Three numbered prints. Each carries its own asset-level Royalties plugin,
  // which takes precedence over the collection's for that asset.
  const editionAddresses: string[] = [];

  for (let i = 0; i < EDITION_ROYALTY_BPS.length; i++) {
    const number = i + 1;
    const basisPoints = EDITION_ROYALTY_BPS[i];
    const edition = generateSigner(umi);

    await create(umi, {
      asset: edition,
      collection: collectionData,
      name: `Eshan's Fall School Edition #${number}`,
      uri: URI,
      plugins: [
        { type: "Edition", number },
        {
          type: "Royalties",
          basisPoints,
          creators: [{ address: creator, percentage: 100 }],
          ruleSet: ruleSet("None"),
        },
      ],
    }).sendAndConfirm(umi);

    editionAddresses.push(edition.publicKey.toString());
    console.log(`\nEdition #${number} (royalty ${basisPoints / 100}%):`, edition.publicKey.toString());
    console.log("  ", explorerAddress(edition.publicKey.toString()));
  }

  console.log("\n--- Submission links ---");
  console.log("Collection:", explorerAddress(collection.publicKey.toString()));
  editionAddresses.forEach((address, i) => {
    console.log(`Edition #${i + 1} (${EDITION_ROYALTY_BPS[i] / 100}%):`, explorerAddress(address));
  });

  // ── YOUR CODE ENDS HERE ──────────────────────────────────────────────
}

main();
