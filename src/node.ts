export class Node {
    id: string; // Unique identifier for the node
    vector: number[];
    neighbors: [Node, number][] = []; // Tuple of node and distance
    maxEdges: number;
    layer: number;
  
    constructor(id: string, vector: number[], maxEdges: number, layer: number) {
      this.id = id;
      this.vector = vector;
      this.maxEdges = maxEdges;
      this.layer = layer;
    }
  
    addNeighbor(node: Node, distance: number): void {
      if (this.id === node.id) {
        return; // Skip adding self as neighbor
      }
      this.neighbors.push([node, distance]);
      this.neighbors.sort((a, b) => a[1] - b[1]); // Sort by distance
      if (this.neighbors.length > this.maxEdges) {
        this.neighbors.pop(); // Enforce maxEdges limit
      }
    }
  
    removeNeighbor(target: Node): void {
      this.neighbors = this.neighbors.filter(([node]) => node !== target);
    }
  
    clearNeighbors(): void {
      this.neighbors.forEach(([node]) => {
        node.removeNeighbor(this);
      });
      this.neighbors = [];
    }
  }
  