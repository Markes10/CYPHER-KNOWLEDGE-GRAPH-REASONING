/**
 * Cypher In-Memory Graph Reasoning Runner
 * Executes graph traversal to evaluate multi-tier supply chain blast radii
 */

class GraphNode {
  constructor(id, label, props) {
    this.id = id;
    this.label = label;
    this.props = props;
    this.outgoing = []; // { relType, targetNode, props }
    this.incoming = []; // { relType, sourceNode, props }
  }
}

class InMemCypherGraph {
  constructor() {
    this.nodes = new Map();
  }

  addNode(id, label, props) {
    const node = new GraphNode(id, label, props);
    this.nodes.set(id, node);
    return node;
  }

  addRel(fromId, toId, relType, props = {}) {
    const from = this.nodes.get(fromId);
    const to = this.nodes.get(toId);
    if (!from || !to) throw new Error(`Node not found: ${fromId} or ${toId}`);

    from.outgoing.push({ relType, target: to, props });
    to.incoming.push({ relType, source: from, props });
  }

  // Evaluates MATCH (s:Supplier {id: $id})<-[:DEPENDS_ON*1..4]-(p:Product)<-[:PRODUCES]-(c:Company)
  evaluateBlastRadius(supplierId) {
    const rootSupplier = this.nodes.get(supplierId);
    if (!rootSupplier) return [];

    const results = [];
    const visited = new Set();

    // Traverse incoming dependency edges
    const queue = [{ node: rootSupplier, depth: 0, path: [rootSupplier.props.name] }];

    while (queue.length > 0) {
      const { node, depth, path } = queue.shift();
      visited.add(node.id);

      for (const edge of node.incoming) {
        if (edge.relType === 'DEPENDS_ON' && depth < 4) {
          queue.push({
            node: edge.source,
            depth: depth + 1,
            path: [...path, edge.source.props.name]
          });
        } else if (edge.relType === 'PRODUCES' && node.label === 'Product') {
          // Found company owning the impacted product
          results.push({
            disruptedSupplier: rootSupplier.props.name,
            supplierTier: rootSupplier.props.tier,
            impactedProduct: node.props.name,
            unitMarginAtRisk: node.props.unitMargin,
            affectedCompany: edge.source.props.name,
            dependencyPath: path.join(' <-- ')
          });
        }
      }
    }

    return results;
  }
}

function run() {
  console.log("=== Enterprise Knowledge Graph Reasoning Platform (Cypher / Neo4j) ===");
  const graph = new InMemCypherGraph();

  // Populate Enterprise Graph
  graph.addNode('CORP-AERO-01', 'Company', { name: 'Global Aerospace Systems', annualRevenue: 12000000000 });
  graph.addNode('PROD-JET-ENGINE-X', 'Product', { name: 'Hypersonic Turbofan Engine', unitMargin: 4500000 });
  graph.addNode('PROD-AVIONICS-NAV', 'Product', { name: 'Fly-by-Wire Navigational Array', unitMargin: 850000 });

  graph.addNode('SUPP-TITANIUM-01', 'Supplier', { name: 'Alpine Precision Metals', tier: 1 });
  graph.addNode('SUPP-WAFER-FAB-02', 'Supplier', { name: 'Pacific Silicon Foundry', tier: 2 });
  graph.addNode('SUPP-NEON-GAS-03', 'Supplier', { name: 'Black Sea Chemical Refineries', tier: 3 });

  // Relationships
  graph.addRel('CORP-AERO-01', 'PROD-JET-ENGINE-X', 'PRODUCES');
  graph.addRel('CORP-AERO-01', 'PROD-AVIONICS-NAV', 'PRODUCES');

  graph.addRel('PROD-JET-ENGINE-X', 'SUPP-TITANIUM-01', 'DEPENDS_ON', { criticality: 0.95 });
  graph.addRel('PROD-AVIONICS-NAV', 'SUPP-WAFER-FAB-02', 'DEPENDS_ON', { criticality: 0.99 });
  graph.addRel('SUPP-WAFER-FAB-02', 'SUPP-NEON-GAS-03', 'DEPENDS_ON', { criticality: 0.85 });

  console.log("[GRAPH ONTOLOGY] Seeded Enterprise Knowledge Graph (6 Nodes, 5 Directed Edges).");
  console.log("\n[CYPHER QUERY] Executing Blast Radius Analysis on Tier-3 Supplier 'SUPP-NEON-GAS-03'...");

  const blastRadius = graph.evaluateBlastRadius('SUPP-NEON-GAS-03');

  console.log(`[RESULTS] Found ${blastRadius.length} Cascade Failure Pathways:`);
  blastRadius.forEach((r, idx) => {
    console.log(`\n  Cascade Path #${idx + 1}:`);
    console.log(`    Disrupted Origin: ${r.disruptedSupplier} (Tier ${r.supplierTier})`);
    console.log(`    Impacted Product: ${r.impactedProduct} (Unit Margin Risk: $${r.unitMarginAtRisk.toLocaleString()})`);
    console.log(`    Affected Parent : ${r.affectedCompany}`);
    console.log(`    Graph Traversal : ${r.dependencyPath}`);
  });

  if (blastRadius.length === 0) {
    throw new Error("Expected Tier-3 neon disruption to propagate to Fly-by-Wire Nav Array");
  }

  console.log("\n[SUCCESS] Cypher Knowledge Graph Reasoning Platform verified.\n");
}

if (require.main === module) {
  run();
}

module.exports = { InMemCypherGraph, run };
