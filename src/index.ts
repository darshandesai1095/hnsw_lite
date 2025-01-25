import { HNSW } from './hnsw';
export { HNSW };

// // Create an instance of HNSW with 3 layers and max 5 edges per node
// const hnsw = new HNSW(3, 12);

// // Generate 10 random vectors of length 10 for testing (numbers instead of strings)
// const vectors = Array.from({ length: 25 }, (_, i) => {
//   return Array.from({ length: 20 }, () => parseFloat((Math.random()).toFixed(2)));
// });

// // Add nodes with random IDs and vectors
// vectors.forEach((vector, index) => {
//   hnsw.add(`node-${index + 1}`, vector);
// });

// // Query vector for testing (make sure it's also a number[] array)
// const queryVector = [0.2, 0.4, 0.6, 0.1, 0.3, 0.7, 0.5, 0.6, 0.9, 0.8];

// // Perform search for the 3 closest vectors to the query
// const closestNodes_0 = hnsw.query(queryVector, 3);

// // Log the result
// console.log('Closest nodes to the query vector:', closestNodes_0);
