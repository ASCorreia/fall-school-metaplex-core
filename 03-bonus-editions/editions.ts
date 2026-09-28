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
const ROYALTIES = [250, 500, 1000]; // 2.5%, 5%, 10% in basis points.

async function main() {
  const umi = getUmi();
  console.log("Wallet:", umi.identity.publicKey.toString());

  const collectionSigner = generateSigner(umi);
  await createCollection(umi, {
    collection: collectionSigner,
    name: "Manjeet Singh's Master Edition",
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
  console.log("Collection:", explorerAddress(collectionSigner.publicKey.toString()));

  // Fetch the collection account: `create` expects the account data, not only
  // its public key. Asset-level royalties override the collection's 500 bps.
  const collection = await fetchCollection(umi, collectionSigner.publicKey);
  for (let number = 1; number <= 3; number++) {
    const asset = generateSigner(umi);
    const basisPoints = ROYALTIES[number - 1];
    await create(umi, {
      asset,
      collection,
      name: `Manjeet Singh's Print #${number}`,
      uri: URI,
      plugins: [
        { type: "Edition", number },
        {
          type: "Royalties",
          basisPoints,
          creators: [{ address: umi.identity.publicKey, percentage: 100 }],
          ruleSet: ruleSet("None"),
        },
      ],
    }).sendAndConfirm(umi);

    const onChain = await fetchAsset(umi, asset.publicKey);
    if (onChain.royalties?.basisPoints !== basisPoints) {
      throw new Error(`Print #${number}: expected ${basisPoints} bps royalty`);
    }
    console.log(
      `Print #${number} (${basisPoints} bps):`,
      explorerAddress(asset.publicKey.toString()),
    );
  }
}

main();
