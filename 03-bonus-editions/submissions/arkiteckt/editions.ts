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
  const collectionSigner = generateSigner(umi);

await createCollection(umi, {
  collection: collectionSigner,
  name: "Arkiteckt's Original",
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

const collection = await fetchCollection(umi, collectionSigner.publicKey);
const ROYALTIES = [250, 500, 1000];

for (let i = 1; i <= 3; i++) {
  const asset = generateSigner(umi);
  await create(umi, {
    asset,
    collection,
    name: `Arkiteckt's Print #${i}`,
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
    console.log("Collection:", `https://explorer.solana.com/address/${collectionSigner.publicKey.toString()}?cluster=devnet`);

  console.log(`Print #${i}:`, explorerAddress(asset.publicKey.toString()));
  console.log(`Explorer:`, `https://explorer.solana.com/address/${asset.publicKey.toString()}?cluster=devnet`);
  
}
  
}

main();
