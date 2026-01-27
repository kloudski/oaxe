import OpenAI from 'openai';
import type { OaxeOutput } from './types';
import { OaxeOutputSchema } from './schemas';

const SYSTEM_PROMPT = `You are Oaxe, a product architect AI. Given a product directive, you generate a complete product specification.

You MUST respond with a valid JSON object matching this exact schema:

{
  "appName": "string - the product name",
  "slug": "string - url-safe lowercase slug",
  "elevatorPitch": "string - one sentence pitch",
  "productSpec": {
    "description": "string - detailed description",
    "personas": ["array of target user personas"],
    "coreFeatures": ["array of core features"]
  },
  "architecture": {
    "frontend": "string - frontend tech stack",
    "backend": "string - backend tech stack",
    "infra": "string - infrastructure approach"
  },
  "entities": [
    {
      "name": "string - entity name",
      "fields": [{ "name": "string", "type": "string" }]
    }
  ],
  "apis": [
    { "method": "GET|POST|PUT|DELETE", "path": "/api/...", "purpose": "string" }
  ],
  "pages": [
    { "route": "/...", "purpose": "string" }
  ],
  "designTokens": {
    "typography": ["array of font choices"],
    "colors": ["array of color definitions"],
    "spacing": ["array of spacing values"]
  },
  "brandDNA": {
    "name": "string - brand name",
    "tone": "string - brand voice/tone",
    "values": ["array of brand values"],
    "positioning": "string - market positioning"
  },
  "roadmap": {
    "v1": ["array of v1 features"],
    "v2": ["array of v2 features"],
    "v3": ["array of v3 features"]
  },
  "founderTweets": ["array of 3-5 launch tweets"]
}

Be creative and thorough. Generate production-grade specifications.
Respond ONLY with valid JSON. No markdown, no explanations.`;

export async function generateProductSpec(directive: string): Promise<OaxeOutput> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Product Directive: ${directive}` },
    ],
    temperature: 0.7,
    max_tokens: 4000,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No response from OpenAI');
  }

  const parsed = JSON.parse(content);
  const validated = OaxeOutputSchema.parse(parsed);

  return validated;
}
