import { Node } from './node';
import { calculateEuclideanDistance } from './utils/calculateEuclideanDistance';

export class Layer {
  nodes: Node[] = [];
  nodeMap: Map<string, Node> = new Map(); // Map for faster node lookups by ID
  maxEdges: number;
  layer: number;

  constructor(maxEdges: number, layer: number) {
    this.maxEdges = maxEdges;
    this.layer = layer
  }

  addNode(vector: number[], id: string, layer: number): Node {
    const newNode = new Node(id, vector, this.maxEdges, layer);

    console.log(`Adding node with ID: ${id}, Layer: ${layer}, Vector:`, vector);

    this.nodes.push(newNode);
    this.nodeMap.set(id, newNode); // Add the node to the map using its ID
    this.connectNearestNeighbors(newNode);

    console.log(`Node added with ID: ${id} at Layer: ${layer}`);

    return newNode;
  }

  private connectNearestNeighbors(newNode: Node): void {
    // Calculate distances to all nodes
    const distances = this.nodes.map((node) => {
      return { node, distance: calculateEuclideanDistance(newNode.vector, node.vector) };
    });

    // Sort by distance to find the closest k neighbors
    distances.sort((a, b) => a.distance - b.distance);

    // Get the top k neighbors
    const nearestNeighbors = distances.slice(0, this.maxEdges);

    // Add the new node to the k nearest neighbors
    for (let { node, distance } of nearestNeighbors) {
      newNode.addNeighbor(node, distance); // Add to new node's neighbors
      node.addNeighbor(newNode, distance); // Add to existing node's neighbors
    }
  }


  removeNode(nodeId: string): void {
    // Step 1: Find the node by ID using the nodeMap
    const nodeToRemove = this.nodeMap.get(nodeId);

    if (!nodeToRemove) {
      return;
      throw new Error(`Node with ID ${nodeId} not found.`);
    }

    // Step 2: Disconnect the node from all its neighbors
    for (let neighbor of nodeToRemove.neighbors) {
      const [connectedNode] = neighbor;  // Each neighbor is a tuple [node, distance]
      connectedNode.removeNeighbor(nodeToRemove); // Remove the reference from the neighbor's side
    }

    // Step 3: Remove the node from the graph's node list and the map
    this.nodes = this.nodes.filter(node => node !== nodeToRemove);
    this.nodeMap.delete(nodeId);

    // Step 4: Recalculate the neighbors for the connected nodes to ensure they have the right number of neighbors
    for (let neighbor of nodeToRemove.neighbors) {
      const [connectedNode] = neighbor;
      this.connectNearestNeighbors(connectedNode);
    }
  }

  searchLayer(startNodeId: string | null, queryVector: number[], nClosest: number = 1): string[] {
    let currentNode: Node;

    // If startNodeId is null or invalid, fallback to a random node or the first node
    if (!startNodeId || !this.nodeMap.has(startNodeId)) {
      if (this.nodes.length === 0) throw new Error('Layer has no nodes to search.');
      currentNode = this.nodes[0]; // Fallback to the first node
    } else {
      currentNode = this.nodeMap.get(startNodeId)!;
    }

    const visited = new Set<string>(); // To avoid revisiting nodes

    // Iteratively find the closest neighbors
    let isCloser = true;
    while (isCloser) {
      isCloser = false;
      let closestNeighbor = currentNode;
      let closestDistance = calculateEuclideanDistance(queryVector, currentNode.vector);

      // Loop through neighbors and calculate distance to query vector
      for (let [neighbor, distance] of currentNode.neighbors) {
        if (visited.has(neighbor.id)) continue; // Skip visited nodes

        // Calculate distance from queryVector to neighbor
        const neighborDistance = calculateEuclideanDistance(queryVector, neighbor.vector);

        // If the neighbor is closer, update the current node
        if (neighborDistance < closestDistance) {
          closestNeighbor = neighbor;
          closestDistance = neighborDistance;
          isCloser = true;
        }
      }

      currentNode = closestNeighbor; // Move to the closest neighbor
      visited.add(currentNode.id); // Mark current node as visited
    }

    // If we're at layer 0 and nClosest > 1, return the closest n nodes
    if (this.layer === 0 && nClosest > 1) {
      // console.log('Layer 0', currentNode.id)
      // return currentNode.neighbors.map(node => node[0].id); // Return the IDs of the closest nodes
      const closestNodes = Array.from(currentNode.neighbors)
        .sort((a, b) => a[1] - b[1]) // Sort by distance
        .slice(0, nClosest); // Take top nClosest results

      return closestNodes.map(node => node[0].id); // Return the IDs of the closest nodes
    }

    // For all other cases (non-layer 0), return only the closest node (just one node)
    return [currentNode.id]; // Return the ID of the closest node
  }

}
