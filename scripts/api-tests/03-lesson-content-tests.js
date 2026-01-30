
const { getApiClient } = require('./api-client');

async function testLessonContent() {
  const { client } = getApiClient();
  let subjectSlug = '';
  let topicSlug = '';
  
  console.log('--- Testing Lesson Content Endpoints ---');

  // 0. Check User Class/Term
  try {
     const profileRes = await client.get('/api/v1/profile');
     const user = profileRes.data.content.user;
     console.log(`User Class: ${user.class}, Term: ${user.term || 'N/A'}`); // Term might not be in profile, checking just in case
  } catch (e) { console.log('Could not fetch profile for debug'); }

  let subjects = [];

  // 1. Get Subjects with Slugs (GET /api/v1/lessons/)
  try {
    console.log('\nFetching Subjects with Slugs (GET /api/v1/lessons/)...');
    const subjectsRes = await client.get('/api/v1/lessons/');
    if (subjectsRes.data.success) {
      console.log('✅ Subjects fetched successfully.');
      subjects = subjectsRes.data.content.subjects || [];
      console.log('Available Subjects:', subjects.map(s => `${s.name} (${s.slug})`).join(', '));
      if (subjects.length > 0) {
        subjectSlug = subjects[0].slug;
        console.log(`Selected Subject: ${subjects[0].name}, Slug: ${subjectSlug}`);
      } else {
        console.warn('⚠️ No subjects found.');
        return; 
      }
    } else {
      console.error('❌ Failed to fetch subjects:', subjectsRes.data.message);
      return;
    }
  } catch (err) {
    console.error('❌ Error fetching subjects:', err.message);
    if(err.response) console.error(err.response.data);
    return;
  }

  // 2. Get Topics for the Subject (Try all subjects until one works)
  try {
    // const subjects = subjectsRes.data.content.subjects || []; // Removed
    let topicsFound = false;

    for (const sub of subjects) {
        console.log(`\nProbings Topics for ${sub.name} (${sub.slug})...`);
        try {
            const topicsRes = await client.get(`/api/v1/lessons/${sub.slug}`);
            if (topicsRes.data.success) {
                console.log(`✅ Topics found for ${sub.slug}.`);
                const topics = topicsRes.data.content.topics;
                
                // Determine first topic
                let firstTopic = null;
                if (topics.first_term && topics.first_term.length > 0) firstTopic = topics.first_term[0];
                else if (topics.second_term && topics.second_term.length > 0) firstTopic = topics.second_term[0];
                else if (topics.third_term && topics.third_term.length > 0) firstTopic = topics.third_term[0];

                if (firstTopic) {
                    subjectSlug = sub.slug;
                    topicSlug = firstTopic.slug;
                    console.log(`Selected Topic: ${firstTopic.topic}, Slug: ${topicSlug}`);
                    topicsFound = true;
                    break; // Stop looking
                } else {
                    console.log(`⚠️ No topics in any term for ${sub.slug}.`);
                }
            }
        } catch (e) {
            console.log(`❌ Failed for ${sub.slug}: ${e.response ? e.response.data.message : e.message}`);
        }
    }

    if (!topicsFound) {
        console.error('❌ Could not find topics for any subject.');
        return;
    }

  } catch (err) {
    console.error('❌ Error in topic iteration:', err.message);
    return;
  }

  // 3. Get Topic Overview
  try {
    console.log(`\nFetching Overview for ${topicSlug} (GET /api/v1/lessons/${subjectSlug}/${topicSlug}/overview)...`);
    const overviewRes = await client.get(`/api/v1/lessons/${subjectSlug}/${topicSlug}/overview`);
    if (overviewRes.data.success) {
      console.log('✅ Overview fetched successfully.');
      console.log('Overview:', JSON.stringify(overviewRes.data.content.overview, null, 2));
    } else {
      console.error('❌ Failed to fetch overview:', overviewRes.data.message);
    }
  } catch (err) {
    console.error('❌ Error fetching overview:', err.message);
    if(err.response) console.error(err.response.data);
  }

  // 4. Get Lesson Content
  try {
    console.log(`\nFetching Content for ${topicSlug} (GET /api/v1/lessons/${subjectSlug}/${topicSlug}/content)...`);
    const contentRes = await client.get(`/api/v1/lessons/${subjectSlug}/${topicSlug}/content`);
    if (contentRes.data.success) {
      console.log('✅ Content fetched successfully.');
      const lesson = contentRes.data.content.lesson;
      console.log(`Lesson ID: ${lesson.id}`);
      console.log(`Concepts count: ${lesson.concepts ? lesson.concepts.length : 0}`);
      if(lesson.concepts && lesson.concepts.length > 0) {
          console.log('First Concept Title:', lesson.concepts[0].title);
      }
    } else {
      console.error('❌ Failed to fetch content:', contentRes.data.message);
    }
  } catch (err) {
    console.error('❌ Error fetching content:', err.message);
     if(err.response) console.error(err.response.data);
  }
}

testLessonContent();
