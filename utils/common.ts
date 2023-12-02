/**
 * Returns the cosine similarity between two vectors
 * @param vecA
 * @param vecB
 * @returns {number}
 */
export function cosineSimilarity(vecA: [], vecB: []): number {
  const dotProduct = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
  const magB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
  return dotProduct / (magA * magB);
}
