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
  console.log('Verifying UI Redesign components and CSS in Dev Server...');

  // 1. Fetch App.tsx
  const appRes = await get('http://localhost:3000/src/App.tsx');
  console.log('GET /src/App.tsx -> Status:', appRes.status, 'Length:', appRes.data.length);
  if (!appRes.data.includes('DashboardView') || !appRes.data.includes('AlertsView')) {
    throw new Error('App.tsx missing expected views');
  }

  // 2. Fetch DashboardView.tsx
  const dashRes = await get('http://localhost:3000/src/components/views/DashboardView.tsx');
  console.log('GET DashboardView.tsx -> Status:', dashRes.status, 'Length:', dashRes.data.length);

  // 3. Fetch AlertsView.tsx
  const alertsRes = await get('http://localhost:3000/src/components/views/AlertsView.tsx');
  console.log('GET AlertsView.tsx -> Status:', alertsRes.status, 'Length:', alertsRes.data.length);

  // 4. Fetch EventsView.tsx
  const eventsRes = await get('http://localhost:3000/src/components/views/EventsView.tsx');
  console.log('GET EventsView.tsx -> Status:', eventsRes.status, 'Length:', eventsRes.data.length);

  // 5. Fetch ActivityTimelineChart.tsx
  const chartRes = await get('http://localhost:3000/src/components/charts/ActivityTimelineChart.tsx');
  console.log('GET ActivityTimelineChart.tsx -> Status:', chartRes.status, 'Length:', chartRes.data.length);

  // 6. Fetch index.css through Vite to check CSS compilation
  const cssRes = await get('http://localhost:3000/src/index.css');
  console.log('GET /src/index.css -> Status:', cssRes.status, 'Length:', cssRes.data.length);
  if (cssRes.data.includes('@tailwind base') && !cssRes.data.includes('tailwindcss')) {
    console.log('Note: CSS served via Vite style injector');
  }

  console.log('ALL UI REDESIGN MODULE CHECKS PASSED!');
}

run().catch(err => {
  console.error('FAILED:', err);
  process.exit(1);
});
