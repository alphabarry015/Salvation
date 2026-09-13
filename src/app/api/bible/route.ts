import { NextResponse } from "next/server";
import { ApiError, fetchBibleFromProvider } from "@/services/api";

export const revalidate = 86400;

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;

  try {
    const from = params.get("from");
    const to = params.get("to");

    const passage = await fetchBibleFromProvider({
      book: params.get("book") ?? "",
      chapter: Number(params.get("chapter")),
      verseStart: from ? Number(from) : 1,
      verseEnd: to ? Number(to) : 9999,
    });

    return NextResponse.json(passage);
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 502;
    const message =
      error instanceof ApiError
        ? error.message
        : "Impossible de joindre l'API Bible.";

    return NextResponse.json({ error: message }, { status });
  }
}
