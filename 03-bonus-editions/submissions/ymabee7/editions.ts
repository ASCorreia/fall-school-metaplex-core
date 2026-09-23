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
import { getUmi, explorerAddress } from "../../../shared/umi";

const URI = "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json";

async function main() {
  const umi = getUmi();
  console.log("Wallet:", umi.identity.publicKey.toString());

  // ── YOUR CODE STARTS HERE ────────────────────────────────────────────
  //
  // TODO 1: createCollection(umi, { ... }) with the MasterEdition plugin
  //         (maxSupply: 3) and a Royalties plugin (e.g. basisPoints: 500).
  //
  const collectionSigner = generateSigner(umi);

  const { result } = await createCollection(umi, {
    collection: collectionSigner,
    name: "Master Edition Collection",
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
  }).sendAndConfirm(umi, { confirm: { commitment: "finalized" } });
  console.log("\nMaster Edition collection:", collectionSigner.publicKey.toString());
  console.log(explorerAddress(collectionSigner.publicKey.toString()));
  // TODO 2: fetchCollection(...), then in a loop create 3 assets with:
  //         - the Edition plugin (number: 1, 2, 3)
  //         - a Royalties plugin with a DIFFERENT basisPoints each
  //
  const collection = await fetchCollection(umi, collectionSigner.publicKey, {
    commitment: "confirmed",
    minContextSlot: result.context.slot,
  });
  // basis points: 250 = 2.5%, 500 = 5%, 1000 = 10%
  const ROYALTIES = [250, 500, 1000];

  for (let i = 1; i <= 3; i++) {
    const asset = generateSigner(umi);
    await create(umi, {
      asset,
      collection,
      name: `Edition #${i}`,
      uri: URI,
      plugins: [
        { type: "Edition", number: i },
        {
          type: "Royalties",
          basisPoints: ROYALTIES[i - 1],
          creators: [{ address: umi.identity.publicKey, percentage: 100 }],
          ruleSet: ruleSet("None"),
        },
      ],
    }).sendAndConfirm(umi);
    console.log(`Edition #${i} (${ROYALTIES[i - 1] / 100}%):`, explorerAddress(asset.publicKey.toString()));
  }
  // ── YOUR CODE ENDS HERE ──────────────────────────────────────────────
}

main();
