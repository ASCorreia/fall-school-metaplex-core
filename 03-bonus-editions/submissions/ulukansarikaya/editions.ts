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
import { generateSigner, publicKey } from "@metaplex-foundation/umi";
import {
  create,
  createCollection,
  fetchCollection,
  ruleSet,
} from "@metaplex-foundation/mpl-core";
import { getUmi, explorerAddress } from "./umi";

const URI =
  "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json";

// Each edition gets its OWN royalty. basis points: 250 = 2.5%, 500 = 5%, 1000 = 10%
const ROYALTIES = [250, 500, 1000];

// The wallet the printed editions belong to (your Phantom devnet address).
// Editions are NOT soulbound, so they remain transferable/sellable.
const OWNER = publicKey("2gJbmwwuQcTgjGvas8k6tureeXnTLEnrgmdKvwZqdTVQ");

async function main() {
  const umi = getUmi();
  console.log("Wallet:", umi.identity.publicKey.toString());

  // ── YOUR CODE STARTS HERE ────────────────────────────────────────────

  // TODO 1: The collection is the "original painting". Its MasterEdition
  //         plugin caps the print run at maxSupply: 3, and its Royalties
  //         plugin sets the DEFAULT (collection-level) royalty of 5%.
  const collectionSigner = generateSigner(umi);
  await createCollection(umi, {
    collection: collectionSigner,
    name: "Ulukan Master Edition",
    uri: URI,
    plugins: [
      {
        type: "MasterEdition",
        maxSupply: 3,
        name: undefined, // inherit name from the collection
        uri: undefined, // inherit uri from the collection
      },
      {
        // collection-level default royalty (5%)
        type: "Royalties",
        basisPoints: 500,
        creators: [{ address: umi.identity.publicKey, percentage: 100 }],
        ruleSet: ruleSet("None"),
      },
    ],
  }).sendAndConfirm(umi);
  console.log("\nMaster Edition collection:", collectionSigner.publicKey.toString());
  console.log(explorerAddress(collectionSigner.publicKey.toString()));

  // Fetch the collection so `create` can validate the edition against it.
  const collection = await fetchCollection(umi, collectionSigner.publicKey);

  // TODO 2: Print 3 numbered editions into the collection. Each carries:
  //         - the Edition plugin (number: 1, 2, 3), the print's serial no.
  //         - an asset-level Royalties plugin that OVERRIDES the
  //           collection-level default with its own basisPoints.
  for (let i = 1; i <= 3; i++) {
    const asset = generateSigner(umi);
    await create(umi, {
      asset,
      collection,
      owner: OWNER, // send the print to the Phantom wallet
      name: `Ulukan Print #${i}`,
      uri: URI,
      plugins: [
        { type: "Edition", number: i },
        {
          // asset-level royalty OVERRIDES the collection-level one
          type: "Royalties",
          basisPoints: ROYALTIES[i - 1],
          creators: [{ address: umi.identity.publicKey, percentage: 100 }],
          ruleSet: ruleSet("None"),
        },
      ],
    }).sendAndConfirm(umi);
    console.log(
      `\nEdition #${i} (royalty ${ROYALTIES[i - 1] / 100}%):`,
      asset.publicKey.toString()
    );
    console.log(explorerAddress(asset.publicKey.toString()));
  }

  // TODO 3: (done above) all 4 explorer links are printed as we go.
  // ── YOUR CODE ENDS HERE ──────────────────────────────────────────────
}

main();
