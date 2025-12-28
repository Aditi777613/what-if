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
  imageUrl: string | null;
}

export interface GenerateRequest {
  whatIf: string;
  currentLife?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5174';

export const generateStory = async (
  request: GenerateRequest
): Promise<GenerateResponse> => {
  console.log('🚀 Sending request to:', `${API_BASE_URL}/api/generate`);
  console.log('📦 Request payload:', request);
  
  const response = await fetch(`${API_BASE_URL}/api/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  console.log('📡 Response status:', response.status);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    console.error('❌ API Error:', error);
    throw new Error(error.error || error.details || 'Failed to generate story');
  }

  const data = await response.json();
  console.log('✅ Received data:', {
    hasStory: !!data.story,
    hasImageUrl: !!data.imageUrl,
    storyTitle: data.story?.title
  });
  
  return data;
};