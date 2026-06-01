import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { text } = body;

    if (typeof text !== "string" || !text.trim()) {
      return NextResponse.json(
        { error: "Text parameter is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    const maxChars = parseInt(process.env.TTS_MAX_CHARS || "1000", 10);
    if (text.length > maxChars) {
      return NextResponse.json(
        { error: `Text length exceeds maximum allowed characters of ${maxChars}` },
        { status: 400 }
      );
    }

    const apiKey = process.env.FPT_AI_API_KEY;
    if (!apiKey) {
      console.error("FPT_AI_API_KEY is missing from environment variables");
      return NextResponse.json(
        { error: "FPT AI TTS service is not configured (API key missing)" },
        { status: 500 }
      );
    }

    const voice = process.env.FPT_TTS_VOICE || "banmai";
    const speed = process.env.FPT_TTS_SPEED || "0";
    const format = process.env.FPT_TTS_FORMAT || "mp3";

    const response = await fetch("https://api.fpt.ai/hmi/tts/v5", {
      method: "POST",
      headers: {
        api_key: apiKey,
        voice: voice,
        speed: speed,
        format: format,
      },
      body: text,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`FPT AI API returned error ${response.status}: ${errorText}`);
      return NextResponse.json(
        { error: `FPT AI API returned error ${response.status}` },
        { status: 502 }
      );
    }

    const data = await response.json();

    if (data.error !== 0) {
      console.error("FPT AI API logic error:", data.message);
      return NextResponse.json(
        { error: data.message || "Failed to generate TTS audio" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      provider: "fpt",
      audioUrl: data.async,
      status: "async_url_created",
    });
  } catch (error) {
    console.error("Error in FPT TTS proxy route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
