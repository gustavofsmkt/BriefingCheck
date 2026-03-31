export async function triggerN8nWebhook(payload: {
  briefingId: string;
  imageUrl: string;
  briefingText: string;
}) {
  const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    throw new Error('N8N Webhook URL is not defined');
  }
  
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to trigger n8n webhook: ${errorBody}`);
  }

  return response.json();
}
