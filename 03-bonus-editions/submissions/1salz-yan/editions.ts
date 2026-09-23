/**
 * BONUS CHALLENGE: Print Editions with different royalties.
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

// Basis points: 100 bp = 1%. So 250 = 2.5%, 500 = 5%, 1000 = 10%.
const ROYALTIES = [250, 500, 1000];

/** Retry a read until the (load-balanced) devnet RPC has caught up. */
async function fetchCollectionWithRetry(
  umi: ReturnType<typeof getUmi>,
  address: Parameters<typeof fetchCollection>[1],
  tries = 20,
  delayMs = 1500,
) {
  for (let attempt = 1; ; attempt++) {
    try {
      return await fetchCollection(umi, address);
    } catch (err) {
      if (attempt >= tries) throw err;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

async function main() {
  const umi = getUmi();
  console.log("Wallet:", umi.identity.publicKey.toString());

  // TODO 1: the collection is the "original painting": one MasterEdition
  // plugin (maxSupply: 3 -> only 3 prints can ever be made) plus a
  // collection-level Royalties plugin that acts as the default for prints.
  const collectionSigner = generateSigner(umi);
  await createCollection(umi, {
    collection: collectionSigner,
    name: "Xinyan Liu - Fall School Master Edition",
    uri: URI,
    plugins: [
      {
        type: "MasterEdition",
        maxSupply: 3,
        name: undefined, // inherit from the collection
        uri: undefined,
      },
      {
        type: "Royalties",
        basisPoints: 750, // 7.5% collection-wide default (print #2 overrides it)
        creators: [{ address: umi.identity.publicKey, percentage: 100 }],
        ruleSet: ruleSet("None"), // no marketplace is blocked
      },
    ],
  }).sendAndConfirm(umi);

  // Devnet's public RPC is load-balanced: a node can still be a few slots
  // behind right after the transaction confirms, so the read below would
  // sometimes come back "account not found". Retry until it is there.
  const collection = await fetchCollectionWithRetry(
    umi,
    collectionSigner.publicKey,
  );

  // TODO 2: print 3 numbered editions into the collection. `create` needs the
  // full collection object, not just its address.
  const editions = [];
  for (let i = 1; i <= 3; i++) {
    const asset = generateSigner(umi);
    await create(umi, {
      asset,
      collection,
      name: `Xinyan Liu - Fall School Print #${i}`,
      uri: URI,
      plugins: [
        // the print number
        { type: "Edition", number: i },
        // an asset-level Royalties plugin OVERRIDES the collection-level one,
        // which is how each print ends up with its own royalty
        {
          type: "Royalties",
          basisPoints: ROYALTIES[i - 1],
          creators: [{ address: umi.identity.publicKey, percentage: 100 }],
          ruleSet: ruleSet("None"),
        },
      ],
    }).sendAndConfirm(umi);
    editions.push(asset.publicKey);
  }

  // TODO 3: print all 4 explorer links (collection + 3 editions).
  console.log("\nAll 4 explorer links:");
  console.log(
    "\nMaster Edition collection:\n ",
    collectionSigner.publicKey.toString(),
    "\n ",
    explorerAddress(collectionSigner.publicKey.toString()),
  );
  editions.forEach((address, index) => {
    console.log(
      `\nEdition #${index + 1} (royalty ${ROYALTIES[index] / 100}%):\n `,
      address.toString(),
      "\n ",
      explorerAddress(address.toString()),
    );
  });
}

main();
