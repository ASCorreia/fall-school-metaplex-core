import * as anchor from "@anchor-lang/core";
import { Program } from "@anchor-lang/core";
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { assert } from "chai";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { keypairIdentity, publicKey } from "@metaplex-foundation/umi";
import { fetchAsset, transferV1 } from "@metaplex-foundation/mpl-core";
import { SoulboundNft } from "../target/types/soulbound_nft";

const MPL_CORE_PROGRAM_ID = new PublicKey(
  "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
);

const NAME = "Turbin3 Summer School Diploma";
const URI = "https://arweave.net/diploma.json";

describe("soulbound-nft", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SoulboundNft as Program<SoulboundNft>;

  // Fresh keypair for the new Core asset (must co-sign creation).
  const asset = Keypair.generate();
  // The wallet the NFT gets permanently bound to.
  const holder = Keypair.generate();

  const umi = () => createUmi(provider.connection.rpcEndpoint);

  it("mints a soul-bound Core NFT", async () => {
    await program.methods
      .mintSoulboundNft(NAME, URI)
      .accountsPartial({
        payer: provider.wallet.publicKey,
        asset: asset.publicKey,
        owner: holder.publicKey,
        mplCoreProgram: MPL_CORE_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([asset])
      .rpc();

    // The asset account exists and is owned by the MPL Core program.
    const info = await provider.connection.getAccountInfo(asset.publicKey);
    assert.isNotNull(info, "asset account should exist");
    assert.isTrue(
      info!.owner.equals(MPL_CORE_PROGRAM_ID),
      "asset should be owned by MPL Core"
    );

    // The PermanentFreezeDelegate plugin is present and frozen.
    const coreAsset = await fetchAsset(
      umi(),
      publicKey(asset.publicKey.toBase58())
    );
    assert.equal(coreAsset.name, NAME);
    assert.equal(coreAsset.uri, URI);
    assert.equal(coreAsset.owner, publicKey(holder.publicKey.toBase58()));
    assert.isTrue(
      coreAsset.permanentFreezeDelegate?.frozen === true,
      "asset should be permanently frozen (soul-bound)"
    );
  });

  it("cannot be transferred by its owner (soul-bound)", async () => {
    // Fund the holder so it can pay the transfer fee.
    const sig = await provider.connection.requestAirdrop(
      holder.publicKey,
      LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(sig);

    const u = umi().use(
      keypairIdentity(
        umi().eddsa.createKeypairFromSecretKey(holder.secretKey)
      )
    );

    const destination = Keypair.generate();

    try {
      await transferV1(u, {
        asset: publicKey(asset.publicKey.toBase58()),
        newOwner: publicKey(destination.publicKey.toBase58()),
      }).sendAndConfirm(u);
      assert.fail("transfer should have failed for a soul-bound asset");
    } catch (err: any) {
      assert.notEqual(
        err.message,
        "transfer should have failed for a soul-bound asset",
        "MPL Core should reject the transfer of a frozen asset"
      );
    }
  });
});
