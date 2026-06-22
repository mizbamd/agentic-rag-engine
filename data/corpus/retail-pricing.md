# Retail and Menu Pricing

A pricing platform computes the effective price of an item from a base cost, margin rules, promotions,
and competitive signals. Price changes are governed: a proposed change is evaluated by a rules engine
and may require human approval before it is published to stores or a menu. Publishing a price change
is rolled out progressively (canary) so a pricing error never hits every store at once. Each price
change is recorded as an event, enabling rollback and a full history of who changed what and why.
