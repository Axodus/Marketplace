export const marketplaceSellers = [
  {
    id: "seller-axodus-core",
    name: "Axodus Nucleus",
    handle: "@axodus-core",
    avatar: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    mockAccount: "0xMockSellerAxodusCore",
    type: "Internal Axodus Nucleus",
    verificationStatus: "internal",
    verificationNote: "Internal mock publisher with governance-aware product stewardship.",
    governanceStanding: "verified",
    reputation: 98,
    registeredDAOs: ["Axodus DAO"],
    productsPublished: 12,
    constitutionalBound: true,
    treasuryLinked: true,
    riskScore: 4,
    description: "Internal marketplace publisher for governance-approved ecosystem capabilities."
  },
  {
    id: "seller-academy-guild",
    name: "Academy Tutor Guild",
    handle: "@academy-tutors",
    avatar: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=600&q=80",
    mockAccount: "0xMockSellerAcademyGuild",
    type: "DAO",
    verificationStatus: "verified",
    verificationNote: "Mock DAO seller reviewed for Academy certification and learning access distribution.",
    governanceStanding: "verified",
    reputation: 91,
    registeredDAOs: ["Academy DAO"],
    productsPublished: 8,
    constitutionalBound: true,
    treasuryLinked: true,
    riskScore: 9,
    description: "Tutor collective distributing certification packs and NFT-gated learning assets."
  },
  {
    id: "seller-mcp-labs",
    name: "MCP Runtime Labs",
    handle: "@mcp-runtime-labs",
    avatar: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
    mockAccount: "0xMockSellerMcpLabs",
    type: "Partner",
    verificationStatus: "pending",
    verificationNote: "Mock partner identity remains pending governance review before broader distribution.",
    governanceStanding: "warning",
    reputation: 76,
    registeredDAOs: ["MCP Working Group"],
    productsPublished: 4,
    constitutionalBound: true,
    treasuryLinked: false,
    riskScore: 28,
    description: "Partner team preparing agent templates and runtime integrations for governance review."
  }
];

export const marketplaceLicenses = [
  {
    id: "license-personal-nft",
    type: "NFT Access License",
    transferable: true,
    revokable: false,
    nftBound: true,
    expiration: null,
    governanceControlled: true,
    permissions: ["view-content", "request-signed-url", "secondary-transfer-preview"],
    ownershipModel: "wallet"
  },
  {
    id: "license-dao-plugin",
    type: "DAO License",
    transferable: false,
    revokable: true,
    nftBound: true,
    expiration: "2027-01-01T00:00:00.000Z",
    governanceControlled: true,
    permissions: ["install-plugin", "dao-seat-access", "audit-log-export"],
    ownershipModel: "dao"
  },
  {
    id: "license-enterprise",
    type: "Enterprise License",
    transferable: false,
    revokable: true,
    nftBound: false,
    expiration: "2026-12-31T00:00:00.000Z",
    governanceControlled: true,
    permissions: ["team-access", "signed-url-preview", "support-routing"],
    ownershipModel: "enterprise-seat"
  }
];

export const marketplaceCollections = [
  {
    id: "collection-governance-access",
    name: "Axodus Governance Access",
    slug: "axodus-governance-access",
    description: "Native mock ERC721 collection for governance dashboards, treasury visibility previews and Axodus access passes.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    chain: "Polygon",
    contractAddress: "mock:collection:governance-access",
    assetType: "ERC721",
    origin: "native",
    validationStatus: "compliant",
    governanceStatus: "compliant",
    sellerId: "seller-axodus-core",
    metrics: {
      volume: 1240,
      floorPrice: 120,
      holders: 86,
      recentActivity: 14
    }
  },
  {
    id: "collection-academy-certifications",
    name: "Academy Certification Packs",
    slug: "academy-certification-packs",
    description: "Native mock ERC1155 collection for Academy certification bundles, PoK-compatible learning credentials and DAO-gated education.",
    image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80",
    chain: "BNB",
    contractAddress: "mock:collection:academy-certifications",
    assetType: "ERC1155",
    origin: "native",
    validationStatus: "under-review",
    governanceStatus: "under-review",
    sellerId: "seller-academy-guild",
    metrics: {
      volume: 920,
      floorPrice: 80,
      holders: 144,
      recentActivity: 22
    }
  },
  {
    id: "collection-strategy-license-passes",
    name: "Strategy License Passes",
    slug: "strategy-license-passes",
    description: "Native mock ERC721 collection for trading strategy access passes, risk-reviewed licenses and auction previews.",
    image: "https://images.unsplash.com/photo-1642790551116-18e150f248e5?auto=format&fit=crop&w=1200&q=80",
    chain: "Arbitrum",
    contractAddress: "mock:collection:strategy-license-passes",
    assetType: "ERC721",
    origin: "native",
    validationStatus: "under-review",
    governanceStatus: "under-review",
    sellerId: "seller-axodus-core",
    metrics: {
      volume: 680,
      floorPrice: 180,
      holders: 41,
      recentActivity: 8
    }
  }
];

