# Smart Contracts

## Scope
- ERC721 & ERC1155 (OpenZeppelin)
- Marketplace:
  - Fixed price, English auction, Dutch auction
  - Fees + **EIP-2981 royalties** distribution
  - ReentrancyGuard, pull payments
- LayerZero:
  - OFT / x-chain messaging for bridging/wrapping

## Tooling
- Hardhat + TypeScript
- Foundry (optional) for fuzz/prop tests
- Slither & Mythril (CI checks)

## Layout

```
src/
  tokens/       # ERC721, ERC1155, OFT adapters
  marketplace/  # core, auctions, escrow
  libs/         # royalty, math, access
scripts/        # deploy, verify, simulate auctions
test/           # unit/integration, fuzz
```

## Tests (must pass)
- Fixed sale lifecycle; English/Dutch edge cases (min step, timer).
- Royalty correctness (EIP-2981) across multiple sales.
- Fees split (treasury, creator) – rounding safety.
- LayerZero bridge: lock/mint and burn/unlock invariants.

## Outputs
- `artifacts/` + `abi/` exported for `apps/web` & `apps/api`.
- Deployment manifests per chain (chainId → addresses).

## Security
- Use latest OZ (compatible with target chains).
- No upgradable proxies for marketplace v1 unless audited.
- Two-person review for any parameter change.
