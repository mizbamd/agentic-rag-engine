# Trade and Position Settlement

In asset management, a trade moves through matching, clearing, and settlement before a position is
updated in the book of record. Each trade is an immutable event; the current position is a projection
derived by replaying trade events, which is the same shape as an event-sourced ledger. A trade bust
or correction is handled with a compensating entry rather than deleting history, preserving an
audit-grade reconstruction for regulators. Settlement risk is managed with delivery-versus-payment so
the asset and the cash move atomically.
