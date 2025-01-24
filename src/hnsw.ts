import { Layer } from './layer';

export class HNSW {
  layers: Layer[] = [];
  maxLayers: number;
  maxEdges: number;

  constructor(maxLayers: number, maxEdges: number) {
    this.maxLayers = maxLayers;
    this.maxEdges = maxEdges;

    // Initialize layers with nodes that decrease as the layers increase
    let nodesInLayer = Math.pow(2, maxLayers - 1); // Start with a larger number of nodes for the bottom layer
    for (let i = 0; i < maxLayers; i++) {
      this.layers.push(new Layer(this.maxEdges, i)); // Add layer with maxEdges to control neighbors per node
      nodesInLayer = Math.max(1, Math.floor(nodesInLayer / 2)); // Halve nodes in each layer
    }
  }

  // Add a node to the HNSW, starting from the top layer
  add(id: string, vector: number[]): void {
    // Validate that the vector contains only numbers between 0 and 1 inclusive
    const isValidVector = vector.every((value) => 
      typeof value === "number" && value >= 0 && value <= 1 && Number.isFinite(value)
    );
  
    if (!isValidVector) {
      throw new Error(
        `Invalid vector: All values must be floating-point numbers between 0 and 1 inclusive. Received: ${JSON.stringify(vector)}`
      );
    }
  
    let level = 0;
  
    // Randomly assign the level of the new node based on geometric distribution
    while (Math.random() < 0.5 && level < this.maxLayers - 1) {
      level++;
    }
  
    // Add the node to the layers, from level 0 to the calculated level
    for (let currentLayer = 0; currentLayer <= level; currentLayer++) {
      const layer = this.layers[currentLayer];
      layer.addNode(vector, id, currentLayer); // Add node with id to the layer
    }
  }
  
  
  // Add multiple nodes in bulk using tuples (vector, id)
  addBulk(bulkData: [string, number[]][]): void {
    // Process each tuple in the bulk data
    for (const [id, vector] of bulkData) {
      this.add(id, vector); // Use the existing `add` method to insert each node
    }
  }

  // Remove the node from all layers by its ID
  remove(nodeId: string): void {
    // Remove the node from all layers
    for (let layer of this.layers) {
      layer.removeNode(nodeId); // Remove node by ID from the layer
    }
  }

  // HNSW query function that uses searchLayer for each layer
  query(queryVector: number[], nClosest: number = 1): string[] {
    let currentNodeId: string | null = null;
  
    // Start from the topmost layer and work down to the bottom layer
    for (let level = this.maxLayers - 1; level > 0; level--) {
      // Perform a search on the current layer using the currentNodeId
      const closestNodeIds = this.layers[level].searchLayer(currentNodeId, queryVector, 1);
      
      // Set the currentNodeId to be the closest node ID from the search result
      currentNodeId = closestNodeIds[0];  // Only take the first closest node
    }
  
    // Final query at layer 0 - return the top n closest nodes
    const closestNodeIds = this.layers[0].searchLayer(currentNodeId, queryVector, nClosest);
    return closestNodeIds;
  }
  

}
