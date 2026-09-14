// ============================================================================
// Query: Compute Disruption Blast Radius from Tier-3 Outage
// Finds all downstream products and companies impacted by an incident at a supplier node
// ============================================================================

MATCH (disrupted:Supplier {id: $targetSupplierId})<-[:DEPENDS_ON*1..4]-(impactedProduct:Product)<-[:PRODUCES]-(comp:Company)
RETURN 
    disrupted.name AS DisruptedSupplier,
    disrupted.tier AS SupplierTier,
    impactedProduct.id AS ImpactedProductId,
    impactedProduct.name AS ProductName,
    impactedProduct.unitMargin AS UnitRevenueAtRisk,
    comp.name AS AffectedCorporation;
