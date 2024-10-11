import { NextRequest, NextResponse } from "next/server";

const m2m_api_paths = ["/api/scene-search"];

export async function middleware(request: NextRequest) {
  if (m2m_api_paths.some((path) => request.nextUrl.pathname.startsWith(path))) {
    const url = (process.env.M2M_API_URL || "") + "/login-token";
    const resp = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        username: process.env.M2M_USERNAME,
        token: process.env.M2M_APP_TOKEN,
      }),
      next: {
        revalidate: 60 * 60 * 2 - 60, // 1H:59M
      },
    });
    const { data: loginToken } = await resp.json();
    const headers = new Headers(request.headers);
    headers.set("X-Auth-Token", loginToken);
    return NextResponse.next({
      request: {
        headers,
      },
    });
  }
  return NextResponse.next();
}
