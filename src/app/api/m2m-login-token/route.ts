type ReqBody = {
  url: string;
  username: string;
  token: string;
};

export async function POST(request: Request) {
  const req = await request.json();
  const { url, ...rest } = req;

  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(rest),
    cache: "force-cache",
    next: { revalidate: 2 * 3600 }, // revalidate in 2 hours (auth token expires every 2 hours )
  });

  return res;
}
