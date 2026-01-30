
const { getApiClient } = require('./api-client');

async function testUserAndStudentEndpoints() {
  const { client } = getApiClient();

  console.log('--- Testing User & Student Endpoints ---');

  // 1. Get Profile
  try {
    console.log('\nFetching Profile (GET /api/v1/profile)...');
    const profileRes = await client.get('/api/v1/profile');
    if (profileRes.data.success) {
      console.log('✅ Profile fetched successfully.');
      console.log('User:', profileRes.data.content.user.name, `(ID: ${profileRes.data.content.user.id})`);
    } else {
      console.error('❌ Failed to fetch profile:', profileRes.data.message);
    }
  } catch (err) {
    console.error('❌ Error fetching profile:', err.message);
    if(err.response) console.error(err.response.data);
  }

  // 2. Get Profile Data
  try {
    console.log('\nFetching Profile Data (GET /api/v1/profile/data)...');
    const profileDataRes = await client.get('/api/v1/profile/data');
    if (profileDataRes.data.success) {
      console.log('✅ Profile Data fetched successfully.');
      console.log('Classes available:', profileDataRes.data.content.classes.length);
    } else {
      console.error('❌ Failed to fetch profile data:', profileDataRes.data.message);
    }
  } catch (err) {
    console.error('❌ Error fetching profile data:', err.message);
    if(err.response) console.error(err.response.data);
  }

  // 3. Get Student Dashboard
  try {
    console.log('\nFetching Student Dashboard (GET /api/v1/dashboard)...');
    const dashboardRes = await client.get('/api/v1/dashboard');
    if (dashboardRes.data.success) {
      console.log('✅ Student Dashboard fetched successfully.');
      // Log some interesting data if available
      console.log('Content:', JSON.stringify(dashboardRes.data.content, null, 2));
    } else {
      console.error('❌ Failed to fetch student dashboard:', dashboardRes.data.message);
    }
  } catch (err) {
    console.error('❌ Error fetching student dashboard:', err.message);
     if(err.response) console.error(err.response.data);
  }

  // 4. Get Student Subjects
  try {
    console.log('\nFetching Student Subjects (GET /api/v1/subjects)...');
    const subjectsRes = await client.get('/api/v1/subjects');
    if (subjectsRes.data.success) {
      console.log('✅ Student Subjects fetched successfully.');
      const subjects = subjectsRes.data.content.subjects || [];
      console.log(`Found ${subjects.length} subjects.`);
      if (subjects.length > 0) {
        console.log('Sample subject:', subjects[0].name);
      }
    } else {
      console.error('❌ Failed to fetch subjects:', subjectsRes.data.message);
    }
  } catch (err) {
    console.error('❌ Error fetching subjects:', err.message);
    if(err.response) console.error(err.response.data);
  }
}

testUserAndStudentEndpoints();
