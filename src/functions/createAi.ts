export async function createAi(token: string) {
  const response = await fetch("https://leekwars.com/api/ai/new-name", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Authentication via cookie: token=<data.token>
      Cookie: `token=${token}`,
    },
    body: JSON.stringify({
      folder_id: 0,
      name: "didier",
      version: 4,
    }),
  });

  if (response.ok) {
    console.log("✓ AI 'didier' created successfully");
  } else {
    console.error(`✗ Failed to create AI 'didier': ${response.status} ${response.statusText}`);
  }
}
