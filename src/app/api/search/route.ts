import { NextResponse } from "next/server";
import { z } from "zod";
import { startups } from "@/data/demo/startups";
import { parseSearchIntent, rankStartups } from "@/lib/domain/search";

const RequestSchema = z.object({ query: z.string().trim().min(3).max(1000) });

export async function POST(request: Request) {
  try {
    const { query } = RequestSchema.parse(await request.json());
    const intent = parseSearchIntent(query);
    return NextResponse.json({ intent, results: rankStartups(startups, intent), source: "deterministic-demo" });
  } catch {
    return NextResponse.json({ error: "Please enter a little more detail so we can search well." }, { status: 400 });
  }
}
