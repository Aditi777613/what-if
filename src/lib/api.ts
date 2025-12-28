export interface Story {
  title: string;
  morning: string;
  midday: string;
  afternoon: string;
  evening: string;
  reflection: string;
}

export interface GenerateResponse {
  story: Story;
}

export interface GenerateRequest {
  whatIf: string;
  currentLife?: string;
}

/**
 * IMPORTANT:
 * - No API_BASE_URL
 * - No localhost
 * - Relative path works on both:
 *   - localhost (Vite proxy / same origin)
 *   - Vercel (/api serverless functions)
 */
const API_ENDPOINT = "/api/generate";

export const generateStory = async (
  request: GenerateRequest
): Promise<GenerateResponse> => {
  console.log("🚀 Sending request to:", API_ENDPOINT);
  console.log("📦 Request payload:", request);

  const response = await fetch(API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  console.log("📡 Response status:", response.status);

  if (!response.ok) {
    let errorMessage = "Failed to generate story";

    try {
      const error = await response.json();
      errorMessage =
        error.error ||
        error.details ||
        error.message ||
        errorMessage;
      console.error("❌ API Error:", error);
    } catch {
      console.error("❌ API Error: Non-JSON response");
    }

    throw new Error(errorMessage);
  }

  const data = await response.json();

  console.log("✅ Story received:", {
    hasStory: !!data.story,
    storyTitle: data.story?.title,
  });

  return data;
};
