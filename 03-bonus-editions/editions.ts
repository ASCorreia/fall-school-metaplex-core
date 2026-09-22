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

const URI =
  "https://gist.githubusercontent.com/Theophilus2003/6c19f3918a9f2ca3020a486a5a2ece14/raw/3cbe743a6b14a866bbad2a62d3a9ed9795570010/metadata.json";

async function main() {
  const umi = getUmi();
  console.log("Wallet:", umi.identity.publicKey.toString());

  // ── YOUR CODE STARTS HERE ────────────────────────────────────────────

  // TODO 1: the collection - the "original" - with MasterEdition (3 prints
  //         allowed) and a collection-wide default royalty of 5%.
  const collectionSigner = generateSigner(umi);

  await createCollection(umi, {
    collection: collectionSigner,
    name: "web3theo's Print Series",
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

  console.log("Collection address:", collectionSigner.publicKey.toString());
  console.log("Explorer:", explorerAddress(collectionSigner.publicKey.toString()));

  // Devnet's public RPC can lag between "confirmed" and what a fresh read
  // sees; a short pause avoids a spurious AccountNotFoundError here.
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // TODO 2: three numbered prints, each with its own royalty that
  //         overrides the collection's default.
  const collection = await fetchCollection(umi, collectionSigner.publicKey);
  const ROYALTIES = [250, 500, 1000]; // 2.5%, 5%, 10%

  for (let i = 1; i <= 3; i++) {
    const asset = generateSigner(umi);
    await create(umi, {
      asset,
      collection,
      name: `web3theo's Print Series #${i}`,
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

    // TODO 3: print the explorer link for this print.
    console.log(`Print #${i} address:`, asset.publicKey.toString());
    console.log(`Print #${i} explorer:`, explorerAddress(asset.publicKey.toString()));
  }

  // ── YOUR CODE ENDS HERE ──────────────────────────────────────────────
}

main();
