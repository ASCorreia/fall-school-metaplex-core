/**
 * Step 3: Verify your NFT is really soulbound.
 * Run: npm run verify -- <ASSET_ADDRESS>
 *
 * Checks:
 *  1. The asset exists on devnet
 *  2. It has the PermanentFreezeDelegate plugin, frozen = true
 *  3. The plugin authority is None (can never be thawed)
 *  4. A real transfer attempt is rejected on-chain
 */
import { generateSigner, publicKey } from "@metaplex-foundation/umi";
import { fetchAsset, transfer } from "@metaplex-foundation/mpl-core";
import { getUmi, explorerAddress } from "./umi";

async function main() {
  const address = process.argv[2];
  if (!address) {
    console.error("Usage: npm run verify -- <ASSET_ADDRESS>");
    process.exit(1);
  }

  const umi = getUmi();
  let pass = true;
  const check = (ok: boolean, label: string) => {
    console.log(`${ok ? "PASS" : "FAIL"}  ${label}`);
    if (!ok) pass = false;
  };

  const asset = await fetchAsset(umi, publicKey(address));
  check(true, `Asset exists: ${asset.name}`);

  const plugin = asset.permanentFreezeDelegate;
  check(plugin !== undefined, "PermanentFreezeDelegate plugin attached");
  check(plugin?.frozen === true, "Asset is frozen");
  check(
    plugin?.authority.type === "None",
    `Plugin authority is None (found: ${plugin?.authority.type})`
  );

  if (asset.owner === umi.identity.publicKey) {
    const randomWallet = generateSigner(umi);
    try {
      await transfer(umi, {
        asset,
        newOwner: randomWallet.publicKey,
      }).sendAndConfirm(umi);
      check(false, "Transfer attempt was rejected on-chain");
    } catch {
      check(true, "Transfer attempt was rejected on-chain");
    }
  } else {
    console.log("SKIP  Transfer test (your wallet is not the owner)");
  }

  console.log(pass ? "\nAll checks passed! Submit this link:" : "\nSome checks failed, keep going!");
  console.log(explorerAddress(address));
  if (!pass) process.exit(1);
}

main();
