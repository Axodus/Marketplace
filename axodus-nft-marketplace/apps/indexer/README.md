# Indexer (Subgraphs + Workers)

## Mission
Provide **near-real-time** (SLO < 2s) indexing for listings, bids, sales and royalty data across ETH/BNB/Arbitrum/Harmony/Polygon.

## Components
- **Subgraphs** (The Graph): declarative indexing per chain/contract.
- **WS Workers**: subscribe to node WS endpoints for critical events (bids, sales, auction close) and push to API (Redis channel) to feed GraphQL subscriptions instantly.

## Structure

```
subgraphs/
	ethereum/   subgraph.yaml, schema.graphql, mappings/
	bnb/
	arbitrum/
	harmony/
	polygon/
workers/
	ws-listener.ts  # reconnect, backoff, dedup
	normalizer.ts   # normalize events to common schema
```

## Environment
`.env-indexer`:

```
GRAPH_NODE=http://localhost:8020
GRAPH_IPFS=http://localhost:5001

RPC_WS_ETHEREUM=wss://...
RPC_WS_BNB=wss://...
RPC_WS_ARBITRUM=wss://...
RPC_WS_HARMONY=wss://ws.s0.t.hmny.io
RPC_WS_POLYGON=wss://...
REDIS_URL=redis://localhost:6379
API_PUSH_URL=http://localhost:4000/internal/events
```

## Guarantees
- **Ordering**: chain block number + log index; dedup by tx hash + idx.
- **Backfill**: from deployment block; resume from checkpoint on restart.
- **Health**: liveness/readiness probes; metrics per chain lag.

## Definition of Done (Indexer)
- Deterministic mappings, no side-effects.
- Reliable WS reconnection with jitter.
- Benchmarks: keep lag < 2 blocks on normal load.
