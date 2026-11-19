const BOT_TOKEN = '8787860497:AAHG3BNGy8bvl8Br1gWAXJOD_Q6xWuS6KX4';
const CHAT_ID = '6442368699';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { name, email, message } = JSON.parse(event.body);

    const text = `📬 New Contact Form Submission\n\n` +
      `👤 Name: ${name}\n` +
      `📧 Email: ${email}\n` +
      `💬 Message:\n${message}`;

    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: text,
        parse_mode: 'HTML'
      })
    });

    const data = await response.json();

    if (!data.ok) {
      throw new Error(data.description);
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, message: 'Sent to Telegram!' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};