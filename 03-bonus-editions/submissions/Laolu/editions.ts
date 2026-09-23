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
  fetchAssetV1,
  fetchCollection,
  ruleSet,
} from "@metaplex-foundation/mpl-core";
import { getUmi, explorerAddress } from "../../../shared/umi";

const URI = "https://gist.githubusercontent.com/Laolu02/03d624006deefaa245c53fef1e85d799/raw/82d41a2b18d8479e7a9d998d5d158e8f49f79483/gistfile1.txt"; // your metadata JSON

async function main() {
  const umi = getUmi();
  console.log("Wallet:", umi.identity.publicKey.toString());


  // ── YOUR CODE STARTS HERE ────────────────────────────────────────────
  //
  // TODO 1: createCollection(umi, { ... }) with the MasterEdition plugin
  //         (maxSupply: 3) and a Royalties plugin (e.g. basisPoints: 500).
  const collectionSigner = generateSigner(umi);
  await createCollection (umi,{
    collection: collectionSigner,
    name: "Laolu Print Collection",
    uri: URI,
    plugins: [
      {type: "MasterEdition", maxSupply:3},
      {
        type: "Royalties", basisPoints:500,
        creators: [{
          address: umi.identity.publicKey,percentage: 100
        },],
        ruleSet:ruleSet("None")
      },
    ],
  }).sendAndConfirm(umi);
  console.log("\nMaster Edition collection:", collectionSigner.publicKey.toString());
  console.log(explorerAddress(collectionSigner.publicKey.toString()));
  //
  // TODO 2: fetchCollection(...), then in a loop create 3 assets with:
  //         - the Edition plugin (number: 1, 2, 3)
  //         - a Royalties plugin with a DIFFERENT basisPoints each
  //
  let collection;

    for (let attempt = 1; attempt <= 10; attempt++) {
      try {
        collection = await fetchCollection(
          umi,
          collectionSigner.publicKey,
        );
        break;
      } catch (error) {
        if (attempt === 10) {
          throw error;
        }

        console.log(
          `Collection not visible yet. Retry ${attempt}/10 in 2 seconds...`,
        );

        await new Promise((resolve) => setTimeout(resolve, 2_000));
      }
    }

    if (!collection) {
      throw new Error("Failed to fetch collection after retries");
    }

  const ROYALTIES = [250,500,1000];

  for(let i = 1; i <= 3; i++ ){
    const asset = generateSigner(umi);
    await create(umi, {
      asset,
      collection,
      name: "Laolu Print #${i}",
      uri: URI,
      plugins: [
        {type: "Edition", number: i,},
        {type: "Royalties", basisPoints: ROYALTIES [i -1],
          creators: [{address: umi.identity.publicKey, percentage: 100},],
          ruleSet: ruleSet("None"),
        },
      ]
    }).sendAndConfirm(umi);

    let onChain;

    for (let attempt = 1; attempt <= 10; attempt++) {
      try {
        onChain = await fetchAssetV1(
          umi,
          asset.publicKey,
        );
        break;
      } catch (error) {
        if (attempt === 10) {
          throw error;
        }

        console.log(
          `Print #${i} not visible yet. Retry ${attempt}/10 in 2 seconds...`,
        );

        await new Promise((resolve) => setTimeout(resolve, 2_000));
      }
    }

if (!onChain) {
  throw new Error(`Failed to fetch Print #${i} after retries`);
}

    console.log(`Print #${i}:`);
    console.log( `https://explorer.solana.com/address/${asset.publicKey}?cluster=devnet`,);
    console.log("edition:", onChain.edition?.number);
    console.log("royalty:", onChain.royalties?.basisPoints);
  }
  // TODO 3: print all 4 explorer links (collection + 3 editions).
  
  // ── YOUR CODE ENDS HERE ──────────────────────────────────────────────
}

main();
