import * as anchor from "@anchor-lang/core";
import { Program } from "@anchor-lang/core";
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { assert } from "chai";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { keypairIdentity, publicKey } from "@metaplex-foundation/umi";
import { fetchAssetV1, transferV1 } from "@metaplex-foundation/mpl-core";
import { SoulboundNft } from "../target/types/soulbound_nft";

const MPL_CORE_PROGRAM_ID = new PublicKey(
  "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d",
);

const NAME = "Solana Fall School Diploma";
const URI = "https://gist.githubusercontent.com/Laolu02/03d624006deefaa245c53fef1e85d799/raw/82d41a2b18d8479e7a9d998d5d158e8f49f79483/gistfile1.txt";

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
      "asset should be owned by MPL Core",
    );

    // The PermanentFreezeDelegate plugin is present and frozen.
    let coreAsset;

      for (let attempt = 1; attempt <= 10; attempt += 1) {
        try {
          coreAsset = await fetchAssetV1(
            umi(),
            publicKey(asset.publicKey.toBase58()),
          );
          break;
        } catch (error) {
          if (attempt === 10) {
            throw error;
          }

          await new Promise((resolve) => setTimeout(resolve, 2_000));
        }
      }

      if (!coreAsset) {
        throw new Error("Failed to fetch Core asset");
      }

    assert.equal(coreAsset.name, NAME);
    assert.equal(coreAsset.uri, URI);
    assert.equal(coreAsset.owner, publicKey(holder.publicKey.toBase58()));
    assert.isTrue(
      coreAsset.permanentFreezeDelegate?.frozen === true,
      "asset should be permanently frozen (soul-bound)",
    );
  });

  it("cannot be transferred by its owner (soul-bound)", async () => {
    // Fund the holder so it can pay the transfer fee.
    const sig = await provider.connection.requestAirdrop(
      holder.publicKey,
      LAMPORTS_PER_SOL,
    );
    await provider.connection.confirmTransaction(sig);

    const u = umi().use(
      keypairIdentity(umi().eddsa.createKeypairFromSecretKey(holder.secretKey)),
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
        "MPL Core should reject the transfer of a frozen asset",
      );
    }
  });
});