export const marketplaceProducts = [
  {
    id: "product-governance-dashboard-nft",
    title: "Governance Dashboard NFT Access",
    slug: "governance-dashboard-nft-access",
    category: "Governance",
    subcategory: "Governance dashboards",
    collectionId: "collection-governance-access",
    sellerId: "seller-axodus-core",
    description:
      "ERC721-gated access pass for governance dashboard modules, treasury visibility previews, and voting analytics.",
    shortDescription: "NFT access pass for governance dashboards and treasury visibility.",
    tags: ["governance", "dashboard", "erc721", "treasury"],
    images: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"],
    media: [],
    version: "0.1.0",
    status: "listed",
    governanceStatus: "compliant",
    constitutionalStanding: "aligned",
    visibility: "public",
    pricing: { amount: 120, currency: "USDC", settlementMode: "mock-only" },
    acceptedCurrencies: ["USDC", "NRS"],
    royaltyModel: { standard: "EIP-2981", bps: 500, recipient: "Axodus Treasury", previewAmount: 6 },
    accessModel: "wallet-gated",
    deliveryType: "Signed URL",
    licenseType: "NFT Access License",
    supportedChains: ["Ethereum", "Polygon", "Arbitrum"],
    nftBound: true,
    governanceRequired: true,
    maturity: "beta",
    createdAt: "2026-05-01T12:00:00.000Z",
    updatedAt: "2026-05-14T15:00:00.000Z",
    tokenStandard: "ERC721",
    contractAddress: "mock:governance-dashboard-access",
    tokenId: "AXD-GOV-001",
    listingType: "fixed",
    bridgeReadiness: {
      layerZeroReady: true,
      sourceChain: "Polygon",
      destinationChains: ["Ethereum", "Arbitrum"],
      notes: "Bridge boundary prepared; no live bridge execution in MVP."
    },
    greenfieldBucket: "mock-greenfield-governance-access",
    signedUrlPreviewAvailable: true,
    metadataAttributes: [
      { traitType: "Access", value: "Governance Dashboard" },
      { traitType: "Token Standard", value: "ERC721" },
      { traitType: "Boundary", value: "Signed URL Preview" }
    ]
  },
  {
    id: "product-academy-cert-bundle",
    title: "Academy Certification ERC1155 Bundle",
    slug: "academy-certification-erc1155-bundle",
    category: "Education",
    subcategory: "Certification packs",
    collectionId: "collection-academy-certifications",
    sellerId: "seller-academy-guild",
    description:
      "ERC1155 certification pack for governance education, Proof of Knowledge compatibility, and gated learning content.",
    shortDescription: "ERC1155 certification pack with Academy and PoK compatibility.",
    tags: ["academy", "certification", "erc1155", "pok"],
    images: ["https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80"],
    media: [],
    version: "0.2.0",
    status: "listed",
    governanceStatus: "under-review",
    constitutionalStanding: "requires-review",
    visibility: "dao-gated",
    pricing: { amount: 80, currency: "USDC", settlementMode: "mock-only" },
    acceptedCurrencies: ["USDC", "NRS"],
    royaltyModel: { standard: "EIP-2981", bps: 700, recipient: "Academy DAO", previewAmount: 5.6 },
    accessModel: "dao-gated",
    deliveryType: "Greenfield",
    licenseType: "Subscription License",
    supportedChains: ["BNB", "Polygon"],
    nftBound: true,
    governanceRequired: true,
    maturity: "beta",
    createdAt: "2026-04-21T10:00:00.000Z",
    updatedAt: "2026-05-12T09:30:00.000Z",
    tokenStandard: "ERC1155",
    contractAddress: "mock:academy-certification-bundle",
    tokenId: "AXD-ACADEMY-1155",
    listingType: "english-auction",
    auction: {
      type: "english-auction",
      status: "active",
      reservePrice: 60,
      highestBid: 92,
      bidCount: 17,
      endsAt: "2026-06-01T18:00:00.000Z"
    },
    bridgeReadiness: {
      layerZeroReady: true,
      sourceChain: "BNB",
      destinationChains: ["Polygon"],
      notes: "LayerZero compatibility tracked as metadata only."
    },
    greenfieldBucket: "mock-greenfield-academy-content",
    signedUrlPreviewAvailable: true,
    metadataAttributes: [
      { traitType: "Access", value: "Academy Certification" },
      { traitType: "Token Standard", value: "ERC1155" },
      { traitType: "Governance", value: "Review Required" }
    ]
  },
  {
    id: "product-mcp-agent-template",
    title: "MCP Agent Template License",
    slug: "mcp-agent-template-license",
    category: "MCPs",
    subcategory: "Agent templates",
    sellerId: "seller-mcp-labs",
    description:
      "Governance-reviewed agent template package with plugin compatibility checks and future DAO installation rights.",
    shortDescription: "MCP agent template license with plugin review status.",
    tags: ["mcp", "agent", "plugin", "runtime"],
    images: ["https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"],
    media: [],
    version: "0.1.0",
    status: "listed",
    governanceStatus: "restricted",
    constitutionalStanding: "requires-review",
    visibility: "private-preview",
    pricing: { amount: 250, currency: "USDC", settlementMode: "mock-only" },
    acceptedCurrencies: ["USDC"],
    royaltyModel: { standard: "Custom Split", bps: 1000, recipient: "MCP Working Group", previewAmount: 25 },
    accessModel: "license-key",
    deliveryType: "MCP Runtime",
    licenseType: "DAO License",
    supportedChains: ["Arbitrum", "Polygon"],
    nftBound: false,
    governanceRequired: true,
    maturity: "alpha",
    createdAt: "2026-05-07T11:00:00.000Z",
    updatedAt: "2026-05-16T20:00:00.000Z",
    tokenStandard: "OffchainLicense",
    listingType: "license-preview",
    bridgeReadiness: {
      layerZeroReady: false,
      sourceChain: "Arbitrum",
      destinationChains: [],
      notes: "Bridge unavailable until plugin audit completes."
    },
    signedUrlPreviewAvailable: false,
    metadataAttributes: [
      { traitType: "Access", value: "MCP Runtime" },
      { traitType: "Token Standard", value: "OffchainLicense" },
      { traitType: "Validation", value: "Restricted Preview" }
    ]
  },
  {
    id: "product-trading-strategy-pass",
    title: "Strategy License Dutch Auction",
    slug: "strategy-license-dutch-auction",
    category: "Trading",
    subcategory: "Strategy licenses",
    collectionId: "collection-strategy-license-passes",
    sellerId: "seller-axodus-core",
    description:
      "Mock dutch auction for a strategy license NFT, with risk-aware listing metadata and no live trading execution.",
    shortDescription: "Dutch auction preview for a risk-reviewed strategy license NFT.",
    tags: ["trading", "strategy", "auction", "erc721"],
    images: ["https://images.unsplash.com/photo-1642790551116-18e150f248e5?auto=format&fit=crop&w=1200&q=80"],
    media: [],
    version: "0.1.0",
    status: "listed",
    governanceStatus: "under-review",
    constitutionalStanding: "requires-review",
    visibility: "public",
    pricing: { amount: 300, currency: "USDC", settlementMode: "mock-only" },
    acceptedCurrencies: ["USDC"],
    royaltyModel: { standard: "EIP-2981", bps: 400, recipient: "Axodus Treasury", previewAmount: 12 },
    accessModel: "wallet-gated",
    deliveryType: "Dashboard Access",
    licenseType: "Personal Use",
    supportedChains: ["Ethereum", "Arbitrum"],
    nftBound: true,
    governanceRequired: true,
    maturity: "alpha",
    createdAt: "2026-05-11T08:00:00.000Z",
    updatedAt: "2026-05-17T13:00:00.000Z",
    tokenStandard: "ERC721",
    contractAddress: "mock:strategy-license-pass",
    tokenId: "AXD-STRAT-007",
    listingType: "dutch-auction",
    auction: {
      type: "dutch-auction",
      status: "active",
      reservePrice: 180,
      highestBid: 220,
      bidCount: 6,
      endsAt: "2026-05-30T18:00:00.000Z"
    },
    bridgeReadiness: {
      layerZeroReady: true,
      sourceChain: "Arbitrum",
      destinationChains: ["Ethereum"],
      notes: "Future cross-chain ownership sync boundary only."
    },
    signedUrlPreviewAvailable: false,
    metadataAttributes: [
      { traitType: "Access", value: "Strategy License" },
      { traitType: "Token Standard", value: "ERC721" },
      { traitType: "Listing", value: "Dutch Auction" }
    ]
  }
];

