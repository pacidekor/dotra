import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type TrackBody = {
  profileId?: string;
  type?: "view" | "click";
  linkId?: string;
  linkHref?: string;
  linkIcon?: string;
  linkLabel?: string;
  visitorKey?: string | null;
};

export async function POST(request: Request) {
  let body: TrackBody;
  try {
    body = (await request.json()) as TrackBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const profileId = body.profileId?.trim();
  const type = body.type;
  if (!profileId || (type !== "view" && type !== "click")) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: "Missing env" }, { status: 500 });
  }

  const supabase = createClient(url, key);
  const { error } = await supabase.from("dotra_events").insert({
    profile_id: profileId,
    event_type: type,
    link_id: body.linkId || null,
    link_href: body.linkHref || null,
    link_icon: body.linkIcon || null,
    link_label: body.linkLabel || null,
    visitor_key: body.visitorKey || null,
  });

  if (error) {
    // Table missing / RLS — soft-fail so public profiles still work
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 200 },
    );
  }

  return NextResponse.json({ ok: true });
}
