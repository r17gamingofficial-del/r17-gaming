import fetch from 'node-fetch';

async function run() {
  const payload = {
    items: [{ productId: 'r17-pro-combat-jersey', quantity: 1 }],
    customer: { name: 'Tester' },
  };

  try {
    const res = await fetch('http://localhost:5174/create-order', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    console.log('STATUS', res.status);
    console.log('BODY', text);
  } catch (err) {
    console.error('ERR', err.message || err);
  }
}

run();