export const marketplaceAssetRegistry = [
  {
    productId: "product-governance-dashboard-nft",
    currentOwner: "0xMockOwnerGovernance001",
    ownershipHistory: [
      {
        id: "ownership-governance-001",
        timestamp: "2026-05-01T12:05:00.000Z",
        actor: "asset-registry-mock",
        status: "mock-confirmed",
        owner: "0xMockOwnerGovernance001",
        note: "Initial mock owner assigned for governance access pass."
      }
    ],
    transferHistory: [
      {
        id: "transfer-governance-001",
        timestamp: "2026-05-03T14:00:00.000Z",
        actor: "transfer-preview",
        status: "mock-confirmed",
        from: "0xMockTreasuryIssuer",
        to: "0xMockOwnerGovernance001",
        chain: "Polygon",
        note: "Mock transfer preview recorded without contract write."
      }
    ],
    licenseHistory: [
      {
        id: "license-governance-001",
        timestamp: "2026-05-04T09:00:00.000Z",
        actor: "license-preview",
        status: "mock-confirmed",
        licenseType: "NFT Access License",
        holder: "0xMockOwnerGovernance001",
        note: "NFT access license preview attached to mock holder."
      }
    ],
    validation: {
      metadata: "compliant",
      contract: "compliant",
      collection: "compliant",
      origin: "compliant",
      royalty: "compliant",
      notes: ["Native mock asset", "EIP-2981 royalty preview available", "No on-chain validation executed"]
    }
  },
  {
    productId: "product-academy-cert-bundle",
    currentOwner: "0xMockAcademyHolder1155",
    ownershipHistory: [
      {
        id: "ownership-academy-001",
        timestamp: "2026-04-22T10:00:00.000Z",
        actor: "asset-registry-mock",
        status: "mock-confirmed",
        owner: "0xMockAcademyHolder1155",
        note: "Mock ERC1155 holder balance represented as registry ownership."
      }
    ],
    transferHistory: [],
    licenseHistory: [
      {
        id: "license-academy-001",
        timestamp: "2026-04-24T09:00:00.000Z",
        actor: "license-preview",
        status: "mock-pending",
        licenseType: "Subscription License",
        holder: "0xMockAcademyHolder1155",
        note: "Subscription license preview remains pending governance review."
      }
    ],
    validation: {
      metadata: "under-review",
      contract: "under-review",
      collection: "under-review",
      origin: "compliant",
      royalty: "compliant",
      notes: ["Native mock ERC1155 asset", "Academy collection requires governance review", "No indexer or chain read executed"]
    }
  },
  {
    productId: "product-mcp-agent-template",
    currentOwner: "0xMockMcpLicenseHolder",
    ownershipHistory: [],
    transferHistory: [],
    licenseHistory: [
      {
        id: "license-mcp-001",
        timestamp: "2026-05-08T11:00:00.000Z",
        actor: "license-preview",
        status: "mock-blocked",
        licenseType: "DAO License",
        holder: "0xMockMcpLicenseHolder",
        note: "DAO license preview blocked by governance restriction."
      }
    ],
    validation: {
      metadata: "restricted",
      contract: "restricted",
      collection: "restricted",
      origin: "under-review",
      royalty: "under-review",
      notes: ["Offchain license asset", "Plugin audit incomplete", "No license enforcement executed"]
    }
  },
  {
    productId: "product-trading-strategy-pass",
    currentOwner: "0xMockStrategyHolder007",
    ownershipHistory: [
      {
        id: "ownership-strategy-001",
        timestamp: "2026-05-11T08:15:00.000Z",
        actor: "asset-registry-mock",
        status: "mock-confirmed",
        owner: "0xMockStrategyHolder007",
        note: "Mock owner assigned for strategy license pass."
      }
    ],
    transferHistory: [
      {
        id: "transfer-strategy-001",
        timestamp: "2026-05-12T13:30:00.000Z",
        actor: "auction-preview",
        status: "mock-pending",
        from: "0xMockTreasuryIssuer",
        to: "0xMockStrategyHolder007",
        chain: "Arbitrum",
        note: "Dutch auction transfer remains preview-only."
      }
    ],
    licenseHistory: [],
    validation: {
      metadata: "under-review",
      contract: "under-review",
      collection: "under-review",
      origin: "compliant",
      royalty: "compliant",
      notes: ["Native mock ERC721 asset", "Risk-reviewed trading license", "No trading or settlement execution"]
    }
  }
];

export const marketplaceBoundaries = [
  {
    id: "reown",
    label: "Reown AppKit wallet state",
    status: "mocked",
    description: "Wallet connection, account and chain state are mocked for UI readiness."
  },
  {
    id: "contracts",
    label: "MarketplaceContractAdapter",
    status: "ready-boundary",
    description: "Fixed listings, buy-now, auctions and bid methods are interface-ready with mock responses."
  },
  {
    id: "royalties",
    label: "RoyaltyService",
    status: "ready-boundary",
    description: "EIP-2981 royalty previews are calculated from mock listing prices."
  },
  {
    id: "greenfield",
    label: "Greenfield delivery",
    status: "mocked",
    description: "Greenfield buckets and signed URL previews are shown after mock purchase."
  },
  {
    id: "layerzero",
    label: "LayerZero bridge readiness",
    status: "deferred",
    description: "Supported chains and bridge readiness are exposed without bridge execution."
  }
];
