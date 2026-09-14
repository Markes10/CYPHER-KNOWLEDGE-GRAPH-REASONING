// ============================================================================
// Enterprise Knowledge Graph Schema & Ontology
// Language: Cypher (Neo4j Graph Database)
// ============================================================================

// Constraints
CREATE CONSTRAINT FOR (c:Company) REQUIRE c.id IS UNIQUE;
CREATE CONSTRAINT FOR (s:Supplier) REQUIRE s.id IS UNIQUE;
CREATE CONSTRAINT FOR (p:Product) REQUIRE p.id IS UNIQUE;
CREATE CONSTRAINT FOR (i:Incident) REQUIRE i.id IS UNIQUE;

// Sample Graph Creation
CREATE (c1:Company {id: 'CORP-AERO-01', name: 'Global Aerospace Systems', annualRevenue: 12000000000})
CREATE (p1:Product {id: 'PROD-JET-ENGINE-X', name: 'Hypersonic Turbofan Engine', unitMargin: 4500000})
CREATE (p2:Product {id: 'PROD-AVIONICS-NAV', name: 'Fly-by-Wire Navigational Array', unitMargin: 850000})

CREATE (s1:Supplier {id: 'SUPP-TITANIUM-01', name: 'Alpine Precision Metals', country: 'Austria', tier: 1})
CREATE (s2:Supplier {id: 'SUPP-WAFER-FAB-02', name: 'Pacific Silicon Foundry', country: 'Taiwan', tier: 2})
CREATE (s3:Supplier {id: 'SUPP-NEON-GAS-03', name: 'Black Sea Chemical Refineries', country: 'Ukraine', tier: 3})

// Connect Relationships
CREATE (c1)-[:PRODUCES]->(p1)
CREATE (c1)-[:PRODUCES]->(p2)

CREATE (p1)-[:DEPENDS_ON {criticality: 0.95}]->(s1)
CREATE (p2)-[:DEPENDS_ON {criticality: 0.99}]->(s2)
CREATE (s2)-[:DEPENDS_ON {criticality: 0.85}]->(s3);
