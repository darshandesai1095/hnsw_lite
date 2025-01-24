import { Node } from '../src/node';

describe('Node class', () => {
  let node1: Node;
  let node2: Node;
  let node3: Node;

  beforeEach(() => {
    node1 = new Node('1', [1, 2, 3], 2);
    node2 = new Node('2', [4, 5, 6], 2);
    node3 = new Node('3', [7, 8, 9], 2);
  });

  test('should add a neighbor correctly', () => {
    node1.addNeighbor(node2, 1);
    expect(node1.neighbors).toHaveLength(1);
    expect(node1.neighbors[0][0]).toBe(node2);
    expect(node1.neighbors[0][1]).toBe(1);
  });

  test('should enforce maxEdges limit', () => {
    node1.addNeighbor(node2, 1);
    node1.addNeighbor(node3, 0.5);
    expect(node1.neighbors).toHaveLength(2);
  });

  test('should remove a neighbor correctly', () => {
    node1.addNeighbor(node2, 1);
    node1.removeNeighbor(node2);
    expect(node1.neighbors).toHaveLength(0);
  });

  test('should clear all neighbors', () => {
    node1.addNeighbor(node2, 1);
    node1.addNeighbor(node3, 0.5);
    node1.clearNeighbors();
    expect(node1.neighbors).toHaveLength(0);
  });
});
