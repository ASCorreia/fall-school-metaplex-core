/**
 * Verify the minted asset is soulbound on devnet.
 * Run: npx tsx submissions/ulukan/verify.ts <ASSET_ADDRESS>
 */
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { publicKey } from "@metaplex-foundation/umi";
import { fetchAsset } from "@metaplex-foundation/mpl-core";

const RPC_URL = process.env.RPC_URL ?? "https://api.devnet.solana.com";

async function main() {
  const address = process.argv[2];
  if (!address) {
    console.error("Usage: npx tsx submissions/ulukan/verify.ts <ASSET_ADDRESS>");
    process.exit(1);
  }

  const umi = createUmi(RPC_URL);
  let pass = true;
  const check = (ok: boolean, label: string) => {
    console.log(`${ok ? "PASS" : "FAIL"}  ${label}`);
    if (!ok) pass = false;
  };

  const asset = await fetchAsset(umi, publicKey(address));
  check(true, `Asset exists: ${asset.name}`);
  console.log("      owner:", asset.owner);
  console.log("      uri:  ", asset.uri);

  const plugin = asset.permanentFreezeDelegate;
  check(plugin !== undefined, "PermanentFreezeDelegate plugin attached");
  check(plugin?.frozen === true, "Asset is frozen");
  check(
    plugin?.authority.type === "None",
    `Plugin authority is None (found: ${plugin?.authority.type})`
  );

  console.log(
    pass
      ? "\nAll checks passed — the asset is permanently soulbound."
      : "\nSome checks failed."
  );
  if (!pass) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
