#![allow(unexpected_cfgs)]

use anchor_lang::prelude::*;

pub mod instructions;
pub use instructions::*;

declare_id!("GQLA7M7B7dqLadJyWNJUnUt8PDWqK8xzMQTKf3H3JvjS");

#[program]
pub mod soulbound_nft {
    use super::*;

    pub fn mint_soulbound_nft(
        ctx: Context<MintSoulboundNft>,
        name: String,
        uri: String,
    ) -> Result<()> {
        instructions::mint_soulbound_nft::handler(ctx, name, uri)
    }
}
