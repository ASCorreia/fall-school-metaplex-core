/**
 * BONUS REFERENCE SOLUTION: Print Editions with per-asset royalties.
 * Run: npm run solution
 *
 * Creates a Master Edition collection, then prints 3 Editions into it,
 * each with a DIFFERENT royalty (asset-level Royalties overrides the
 * collection-level plugin).
 *
 * Note: editions are NOT soulbound, since royalties only matter for assets
 * that can actually be transferred/sold.
 */
import { generateSigner } from "@metaplex-foundation/umi";
import {
  create,
  createCollection,
  fetchCollection,
  ruleSet,
} from "@metaplex-foundation/mpl-core";
import { getUmi, explorerAddress } from "../../shared/umi";

const URI =
  "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json";

// basis points: 250 = 2.5%, 500 = 5%, 1000 = 10%
const ROYALTIES = [250, 500, 1000];

async function main() {
  const umi = getUmi();
  console.log("Wallet:", umi.identity.publicKey.toString());

  // 1. Collection with the MasterEdition plugin (the "original painting")
  const collectionSigner = generateSigner(umi);
  await createCollection(umi, {
    collection: collectionSigner,
    name: "Fall School Master Edition",
    uri: URI,
    plugins: [
      {
        type: "MasterEdition",
        maxSupply: 3,
        name: undefined, // inherit from collection
        uri: undefined,
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

  const collection = await fetchCollection(umi, collectionSigner.publicKey);

  // 2. Print 3 Editions, each with its own royalty
  for (let i = 1; i <= 3; i++) {
    const asset = generateSigner(umi);
    await create(umi, {
      asset,
      collection,
      name: `Fall School Print #${i}`,
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
}

main();
