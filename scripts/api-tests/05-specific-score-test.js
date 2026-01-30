
const { getApiClient } = require('./api-client');

async function testLessonScore() {
  const { client } = getApiClient();
  const lessonId = 15; // Known valid ID from previous test

  console.log(`--- Testing Backend Score Endpoint for Lesson ${lessonId} ---`);

  // Confirmed via route.ts that the upstream path is:
  // ${UPSTREAM_BASE}/lessons/scores/lesson/${lessonId}
  // UPSTREAM_BASE usually maps to /api/v1
  // 0. Baseline Check
  try {
    console.log('Fetching Profile (Baseline)...');
    await client.get('/api/v1/profile');
    console.log('✅ Baseline Profile fetch success.');
  } catch (e) {
    console.log('❌ Baseline Profile fetch failed.');
  }

  const pathsToTry = [
    `/api/v1/lessons/scores/lesson/${lessonId}`, // Doc (Singular)
    `/api/v1/lessons/scores/lessons/${lessonId}`, // Plural (matches folder structure?)
    `/api/v1/scores/lessons/${lessonId}`,
    `/api/v1/scores/lesson/${lessonId}`,
  ];

  console.log('Testing variations:');
  for (const path of pathsToTry) {
        process.stdout.write(`Trying ${path} ... `);
        try {
            const res = await client.get(path);
            console.log(`✅ SUCCESS! Status: ${res.status}`);
            console.log('Data:', JSON.stringify(res.data, null, 2));
            break; 
        } catch (err) {
            if (err.response) {
                console.log(`❌ ${err.response.status} ${err.response.data.message}`);
            } else {
                console.log(`❌ Error: ${err.message}`);
            }
        }
  }
}

testLessonScore();
