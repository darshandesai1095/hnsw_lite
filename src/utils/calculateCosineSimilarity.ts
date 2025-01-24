export const calculateCosineSimilarity = (v1: number[], v2: number[]): number => {
    if (v1.length !== v2.length) {
      throw new Error("Vectors must have the same length.");
    }
  
    let dotProduct = 0;
    let magnitudeV1 = 0;
    let magnitudeV2 = 0;
  
    for (let i = 0; i < v1.length; i++) {
      dotProduct += v1[i] * v2[i];
      magnitudeV1 += v1[i] * v1[i];
      magnitudeV2 += v2[i] * v2[i];
    }
  
    const denominator = Math.sqrt(magnitudeV1) * Math.sqrt(magnitudeV2);
  
    if (denominator === 0) {
      throw new Error("One of the vectors has zero magnitude.");
    }
  
    return dotProduct / denominator; // Returns value between -1 and 1
} 