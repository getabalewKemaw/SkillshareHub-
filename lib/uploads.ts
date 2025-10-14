export async function requestMockUpload(filename: string, type: string) {
  const res = await fetch('/api/uploads/mock', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename, type })
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Upload init failed')
  return data.url as string
}
