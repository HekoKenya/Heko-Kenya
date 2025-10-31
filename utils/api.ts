// C:\Users\ochie\heko\utils\api.ts

export interface HekoFormData {
  [key: string]: string | number | boolean | null | File[];
}

export interface HekoApiResponse {
  prediction?: string;
  message?: string;
  score?: number;
  insights?: string[];
  recommendations?: string[];
  [key: string]: unknown;
}

/**
 * Sends form data to the Heko AI backend for analysis.
 * Supports both FormData (with file attachments) and plain JSON objects.
 */
export const sendHekoData = async (
  formData: FormData | HekoFormData
): Promise<HekoApiResponse> => {
  try {
    let body: BodyInit;
    const headers: HeadersInit = {};

    if (formData instanceof FormData) {
      // If FormData (files included), we don't set Content-Type; browser sets it automatically
      body = formData;
    } else {
      // If plain object, convert to JSON
      body = JSON.stringify(formData);
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch('https://paulwako-heko.hf.space/predict', {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      let errBody = '';
      try { errBody = await response.text(); } catch {}
      throw new Error(`API request failed (${response.status} ${response.statusText}): ${errBody}`);
    }

    // Try JSON first; if it fails, surface raw text
    let result: HekoApiResponse;
    try {
      result = await response.json();
    } catch (e) {
      const raw = await response.text();
      throw new Error(`API response is not valid JSON: ${raw}`);
    }
    console.log('Model API Response:', result);
    return result;
  } catch (error) {
    console.error('Error calling model API:', error);
    throw error;
  }
};
