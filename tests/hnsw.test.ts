import { HNSW } from '../src/hnsw';

// Mock the Layer class so we only test HNSW and not Layer methods directly
jest.mock('../src/layer', () => {
  return {
    Layer: jest.fn().mockImplementation(() => {
      return {
        addNode: jest.fn(),
        removeNode: jest.fn(),
      };
    }),
  };
});

describe('HNSW Class', () => {
  let hnsw: HNSW;

  beforeEach(() => {
    // Initialize the HNSW instance with 3 layers and 5 max edges
    hnsw = new HNSW(3, 5);
  });

  test('should initialize with correct layers and edges', () => {
    expect(hnsw.layers.length).toBe(3);  // 3 layers initialized
    expect(hnsw.maxLayers).toBe(3);
    expect(hnsw.maxEdges).toBe(5);
  });

  test('should add a node correctly', () => {
    const mockAddNode = hnsw.layers[0].addNode; // Get mock addNode for the first layer

    const nodeId = 'node1';
    const vector = [1, 2, 3];

    hnsw.add(nodeId, vector); // Call the add method of HNSW

    // Ensure that addNode is called once on the first layer
    expect(mockAddNode).toHaveBeenCalledTimes(1);
    expect(mockAddNode).toHaveBeenCalledWith(vector, nodeId);
  });

  test('should add nodes in bulk', () => {
    const mockAddNode = hnsw.layers[0].addNode; // Get mock addNode for the first layer

    const bulkData: [string, number[]][] = [
      ['node1', [1, 2, 3]],
      ['node2', [4, 5, 6]],
      ['node3', [7, 8, 9]],
    ];

    hnsw.addBulk(bulkData);

    // Ensure addNode is called for each node in the bulk data
    expect(mockAddNode).toHaveBeenCalledTimes(3); 
    expect(mockAddNode).toHaveBeenCalledWith([1, 2, 3], 'node1');
    expect(mockAddNode).toHaveBeenCalledWith([4, 5, 6], 'node2');
    expect(mockAddNode).toHaveBeenCalledWith([7, 8, 9], 'node3');
  });

  test('should remove a node correctly from all layers', () => {
    const mockRemoveNode = hnsw.layers[0].removeNode; // Get mock removeNode for the first layer

    const nodeId = 'nodeToRemove';

    hnsw.remove(nodeId); // Call the remove method of HNSW

    // Ensure removeNode is called on all layers
    hnsw.layers.forEach(layer => {
      expect(layer.removeNode).toHaveBeenCalledTimes(1); // Called once per layer
      expect(layer.removeNode).toHaveBeenCalledWith(nodeId);
    });
  });

  test('should handle edge case when node does not exist', () => {
    // Assume that the removeNode method is already mocked for layers
    const mockRemoveNode = jest.fn(); // Mocking the method
  
    // Mock the removeNode method for each layer
    hnsw.layers.forEach(layer => {
      layer.removeNode = mockRemoveNode;
    });
  
    // Simulate a non-existing node scenario
    hnsw.remove('non-existing-node');
  
    // Ensure removeNode was called for each layer (since it's always called in the remove method)
    hnsw.layers.forEach(layer => {
      // Check that removeNode was called for each layer
      expect(layer.removeNode).toHaveBeenCalledTimes(1);
      // Ensure removeNode was called with the correct nodeId
      expect(layer.removeNode).toHaveBeenCalledWith('non-existing-node');
    });
  });
  

});
