import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import axios from "axios";
import { cosineSimilarity } from "../../../../utils/common";
import { isTokenValid } from "../../../../utils/auth/is-token-valid";

/**
 * Generate embeddings for a given text
 * @param {string} text
 * @param {string} model
 * @returns {Promise<number[]>}
 */
async function generateEmbeddings(
  text: string,
  model: string = "text-embedding-ada-002",
) {
  const response = await axios.post(
    "https://api.openai.com/v1/embeddings",
    {
      input: text,
      model: model,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
    },
  );
  return response.data.data[0].embedding;
}

// POST /api/advisor (get advisors sorted by prompt similarity)
export async function POST(req: NextRequest) {
  // Handle authentication
  const token = req.cookies.get("token")?.value;
  let decoded;

  if (token) {
    decoded = isTokenValid(token);

    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }
  } else {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }

  const { prompt } = await req.json();

  if (!prompt) {
    return new Response(JSON.stringify({ error: "Prompt is required" }), {
      status: 400,
    });
  }

  // Fetch financial advisors
  const advisors = await prisma.financialAdvisor.findMany();

  // Generate embeddings for the user prompt
  const promptEmbedding = await generateEmbeddings(prompt);

  // Compare with each advisor's specialties
  const advisorScores = await Promise.all(
    advisors.map(async (advisor) => {
      const specialtiesText = advisor.specialties.join(", ");
      const specialtyEmbedding = await generateEmbeddings(specialtiesText);
      const similarity = cosineSimilarity(promptEmbedding, specialtyEmbedding);
      return { ...advisor, similarity };
    }),
  );

  // Sort advisors by similarity score
  const sortedAdvisors = advisorScores.sort(
    (a, b) => b.similarity - a.similarity,
  );

  return NextResponse.json(sortedAdvisors);
}
