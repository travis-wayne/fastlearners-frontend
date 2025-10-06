// TODO: Implement user deletion via Fastlearners API
// For now, return a clear 501 Not Implemented so clients don't interpret this as success.

export async function DELETE(_req: Request) {
  return new Response(
    JSON.stringify({
      success: false,
      message: "DELETE /api/user not implemented",
    }),
    { status: 501, headers: { "Content-Type": "application/json" } },
  );
}
