use anchor_lang::prelude::*;
// You will need these types for the TODOs below.
#[allow(unused_imports)]
use mpl_core::types::{PermanentFreezeDelegate, Plugin, PluginAuthority, PluginAuthorityPair};
use mpl_core::{instructions::CreateV2CpiBuilder, ID as MPL_CORE_ID};

#[derive(Accounts)]
pub struct MintSoulboundNft<'info> {
    /// Pays for the asset account rent and transaction fees.
    #[account(mut)]
    pub payer: Signer<'info>,

    /// The new Core asset. A fresh keypair that must co-sign; the account is
    /// created and initialized by the MPL Core program via CPI.
    #[account(mut)]
    pub asset: Signer<'info>,

    /// CHECK: The wallet the soul-bound NFT will belong to forever. Any
    /// account is acceptable; MPL Core only stores its address as the owner.
    pub owner: UncheckedAccount<'info>,

    /// CHECK: Verified against the canonical MPL Core program ID.
    #[account(address = MPL_CORE_ID)]
    pub mpl_core_program: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

/// Mints a soul-bound (non-transferable) NFT as a Metaplex Core asset.
///
/// YOUR TASK: make the asset soul-bound by attaching the right plugin at
/// creation time (see the TODOs below). `anchor test` checks your result.
/// Reference solution: `solution/mint_soulbound_nft.rs` (spoilers).
pub fn handler(ctx: Context<MintSoulboundNft>, name: String, uri: String) -> Result<()> {
    let mpl_core_program = ctx.accounts.mpl_core_program.to_account_info();
    let asset = ctx.accounts.asset.to_account_info();
    let payer = ctx.accounts.payer.to_account_info();
    let owner = ctx.accounts.owner.to_account_info();
    let system_program = ctx.accounts.system_program.to_account_info();

    CreateV2CpiBuilder::new(&mpl_core_program)
        .asset(&asset)
        .payer(&payer)
        // The recipient wallet the NFT is permanently bound to.
        .owner(Some(&owner))
        .system_program(&system_program)
        .name(name)
        .uri(uri)
        // ── YOUR CODE STARTS HERE ────────────────────────────────────────
        //
        // TODO 1: Add ONE `PluginAuthorityPair` to this vec whose `plugin` is
        //         the `PermanentFreezeDelegate` plugin, created already frozen.
        //         (Hint: `Plugin::PermanentFreezeDelegate(...)`)
        //
        // TODO 2: Set its `authority` so that NOBODY can ever update the
        //         plugin, i.e. the asset can never be thawed.
        //         (Hint: which `PluginAuthority` variant is "no one"?)
        //
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::PermanentFreezeDelegate(
                PermanentFreezeDelegate {
                    frozen: true,
                },
            ),
            authority: Some(PluginAuthority::None),
        }])
        // ── YOUR CODE ENDS HERE ──────────────────────────────────────────
        .invoke()?;

    msg!(
        "Soul-bound Core asset {} minted to {}",
        ctx.accounts.asset.key(),
        ctx.accounts.owner.key()
    );

    Ok(())
}
