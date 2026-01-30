
const { getApiClient } = require('./api-client');

async function testAnsweringAndCompletion() {
  const { client } = getApiClient();
  const subjectSlug = 'biology';
  const topicSlug = 'introduction-to-biology';

  console.log(`--- Testing Answering & Completion for ${subjectSlug}/${topicSlug} ---`);

  let lessonId = null;
  let exerciseId = null;
  let conceptId = null;
  let generalExerciseId = null;

  // 1. Fetch Content to get IDs
  try {
    console.log(`\nFetching Content to get IDs...`);
    const contentRes = await client.get(`/api/v1/lessons/${subjectSlug}/${topicSlug}/content`);
    if (contentRes.data.success) {
      console.log('✅ Content fetched.');
      const lesson = contentRes.data.content.lesson;
      lessonId = lesson.id;
      console.log(`Lesson ID: ${lessonId}`);

      // Find an exercise in the first concept
      if (lesson.concepts && lesson.concepts.length > 0) {
        conceptId = lesson.concepts[0].id;
        console.log(`Concept ID: ${conceptId}`);
        if (lesson.concepts[0].exercises && lesson.concepts[0].exercises.length > 0) {
          exerciseId = lesson.concepts[0].exercises[0].id;
          console.log(`Found Exercise ID: ${exerciseId}`);
        }
      }

      // Find a general exercise
      if (lesson.general_exercises && lesson.general_exercises.length > 0) {
        generalExerciseId = lesson.general_exercises[0].id;
        console.log(`Found General Exercise ID: ${generalExerciseId}`);
      }

    } else {
      console.error('❌ Failed to fetch content:', contentRes.data.message);
      return;
    }
  } catch (err) {
    console.error('❌ Error fetching content:', err.message);
    if(err.response) console.error(err.response.data);
    return;
  }

  // 2. Check Exercise Answer (if found)
  if (exerciseId) {
    try {
      console.log(`\nChecking Exercise Answer for ID ${exerciseId}...`);
      // using a dummy answer 'A' - expect explicit success or failure
      const checkRes = await client.post('/api/v1/lessons/check-exercise-answer', {
        exercise_id: exerciseId,
        answer: 'A' 
      });
      
      if (checkRes.data.success) {
        console.log('✅ Answer checked successfully:', checkRes.data.message);
      } else {
        console.log('❌ Answer check failed (logic):', checkRes.data.message); 
      }
    } catch (err) {
      // 400 is expected if already answered or wrong answer sometimes
      if (err.response && (err.response.status === 400 || err.response.status === 422)) {
         console.log(`ℹ️ Answer check returned ${err.response.status}: ${err.response.data.message}`);
      } else {
         console.error('❌ Answer check error:', err.message);
      }
    }
  } else {
    console.warn('⚠️ Skipping Exercise Check (no exercise found)');
  }

  // 3. Check General Exercise Answer (if found)
  if (generalExerciseId) {
    try {
        console.log(`\nChecking General Exercise Answer for ID ${generalExerciseId}...`);
        const genCheckRes = await client.post('/api/v1/lessons/check-general-exercise-answer', {
          general_exercise_id: generalExerciseId,
          answer: 'A'
        });
        if (genCheckRes.data.success) {
             console.log('✅ General Answer checked successfully:', genCheckRes.data.message);
        } else {
             console.log('❌ General Answer check failed (logic):', genCheckRes.data.message);
        }
    } catch (err) {
        if (err.response && (err.response.status === 400 || err.response.status === 422)) {
            console.log(`ℹ️ General Answer check returned ${err.response.status}: ${err.response.data.message}`);
         } else {
            console.error('❌ General Answer check error:', err.message);
         }
    }
  }

  // 4. Check Lesson Overview Completion
  if (lessonId) {
    try {
      console.log(`\nChecking Overview Completion for Lesson ${lessonId}...`);
      // Note: Endpoint format /api/v1/lessons/check/{type}/{lesson_id} based on doc logic, wait
      // Doc says: GET /api/v1/lessons/check/overview/{lesson_id}
      const completeRes = await client.get(`/api/v1/lessons/check/overview/${lessonId}`);
       if (completeRes.data.success) {
        console.log('✅ Overview completion checked.');
        console.log('Message:', completeRes.data.message);
      } else {
        console.error('❌ Overview completion check failed:', completeRes.data.message);
      }
    } catch (err) {
        console.error('❌ Overview completion check error:', err.message);
        if(err.response) console.error(err.response.data);
    }
  }
}

testAnsweringAndCompletion();
