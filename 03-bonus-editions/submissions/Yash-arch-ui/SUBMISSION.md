# Bonus Challenge Submission

- Name / GitHub handle: Yash-arch-ui
- Collection (MasterEdition): https://explorer.solana.com/address/Cm9PEJ5TM2yygxrB5STJ942S5aavmuaNyMVykmnKZH6x?cluster=devnet
- Edition #1 (royalty 2.5%): https://explorer.solana.com/address/Dyxv25dDA1zMkX1DKEsNkPHJ1hNeqb2AZ2rozQ3VvXAa?cluster=devnet
- Edition #2 (royalty 5%): https://explorer.solana.com/address/BYmfg2xEtsJfWw8JvFcL7UJY6bK5f9kE12RtJ33DcSRt?cluster=devnet
- Edition #3 (royalty 10%): https://explorer.solana.com/address/DYerrnB28rzBFr1tYDMjCeQPup5qKL7vhiKr6wekV6L1?cluster=devnet

Which royalty applies to Edition #2, and why?

> 5% (500 basis points). Asset-level Royalties plugins override the collection-level one, and each print is created with its own value from `ROYALTIES = [250, 500, 1000]` — Edition #2 uses index 1 → 500 bp = 5%.
