export async function GET(request: Request) {
  return Response.json([], { status: 200 });
}

export async function PATCH(request: Request) {
  return new Response('Message voted', { status: 200 });
}
