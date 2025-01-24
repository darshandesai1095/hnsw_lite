import { Layer } from '../src/layer';
import { Node } from '../src/node';


describe('Layer class', () => {
  let layer: Layer;
  let node1: Node;
  let node2: Node;

  beforeEach(() => {
    layer = new Layer(2); // Create a layer with maxEdges = 2
    node1 = new Node('1', [1, 2, 3], 2); // Create nodes
    node2 = new Node('2', [4, 5, 6], 2);
  });

  test('should add a node correctly and update nodeMap', () => {
    layer.addNode([1, 2, 3], '1'); // Add node1
    expect(layer.nodes).toHaveLength(1);
    expect(layer.nodeMap.size).toBe(1);
    expect(layer.nodeMap.has('1')).toBe(true); // Check if node1 is in the map
  });

  test('should remove a node correctly and update nodeMap', () => {
    layer.addNode([1, 2, 3], '1');
    layer.addNode([4, 5, 6], '2');

    layer.removeNode('1'); // Remove node1

    expect(layer.nodes).toHaveLength(1);
    expect(layer.nodeMap.size).toBe(1);
    expect(layer.nodeMap.has('1')).toBe(false); // Ensure node1 is removed from map
  });

  test('should not throw error when trying to remove a non-existing node', () => {
    // Before attempting to remove, check the number of nodes in the layer
    const initialLength = layer.nodes.length;
    // Try removing a non-existing node
    layer.removeNode('non-existing-node');
    // Ensure the number of nodes hasn't changed
    expect(layer.nodes.length).toBe(initialLength);
    // Ensure the nodeMap hasn't been affected
    expect(layer.nodeMap.size).toBe(0);
  });

  test('should calculate Euclidean distance correctly', () => {
    const dist = (layer as any).calculateEuclideanDistance([1, 2, 3], [4, 5, 6]); // Access private method
    expect(dist).toBeCloseTo(5.196, 3); // Check the distance between the two vectors
  });
});
