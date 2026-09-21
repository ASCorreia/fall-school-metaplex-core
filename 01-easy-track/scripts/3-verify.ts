/**
 * Step 3: Verify your NFT is really soulbound.
 * Run: npm run verify -- <ASSET_ADDRESS>
 *
 * Checks:
 *  1. The asset exists on devnet
 *  2. It has the PermanentFreezeDelegate plugin, frozen = true
 *  3. The plugin authority is None (can never be thawed)
 *  4. A real transfer attempt is rejected on-chain, specifically by
 *     MPL Core's freeze check (not by a missing balance or an RPC error)
 */
import { generateSigner, publicKey, sol } from "@metaplex-foundation/umi";
import {
  fetchAsset,
  transfer,
  InvalidAuthorityError,
} from "@metaplex-foundation/mpl-core";
import { getUmi, explorerAddress } from "../../shared/umi";

// Enough to pay the fee of the transfer test.
const MIN_BALANCE = sol(0.001);

/**
 * When a PermanentFreezeDelegate plugin rejects a transfer, MPL Core aborts
 * with its `InvalidAuthority` error (custom program error 0x9). Any other
 * failure (no SOL, blockhash expired, RPC timeout...) must NOT count as proof.
 */
function isFrozenRejection(err: unknown): boolean {
  if (err instanceof InvalidAuthorityError) return true;
  const e = err as { name?: string; message?: string; logs?: string[] } | undefined;
  if (e?.name === "InvalidAuthority") return true;
  const text = [e?.message ?? "", ...(e?.logs ?? [])].join("\n");
  return /custom program error: 0x9\b/i.test(text);
}

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
    const balance = await umi.rpc.getBalance(umi.identity.publicKey);
    if (balance.basisPoints < MIN_BALANCE.basisPoints) {
      check(
        false,
        "Transfer test needs at least 0.001 devnet SOL in your wallet to pay the fee. " +
          "Fund it (npm run setup or https://faucet.solana.com) and re-run verify."
      );
    } else {
      const randomWallet = generateSigner(umi);
      try {
        await transfer(umi, {
          asset,
          newOwner: randomWallet.publicKey,
        }).sendAndConfirm(umi);
        check(false, "Transfer attempt was rejected on-chain (it SUCCEEDED: not soulbound!)");
      } catch (err) {
        if (isFrozenRejection(err)) {
          check(true, "Transfer attempt was rejected on-chain by MPL Core's freeze check");
        } else {
          check(
            false,
            "Transfer failed, but NOT because of the freeze (so this proves nothing). " +
              "Error: " + (err instanceof Error ? err.message : String(err))
          );
        }
      }
    }
  } else {
    console.log("SKIP  Transfer test (your wallet is not the owner)");
  }

  console.log(pass ? "\nAll checks passed! Submit this link:" : "\nSome checks failed, keep going!");
  console.log(explorerAddress(address));
  if (!pass) process.exit(1);
}

main();
