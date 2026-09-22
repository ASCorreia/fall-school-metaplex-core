use anchor_lang::prelude::*;

use mpl_core::{
    instructions::CreateV2CpiBuilder,
    types::{
        PermanentFreezeDelegate,
        Plugin,
        PluginAuthority,
        PluginAuthorityPair,
    },
    ID as MPL_CORE_ID,
};

/// Accounts required to create a soulbound Metaplex Core asset.
#[derive(Accounts)]
pub struct MintSoulboundNft<'info> {
    /// Pays the rent and transaction costs for creating the asset.
    #[account(mut)]
    pub payer: Signer<'info>,

    /// The new Core asset account.
    ///
    /// Every Core asset has its own address, so the client supplies a
    /// newly generated keypair that signs the transaction.
    #[account(mut)]
    pub asset: Signer<'info>,

    /// The wallet that will permanently own the soulbound NFT.
    ///
    /// CHECK: MPL Core only records this account's address as the owner.
    /// It does not need to read or modify the account.
    pub owner: UncheckedAccount<'info>,

    /// The official Metaplex Core program.
    ///
    /// CHECK: The address constraint ensures the caller cannot substitute
    /// a fake program.
    #[account(address = MPL_CORE_ID)]
    pub mpl_core_program: UncheckedAccount<'info>,

    /// Used by MPL Core when it creates the new asset account.
    pub system_program: Program<'info, System>,
}

/// Creates a permanently non-transferable Metaplex Core NFT.
///
/// Our Anchor program makes a cross-program invocation into MPL Core's
/// `CreateV2` instruction. The PermanentFreezeDelegate plugin is attached
/// during creation because permanent plugins cannot be added afterward.
pub fn handler(
    ctx: Context<MintSoulboundNft>,
    name: String,
    uri: String,
) -> Result<()> {
    // Convert the Anchor accounts into AccountInfo values that the
    // generated MPL Core CPI builder expects.
    let mpl_core_program =
        ctx.accounts.mpl_core_program.to_account_info();
    let asset = ctx.accounts.asset.to_account_info();
    let payer = ctx.accounts.payer.to_account_info();
    let owner = ctx.accounts.owner.to_account_info();
    let system_program =
        ctx.accounts.system_program.to_account_info();

    CreateV2CpiBuilder::new(&mpl_core_program)
        // Fresh signer representing the new Core asset.
        .asset(&asset)
        // Wallet paying to create the asset.
        .payer(&payer)
        // Wallet that receives and permanently owns the NFT.
        .owner(Some(&owner))
        // Required when MPL Core creates the asset account.
        .system_program(&system_program)
        // On-chain asset information supplied by the client.
        .name(name)
        .uri(uri)
        // Attach one permanent freeze plugin during asset creation.
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::PermanentFreezeDelegate(
                PermanentFreezeDelegate {
                    // The asset begins frozen, preventing transfers.
                    frozen: true,
                },
            ),
            // Nobody controls this plugin. Because no authority exists,
            // nobody can thaw or update the asset later.
            authority: Some(PluginAuthority::None),
        }])
        // Invoke the official MPL Core program through CPI.
        .invoke()?;

    msg!(
        "Soul-bound Core asset {} minted to {}",
        ctx.accounts.asset.key(),
        ctx.accounts.owner.key()
    );

    Ok(())
}