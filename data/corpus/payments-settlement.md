# Payment Settlement

A payment settlement moves funds from a payer account to a payee account across a clearing rail such
as ACH, wire, or a card network. Settlement is recorded as a double-entry posting in the ledger: a
debit to the payer and a credit to the payee. If the rail rejects the transfer after the ledger has
posted, the system must issue a compensating reversal so balances remain correct. Idempotency keys
prevent a retried payment from being posted twice. Settlement finality and reconciliation against the
rail's confirmation file are required before the funds are considered cleared.
