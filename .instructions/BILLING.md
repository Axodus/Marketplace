# Marketplace Billing

# Purpose

Billing coordinates:
- settlements
- subscriptions
- ACS accounting
- operational payments
- treasury integration

---

# Billing Principles

- deterministic accounting
- transparent settlements
- operational telemetry
- treasury accountability

---

# Billing Categories

- subscriptions
- ACS services
- educational products
- enterprise operations
- DAO operational services

---

# Treasury Integration

Billing systems remain treasury-aware and governance-constrained.

---

# Constraints

- no opaque accounting
- no hidden settlements
- no unauthorized treasury routing

---

# Phase 10 Enterprise Billing Preview

Enterprise Billing Preview is implemented as deterministic mock visibility only.

Enterprise billing previews may show:
- currency
- recurring amount mock
- setup amount mock
- usage estimate mock
- treasury destination preview label
- accounting notes
- invoice preview status
- reconciliation status
- settlement warnings

Enterprise billing previews must not execute:
- payment
- invoice
- accounting entry
- tax
- settlement
- treasury routing
- billing provider calls
- wallet signatures
- contract writes

All Phase 10 enterprise billing records keep `canExecutePayment=false`, `canRouteTreasury=false`, `canInvoice=false`, `canAccount=false` and `canSettle=false`.
