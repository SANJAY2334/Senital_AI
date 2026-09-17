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
  console.log('Testing Vite Preview Server on http://localhost:3000 ...');
  
  // 1. Fetch index.html
  const indexRes = await get('http://localhost:3000/');
  console.log('GET / -> Status:', indexRes.status, 'HTML length:', indexRes.data.length);
  if (!indexRes.data.includes('<div id="root"></div>')) {
    throw new Error('Index HTML missing root element');
  }

  // Extract assets from HTML: <script type="module" crossorigin src="/assets/index-....js">
  const scriptMatch = indexRes.data.match(/src="(\/assets\/[^"]+\.js)"/);
  if (!scriptMatch) {
    throw new Error('Could not find production JS bundle in index.html');
  }
  const jsUrl = `http://localhost:3000${scriptMatch[1]}`;
  console.log('Found production bundle:', jsUrl);

  const bundleRes = await get(jsUrl);
  console.log('GET', jsUrl, '-> Status:', bundleRes.status, 'Bundle size:', bundleRes.data.length);

  // Assertions on production bundle
  if (bundleRes.data.includes('require.main === module')) {
    throw new Error('Production bundle leaked require.main check!');
  }
  if (bundleRes.data.includes('kafkajs')) {
    throw new Error('Production bundle leaked kafkajs!');
  }
  if (bundleRes.data.includes('process.argv')) {
    throw new Error('Production bundle leaked process.argv!');
  }

  console.log('Verified: Production bundle is clean, pure, browser-safe ESM without any Node leaks!');
  console.log('ALL PREVIEW SERVER CHECKS PASSED!');
}

run().catch(err => {
  console.error('FAILED:', err);
  process.exit(1);
});
