import type { InvoicePreviewEntity, MarketplaceStore, ProductEntity, TreasuryReconciliationRecord, TreasuryReconciliationSnapshot } from "../dto/contracts.js";

function round(value: number) {
  return Number(value.toFixed(4));
}

function getPricing(product: ProductEntity) {
  const pricing = product.pricing as { amount?: number } | undefined;
  return Number(pricing?.amount ?? 0);
}

function getRoyaltyBps(product: ProductEntity) {
  const royalty = product.royaltyModel as { bps?: number } | undefined;
  return Number(royalty?.bps ?? 0);
}

function findProduct(store: MarketplaceStore, productId: string) {
  return store.products.find((product) => product.id === productId || product.slug === productId);
}

function expectedRoyalty(store: MarketplaceStore, invoice: InvoicePreviewEntity) {
  return round(
    invoice.productReferences.reduce((sum, productId) => {
      const product = findProduct(store, productId);
      if (!product) return sum;
      return sum + (getPricing(product) * getRoyaltyBps(product)) / 10_000;
    }, 0)
  );
}

function buildRecord(store: MarketplaceStore, invoice: InvoicePreviewEntity): TreasuryReconciliationRecord {
  const expectedRoyaltyValue = expectedRoyalty(store, invoice);
  const expectedPlatformFee = round(invoice.subtotal * 0.025);
  const expectedEcosystemFee = round(invoice.subtotal * 0.01);
  const expectedTreasurySplit = round(expectedPlatformFee + expectedEcosystemFee);
  const expectedCreatorSplit = round(invoice.subtotal - expectedRoyaltyValue - expectedPlatformFee - expectedEcosystemFee);
  const expectedTotal = invoice.subtotal;
  const royaltyMismatch = round(Math.abs(expectedRoyaltyValue - invoice.royaltyPreview));
  const treasuryMismatch = round(Math.abs(expectedTreasurySplit - invoice.treasurySplitPreview));
  const totalMismatch = round(
    royaltyMismatch +
      Math.abs(expectedPlatformFee - invoice.platformFeePreview) +
      Math.abs(expectedEcosystemFee - invoice.ecosystemFeePreview) +
      treasuryMismatch +
      Math.abs(expectedCreatorSplit - invoice.creatorSplitPreview) +
      Math.abs(expectedTotal - invoice.totalPreview)
  );
  const reasonCodes: string[] = [];
  if (invoice.state === "draft" || invoice.state === "preview" || invoice.state === "pending") reasonCodes.push("settlement-preview-not-final");
  if (royaltyMismatch > 0) reasonCodes.push("royalty-preview-mismatch");
  if (treasuryMismatch > 0) reasonCodes.push("treasury-split-mismatch");
  if (totalMismatch === 0) reasonCodes.push("accounting-preview-consistent");

  return {
    invoiceId: invoice.id,
    buyer: invoice.buyer,
    currency: invoice.currency,
    expectedRoyalty: expectedRoyaltyValue,
    observedRoyalty: invoice.royaltyPreview,
    expectedPlatformFee,
    observedPlatformFee: invoice.platformFeePreview,
    expectedEcosystemFee,
    observedEcosystemFee: invoice.ecosystemFeePreview,
    expectedTreasurySplit,
    observedTreasurySplit: invoice.treasurySplitPreview,
    expectedCreatorSplit,
    observedCreatorSplit: invoice.creatorSplitPreview,
    expectedTotal,
    observedTotal: invoice.totalPreview,
    status: totalMismatch > 0 ? "mismatch" : invoice.state === "mock_paid" ? "reconciled" : "pending_preview",
    mismatchAmount: totalMismatch,
    reasonCodes
  };
}

export function buildTreasuryReconciliationSnapshot(store: MarketplaceStore): TreasuryReconciliationSnapshot {
  const records = (store.invoices ?? []).map((invoice) => buildRecord(store, invoice));
  return {
    id: `treasury-reconciliation-${crypto.randomUUID()}`,
    records,
    metrics: {
      invoicesChecked: records.length,
      reconciled: records.filter((record) => record.status === "reconciled").length,
      mismatches: records.filter((record) => record.status === "mismatch").length,
      pendingPreviews: records.filter((record) => record.status === "pending_preview").length,
      royaltyMismatchTotal: round(records.reduce((sum, record) => sum + Math.abs(record.expectedRoyalty - record.observedRoyalty), 0)),
      treasuryMismatchTotal: round(records.reduce((sum, record) => sum + Math.abs(record.expectedTreasurySplit - record.observedTreasurySplit), 0)),
      totalMismatchAmount: round(records.reduce((sum, record) => sum + record.mismatchAmount, 0))
    },
    accountingConsistency: {
      telemetryRecords: (store.accountingTelemetry ?? []).length,
      invoiceTelemetryLinked: records.every((record) => (store.accountingTelemetry ?? []).some((telemetry) => telemetry.invoiceId === record.invoiceId)),
      royaltyAccountingReady: true,
      treasuryPreviewReady: true,
      settlementPreviewReady: true
    },
    treasuryExecutionEnabled: false,
    settlementEnabled: false,
    generatedAt: new Date().toISOString()
  };
}
