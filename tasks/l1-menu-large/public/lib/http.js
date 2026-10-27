async function parse(response) {
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(payload?.error ?? `request failed with ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return payload;
}

export async function getJson(url) {
  return parse(await fetch(url));
}

export async function postJson(url, body) {
  return parse(await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  }));
}
