# HNSW-Lite: A Simple Hierarchical Navigable Small World Graph Implementation

## Overview
HNSW-Lite is a lightweight implementation of the Hierarchical Navigable Small World (HNSW) algorithm. This algorithm is commonly used for approximate nearest neighbor (ANN) searches in high-dimensional spaces. It organizes nodes into multiple layers, where higher layers enable faster traversal and lower layers provide precise neighbor connections. HNSW is widely used for tasks like similarity search, recommendation systems, and clustering.

This implementation is written in TypeScript and is designed to be simple and customizable.

## Features
- Support for adding vectors with IDs.
- Multi-layer graph construction with customizable maximum layers and edges per node.
- Support for Euclidean distance.
- Randomized geometric distribution to assign node layers.
- Flexible and lightweight codebase.

## Getting Started

### Prerequisites
Make sure you have Node.js and npm installed on your system.

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd hnsw_lite
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```

### Usage

#### 1. Initialize the HNSW Graph
The project includes implementations for Euclidean distance and Cosine similarity. If no parameter is specified, Euclidean Distance will be used:

```typescript
   import { HNSW } from './hnsw';

   // Create an HNSW graph with 3 layers and max 8 edges per node
   const euclidean_hnsw = new HNSW(3, 8, 'euclideanDistance'); 

   // Create an HNSW graph with 4 layers and max 5 edges per node
   const cosine_hnsw = new HNSW(4,5, 'cosineSimilarity')
```

#### 2. Add Vectors
To add vectors to the HNSW graph, call the `add` method with a unique ID and the vector you want to add. All vectors must be the same length:

```typescript
hnsw.add('node-1', [0.1, 0.2, 0.3, 0.4]);
hnsw.add('node-2', [0.5, 0.6, 0.7, 0.8]);
hnsw.add('node-3', [0.2, 0.3, 0.4, 0.5]);
```

#### 2. Add Vectors in Bulk
To add vectors to the HNSW graph in bulk, call the `addBulk` method:

```typescript
// Add multiple nodes in bulk using an array of tuples
hnsw.addBulk([
  ['node-1', [0.1, 0.2, 0.3, 0.4]],
  ['node-2', [0.5, 0.6, 0.7, 0.8]],
  ['node-3', [0.2, 0.3, 0.4, 0.5]],
]);
```

#### 3. Remove Vectors
To remove vectors from the HNSW graph, call the remove method with the unique ID of the vector you want to remove. When a node is removed, the graph will attempt to maintain the maxEdges per node value specified during initialization. However, if there are not enough nodes in a given layer, the number of edges for some nodes may fall below the maxEdges constraint.

```typescript
hnsw.remove('node-1')
```

#### 4. Query Vectors
To find the nearest neighbor(s) for a given query vector, use the `query` method. By default, the search will return one result. However, you can optionally specify a value between 1 and maxEdges (inclusive) to retrieve more neighbors.

As this is a lightweight implementation, the search will attempt to find the nearest node to the query vector on the final layer of the graph. It will then return the nearest neighbors to that specific node, not directly to the query vector itself:
```typescript
const result = hnsw.query([0.15, 0.25, 0.35, 0.45], 2); // Find 2 nearest neighbors
console.log('Nearest neighbors:', result);
```


#### 5. Serialize and Deserialize the Graph
To save the HNSW graph to a JSON format and rebuild it later, use the toJSON and fromJSON methods:

##### Save to JSON
```typescript
const graphJSON = hnsw.toJSON(); // Convert the graph to JSON
fs.writeFileSync('hnsw_graph.json', JSON.stringify(graphJSON));
```

##### Load from JSON
By default, when the graph is rebuilt it will use precalculated values for the distance metric (from the previous build):
```typescript
const graphData = JSON.parse(fs.readFileSync('hnsw_graph.json', 'utf8'));
const restoredHnsw = HNSW.fromJSON(graphData); // Rebuild the graph from JSON

```

### Example Output
Here is an example of adding nodes and querying:

```bash
Adding node with ID: node-1, Layer: 0, Vector: [0.1, 0.2, 0.3, 0.4]
Adding node with ID: node-2, Layer: 0, Vector: [0.5, 0.6, 0.7, 0.8]
Adding node with ID: node-3, Layer: 1, Vector: [0.2, 0.3, 0.4, 0.5]
Nearest neighbors: [ 'node-1', 'node-3' ]
```

## Configuration
- `maxLayers`: Number of layers in the HNSW graph. Higher values improve search efficiency but increase memory usage.
- `maxEdges`: Maximum edges per node. Higher values increase connectivity but also computation time.

Example:
```typescript
const hnsw = new HNSW(4, 10); // 4 layers, max 10 edges per node
```

## Limitations
- Input vectors must have values between 0 and 1 (inclusive), as enforced by the `add` method.
- This implementation is designed for educational and experimental use. It may not scale to extremely large datasets.

## Contributions
Feel free to fork the repository and submit pull requests. Suggestions and feature requests are welcome!

## License
This project is licensed under the MIT License. See the `LICENSE` file for more details.

## Acknowledgments
- Based on the Hierarchical Navigable Small World (HNSW) paper by Yu. A. Malkov and D. A. Yashunin.
- Inspired by popular ANN libraries like FAISS and Hnswlib.

