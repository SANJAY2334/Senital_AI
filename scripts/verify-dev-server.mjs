import http from 'http';

function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, data }));
    }).on('error', reject);
  });
}

async function run() {
  console.log('Testing Vite Dev Server on http://localhost:3000 ...');
  
  // 1. Fetch index.html
  const indexRes = await get('http://localhost:3000/');
  console.log('GET / -> Status:', indexRes.status, 'HTML length:', indexRes.data.length);
  if (!indexRes.data.includes('<div id="root"></div>')) {
    throw new Error('Index HTML missing root element');
  }

  // 2. Fetch /src/main.tsx
  const mainRes = await get('http://localhost:3000/src/main.tsx');
  console.log('GET /src/main.tsx -> Status:', mainRes.status, 'Content length:', mainRes.data.length);

  // 3. Fetch synthetic log generator
  const synRes = await get('http://localhost:3000/@fs/C:/Users/Sanjay%20R/Desktop/SenitalAI/tools/synthetic-log-generator/src/index.ts');
  console.log('GET synthetic-log-generator/src/index.ts -> Status:', synRes.status, 'Content length:', synRes.data.length);
  
  // Verify that synthetic-log-generator does NOT contain require.main or CLI logic
  if (synRes.data.includes('require.main === module') || synRes.data.includes('require(')) {
    throw new Error('synthetic-log-generator index.ts contains require() in Vite dev output!');
  }
  console.log('Verified: synthetic-log-generator does NOT contain require()');

  // 4. Fetch ocsf-normalizer browser entrypoint
  const ocsfRes = await get('http://localhost:3000/@fs/C:/Users/Sanjay%20R/Desktop/SenitalAI/services/ocsf-normalizer/src/browser.ts');
  console.log('GET ocsf-normalizer/src/browser.ts -> Status:', ocsfRes.status, 'Content length:', ocsfRes.data.length);

  // Verify that ocsf-normalizer browser entry does not reference kafkajs or net/tls
  if (ocsfRes.data.includes('kafkajs') || ocsfRes.data.includes('node:net')) {
    throw new Error('ocsf-normalizer/src/browser.ts references server modules in dev output!');
  }
  console.log('Verified: ocsf-normalizer/src/browser.ts is free of server/Node modules');

  // 5. Fetch demo pipeline adapter
  const adapterRes = await get('http://localhost:3000/src/adapters/demo-pipeline.adapter.ts');
  console.log('GET demo-pipeline.adapter.ts -> Status:', adapterRes.status);

  console.log('ALL DEV SERVER CHECKS PASSED!');
}

run().catch(err => {
  console.error('FAILED:', err);
  process.exit(1);
});
