// ============================================================================
// Enterprise Supply Chain Knowledge Graph Ingestion Seed Script
// Execute in Neo4j Cypher Shell: cypher-shell -u neo4j -p password < seed_graph.cql
// ============================================================================

// 1. Wipe clean
MATCH (n) DETACH DELETE n;

// 2. Create Aerospace OEM and Subsystems
CREATE (oem:Company {id: 'CORP-AERO-01', name: 'Global Aerospace Systems', revenue: 12000000000})
CREATE (eng:Product {id: 'PROD-JET-ENGINE-X', name: 'Hypersonic Turbofan Engine', unitMargin: 4500000})
CREATE (nav:Product {id: 'PROD-AVIONICS-NAV', name: 'Fly-by-Wire Navigational Array', unitMargin: 850000})

// 3. Multi-Tier Suppliers
CREATE (s1:Supplier {id: 'SUPP-TITANIUM-01', name: 'Alpine Precision Metals', country: 'Austria', tier: 1, leadTimeWeeks: 6})
CREATE (s2:Supplier {id: 'SUPP-WAFER-FAB-02', name: 'Pacific Silicon Foundry', country: 'Taiwan', tier: 2, leadTimeWeeks: 18})
CREATE (s3:Supplier {id: 'SUPP-NEON-GAS-03', name: 'Black Sea Chemical Refineries', country: 'Ukraine', tier: 3, leadTimeWeeks: 26})

// 4. Dependencies
CREATE (oem)-[:PRODUCES]->(eng)
CREATE (oem)-[:PRODUCES]->(nav)

CREATE (eng)-[:DEPENDS_ON {criticality: 0.95, singleSource: true}]->(s1)
CREATE (nav)-[:DEPENDS_ON {criticality: 0.99, singleSource: true}]->(s2)
CREATE (s2)-[:DEPENDS_ON {criticality: 0.85, singleSource: true}]->(s3)

// 5. Injected Geopolitical Disruption Incident
CREATE (inc:Incident {
    id: 'INC-2026-GEO-01',
    type: 'PORT_BLOCKADE',
    region: 'Black Sea Maritime Corridor',
    severity: 'CRITICAL',
    disruptionFactor: 0.80
})
CREATE (s3)-[:IMPACTED_BY]->(inc);
