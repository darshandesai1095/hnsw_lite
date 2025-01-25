import { Layer } from './layer';
import { Node } from './node';
import { calculateEuclideanDistance } from './utils/calculateEuclideanDistance';
import { calculateCosineSimilarity } from './utils/calculateCosineSimilarity';


export class HNSW {
  layers: Layer[] = [];
  maxLayers: number;
  maxEdges: number;
  distanceFunction: Function;

  constructor(
    maxLayers: number,
    maxEdges: number,
    distanceFunction: string | Function = 'euclideanDistance'
  ) {
    this.maxLayers = maxLayers;
    this.maxEdges = maxEdges;

    // Determine the distance function to use
    if (typeof distanceFunction === 'string') {
      if (distanceFunction === 'euclideanDistance') {
        this.distanceFunction = calculateEuclideanDistance;
      } else if (distanceFunction === 'cosineSimilarity') {
        this.distanceFunction = calculateCosineSimilarity;
      } else {
        throw new Error(
          `Invalid distance function name: ${distanceFunction}. Valid options are 'euclideanDistance' or 'cosineSimilarity'.`
        );
      }
    } else if (typeof distanceFunction === 'function') {
      this.distanceFunction = distanceFunction;
    } else {
      throw new Error(
        `Invalid distanceFunction type: expected a string or function, but received ${typeof distanceFunction}.`
      );
    }

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
    const isValidVector = vector.every(
      (value) => typeof value === "number" && value >= 0 && value <= 1 && Number.isFinite(value)
    );

    if (!isValidVector) {
      throw new Error(
        `Invalid vector: All values must be floating-point numbers between 0 and 1 inclusive. Received: ${JSON.stringify(vector)}`
      );
    }

    // Check if this is the first vector being added
    if (this.layers[0].nodes.length === 0) {
      // Save the vector length to validate future vectors
      (this as any)._vectorLength = vector.length;
    } else {
      // Ensure the vector length matches the previously added vectors
      const expectedLength = (this as any)._vectorLength;
      if (vector.length !== expectedLength) {
        throw new Error(
          `Vector length mismatch: Expected vectors of length ${expectedLength}, but received a vector of length ${vector.length}.`
        );
      }
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
  
  toJSON(): object {
    // Convert your internal layers and nodes to a plain object or JSON-friendly format
    return {
      layers: this.layers.map(layer => layer.toJSON()),  // Assuming Layer also has a toJSON method
      maxLayers: this.maxLayers,
      maxEdges: this.maxEdges,
      distanceFunction: this.distanceFunction.name
    };
  }

  // Rebuild the HNSW model from a JSON object
  static rebuildFromJSON(json: object): HNSW {
    const { maxLayers, maxEdges, layers, distanceFunction } = json as { maxLayers: number; maxEdges: number; layers: any[], distanceFunction: Function };

    // Use the default distance function (euclideanDistance) during reconstruction.
    const hnsw = new HNSW(maxLayers, maxEdges, distanceFunction); 

    // Rebuild each layer and its nodes
    layers.forEach((layerData, layerIndex) => {
      const layer = hnsw.layers[layerIndex];
      layerData.nodes.forEach((nodeData: any) => {
        const node = new Node(nodeData.id, nodeData.vector, maxEdges, layerIndex);
        layer.nodes.push(node); // Add the node to the layer
        layer.nodeMap.set(node.id, node); // Add the node to the map

        // Rebuild neighbors (not directly set by toJSON)
        nodeData.neighbors.forEach((neighborId: string) => {
          const neighborNode = hnsw.getNodeById(neighborId);
          if (neighborNode) {
            // Recalculate the distance here since we're using node ids
            const distance = hnsw.distanceFunction(node.vector, neighborNode.vector);
            node.addNeighbor(neighborNode, distance); // Add the neighbor with the calculated distance
          }
        });
      });
    });

    return hnsw;
  }


  // Helper function to get a node by its ID
  private getNodeById(id: string): Node | undefined {
    for (let layer of this.layers) {
      const node = layer.nodeMap.get(id);
      if (node) return node;
    }
    return undefined;
  }


}
