/**
 * Multi-Provider AI Service
 * Supports Google Gemini, Groq, Together AI, and Hugging Face
 * Automatically rotates between providers when rate limits are hit
 */

const PROVIDERS = {
  GEMINI: 'gemini',
  GROQ: 'groq',
  TOGETHER: 'together',
  HUGGINGFACE: 'huggingface'
};

const API_KEYS = {
  [PROVIDERS.GEMINI]: import.meta.env.VITE_GEMINI_API_KEY,
  [PROVIDERS.GROQ]: import.meta.env.VITE_GROQ_API_KEY,
  [PROVIDERS.TOGETHER]: import.meta.env.VITE_TOGETHER_API_KEY,
  [PROVIDERS.HUGGINGFACE]: import.meta.env.VITE_HUGGINGFACE_API_KEY
};

class AIProvider {
  constructor() {
    this.currentProvider = PROVIDERS.GEMINI;
    this.providerOrder = [
      PROVIDERS.GEMINI,
      PROVIDERS.GROQ,
      PROVIDERS.TOGETHER,
      PROVIDERS.HUGGINGFACE
    ];
    this.providerIndex = 0;
    this.rateLimitedProviders = new Set();
  }

  /**
   * Get next available provider
   */
  getNextProvider() {
    const availableProviders = this.providerOrder.filter(
      p => !this.rateLimitedProviders.has(p) && API_KEYS[p]
    );

    if (availableProviders.length === 0) {
      // Reset rate limits after 1 hour
      this.rateLimitedProviders.clear();
      return this.providerOrder[0];
    }

    this.providerIndex = (this.providerIndex + 1) % availableProviders.length;
    this.currentProvider = availableProviders[this.providerIndex];
    return this.currentProvider;
  }

  /**
   * Mark provider as rate limited
   */
  markRateLimited(provider) {
    this.rateLimitedProviders.add(provider);
    console.warn(`Provider ${provider} is rate limited. Switching to next provider.`);
  }

  /**
   * Generate content using Gemini API
   */
  async generateWithGemini(prompt) {
    const apiKey = API_KEYS[PROVIDERS.GEMINI];
    if (!apiKey) throw new Error('Gemini API key not configured');

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096,
        }
      })
    });

    if (response.status === 429) {
      this.markRateLimited(PROVIDERS.GEMINI);
      throw new Error('RATE_LIMITED');
    }

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  /**
   * Generate content using Groq API
   */
  async generateWithGroq(prompt) {
    const apiKey = API_KEYS[PROVIDERS.GROQ];
    if (!apiKey) throw new Error('Groq API key not configured');

    const url = 'https://api.groq.com/openai/v1/chat/completions';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4096
      })
    });

    if (response.status === 429) {
      this.markRateLimited(PROVIDERS.GROQ);
      throw new Error('RATE_LIMITED');
    }

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  /**
   * Generate content using Together AI
   */
  async generateWithTogether(prompt) {
    const apiKey = API_KEYS[PROVIDERS.TOGETHER];
    if (!apiKey) throw new Error('Together AI API key not configured');

    const url = 'https://api.together.xyz/v1/chat/completions';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4096
      })
    });

    if (response.status === 429) {
      this.markRateLimited(PROVIDERS.TOGETHER);
      throw new Error('RATE_LIMITED');
    }

    if (!response.ok) {
      throw new Error(`Together AI error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  /**
   * Generate content using Hugging Face Inference API
   */
  async generateWithHuggingFace(prompt) {
    const apiKey = API_KEYS[PROVIDERS.HUGGINGFACE];
    if (!apiKey) throw new Error('Hugging Face API key not configured');

    const url = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 4096,
          temperature: 0.7,
          return_full_text: false
        }
      })
    });

    if (response.status === 429) {
      this.markRateLimited(PROVIDERS.HUGGINGFACE);
      throw new Error('RATE_LIMITED');
    }

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data[0].generated_text;
  }

  /**
   * Generate content with automatic provider fallback
   */
  async generate(prompt, maxRetries = 3) {
    let lastError = null;

    for (let i = 0; i < maxRetries; i++) {
      try {
        const provider = this.currentProvider;
        console.log(`Attempting generation with provider: ${provider}`);

        let result;
        switch (provider) {
          case PROVIDERS.GEMINI:
            result = await this.generateWithGemini(prompt);
            break;
          case PROVIDERS.GROQ:
            result = await this.generateWithGroq(prompt);
            break;
          case PROVIDERS.TOGETHER:
            result = await this.generateWithTogether(prompt);
            break;
          case PROVIDERS.HUGGINGFACE:
            result = await this.generateWithHuggingFace(prompt);
            break;
          default:
            throw new Error('Unknown provider');
        }

        console.log(`✓ Successfully generated with ${provider}`);
        return {
          content: result,
          provider: provider
        };
      } catch (error) {
        lastError = error;
        
        if (error.message === 'RATE_LIMITED') {
          console.log(`Rate limited on ${this.currentProvider}, switching provider...`);
          this.getNextProvider();
          continue;
        }
        
        // For other errors, try next provider
        console.error(`Error with ${this.currentProvider}:`, error.message);
        this.getNextProvider();
      }
    }

    throw new Error(`Failed to generate content after ${maxRetries} attempts. Last error: ${lastError?.message}`);
  }

  /**
   * Get current provider status
   */
  getStatus() {
    return {
      currentProvider: this.currentProvider,
      availableProviders: this.providerOrder.filter(
        p => !this.rateLimitedProviders.has(p) && API_KEYS[p]
      ),
      rateLimitedProviders: Array.from(this.rateLimitedProviders),
      configuredProviders: Object.entries(API_KEYS)
        .filter(([_, key]) => key)
        .map(([provider]) => provider)
    };
  }
}

// Export singleton instance
export const aiProvider = new AIProvider();
export { PROVIDERS };
