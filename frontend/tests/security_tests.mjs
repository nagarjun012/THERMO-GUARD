import { createServer } from 'vite';

async function runSecurityTests() {
  console.log('--- Starting ThermoSafe Phase 1 & 2 Security Automated Test Suite ---');
  
  // Start Vite server programmatically on a test port
  const server = await createServer({
    configFile: './vite.config.ts',
    server: { port: 5199 },
  });
  await server.listen();
  const baseUrl = 'http://localhost:5199';
  console.log(`Vite test server listening at ${baseUrl}`);

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}: ${details}`);
      failed++;
    }
  }

  try {
    // 1. Invalid Login (officer ID: asdf, password: wrong)
    {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ officerId: 'asdf', passcode: 'wrong' }),
      });
      const data = await res.json();
      assert(
        res.status === 401 && data.error,
        'Test 1: Login with invalid credentials rejects with 401 Unauthorized',
        `Status ${res.status}, body: ${JSON.stringify(data)}`
      );
    }

    // 2. Empty Login Credentials
    {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ officerId: '', passcode: '' }),
      });
      const data = await res.json();
      assert(
        res.status === 400,
        'Test 2: Login with empty credentials rejects with 400 Bad Request',
        `Status ${res.status}`
      );
    }

    // 3. Direct /api/htss with NO Cookie
    {
      const res = await fetch(`${baseUrl}/api/htss`);
      const data = await res.json();
      assert(
        res.status === 401 && data.error === 'UNAUTHORIZED',
        'Test 3: Direct API access to /api/htss without cookie returns 401 Unauthorized',
        `Status ${res.status}, body: ${JSON.stringify(data)}`
      );
    }

    // 4. Direct /api/htss with Forged/Tampered Cookie or UUID Header
    {
      const res = await fetch(`${baseUrl}/api/htss`, {
        headers: {
          'Cookie': 'ts_session=fake-token-payload.invalid-hmac-signature-12345',
          'Authorization': 'Bearer 00000000-0000-0000-0000-000000000000',
          'x-officer-id': 'NDMA-HQ-882',
        },
      });
      const data = await res.json();
      assert(
        res.status === 401 && data.error === 'UNAUTHORIZED',
        'Test 4: Tampered session cookie & forged headers return 401 Unauthorized',
        `Status ${res.status}, body: ${JSON.stringify(data)}`
      );
    }

    // 5. Valid Officer Login (Sets HttpOnly Cookie)
    let officerCookie = '';
    {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'gov',
          officerId: 'NDMA-HQ-882',
          passcode: 'NDMA@Secure2026',
        }),
      });
      const setCookie = res.headers.get('set-cookie');
      const data = await res.json();
      officerCookie = setCookie ? setCookie.split(';')[0] : '';
      assert(
        res.status === 200 && data.status === 'authenticated' && officerCookie.startsWith('ts_session='),
        'Test 5: Valid officer login succeeds with 200 and issues HttpOnly signed session cookie',
        `Status ${res.status}, cookie: ${officerCookie}`
      );
    }

    // 6. Access /api/htss with Valid Officer Cookie
    {
      const res = await fetch(`${baseUrl}/api/htss`, {
        headers: { 'Cookie': officerCookie },
      });
      const data = await res.json();
      const hasCensusPop = data.counters && typeof data.counters.affectedPopulation === 'number';
      assert(
        res.status === 200 && data.status === 'ok' && Array.isArray(data.districts) && hasCensusPop,
        'Test 6: Valid officer session cookie allows access to /api/htss with official Census population metrics',
        `Status ${res.status}, popAtRisk: ${data.counters?.affectedPopulation}, popStatus: ${data.counters?.populationDataStatus}`
      );
    }

    // 7. Officer Calling Admin-Only Endpoint (/api/admin/hospital/update)
    {
      const res = await fetch(`${baseUrl}/api/admin/hospital/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': officerCookie,
        },
        body: JSON.stringify({
          facilityId: 'gh-cbe-01',
          totalBeds: 100,
          availableBeds: 20,
        }),
      });
      const data = await res.json();
      assert(
        res.status === 403 && data.error === 'FORBIDDEN',
        'Test 7: Officer role calling admin-only hospital capacity update is rejected with 403 Forbidden',
        `Status ${res.status}, body: ${JSON.stringify(data)}`
      );
    }

    // 8. Admin Login and Calling Admin-Only Endpoint
    let adminCookie = '';
    {
      const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'gov',
          officerId: 'DISASTER-ADMIN-99',
          passcode: 'Admin@ThermoSafe2026',
        }),
      });
      const setCookie = loginRes.headers.get('set-cookie');
      adminCookie = setCookie ? setCookie.split(';')[0] : '';
      
      const updateRes = await fetch(`${baseUrl}/api/admin/hospital/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': adminCookie,
        },
        body: JSON.stringify({
          facilityId: 'gh-cbe-01',
          totalBeds: 500,
          availableBeds: 120,
          totalICUBeds: 50,
          availableICUBeds: 12,
          emergencyAvailable: true,
          oxygenAvailable: true,
          ambulanceAvailable: true,
        }),
      });
      const updateData = await updateRes.json();
      assert(
        updateRes.status === 200 && updateData.status === 'SUCCESS' && updateData.audit?.role === 'ADMIN',
        'Test 8: Admin role can successfully update hospital capacity with server-side audit logging',
        `Status ${updateRes.status}, body: ${JSON.stringify(updateData)}`
      );
    }

    // 9. Logout Invalidation and Cookie Expiration
    {
      const logoutRes = await fetch(`${baseUrl}/api/auth/logout`, {
        method: 'POST',
        headers: { 'Cookie': officerCookie },
      });
      const setCookie = logoutRes.headers.get('set-cookie');
      const logoutData = await logoutRes.json();
      
      // Attempting to use a cleared / logged-out session
      const postLogoutRes = await fetch(`${baseUrl}/api/htss`, {
        headers: { 'Cookie': 'ts_session=; Max-Age=0' },
      });

      assert(
        logoutRes.status === 200 && logoutData.status === 'logged_out' && postLogoutRes.status === 401,
        'Test 9: Logout clears session cookie; subsequent requests without cookie are blocked with 401',
        `Logout status: ${logoutRes.status}, Post-logout status: ${postLogoutRes.status}`
      );
    }

  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  } finally {
    await server.close();
  }

  console.log(`\n--- Test Summary: ${passed} PASSED, ${failed} FAILED ---`);
  if (failed > 0) {
    process.exit(1);
  }
}

runSecurityTests();
