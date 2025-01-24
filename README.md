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

#### 1. Add Vectors
To add vectors to the HNSW graph, call the `add` method with a unique ID and the vector you want to add:

```typescript
import { HNSW } from './hnsw';

const hnsw = new HNSW(3, 5); // Create an HNSW graph with 3 layers and max 5 edges per node

hnsw.add('node-1', [0.1, 0.2, 0.3, 0.4]);
hnsw.add('node-2', [0.5, 0.6, 0.7, 0.8]);
hnsw.add('node-3', [0.2, 0.3, 0.4, 0.5]);
```

#### 2. Query Vectors
To find the nearest neighbors for a given query vector, use the `query` method:

```typescript
const result = hnsw.query([0.15, 0.25, 0.35, 0.45], 2); // Find 2 nearest neighbors
console.log('Nearest neighbors:', result);
```

#### 3. Custom Metrics
The project includes default implementations for Euclidean distance and Cosine similarity. You can create your own metric function and integrate it as needed:

```typescript
export const calculateCustomMetric = (v1: number[], v2: number[]): number => {
    // Define your custom metric logic here
    return 0;
};
```

#### 4. Serialize and Deserialize the Graph
The project includes default implementations for Euclidean distance and Cosine similarity. You can create your own metric function and integrate it as needed:

```typescript
const graphJSON = hnsw.toJSON(); // Convert the graph to JSON
fs.writeFileSync('hnsw_graph.json', JSON.stringify(graphJSON));
```

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
- Input vectors must have values between 0 and 1, as enforced by the `add` method.
- This implementation is designed for educational and experimental use. It may not scale to extremely large datasets.

## Contributions
Feel free to fork the repository and submit pull requests. Suggestions and feature requests are welcome!

## License
This project is licensed under the MIT License. See the `LICENSE` file for more details.

## Acknowledgments
- Based on the Hierarchical Navigable Small World (HNSW) paper by Yu. A. Malkov and D. A. Yashunin.
- Inspired by popular ANN libraries like FAISS and Hnswlib.

