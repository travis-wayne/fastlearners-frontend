const { getApiClient } = require("./api-client");

async function runCourseFlow() {
  const { client } = getApiClient();

  console.log(`\n🚀 STARTING FULL COURSE FLOW for Physics...\n`);

  try {
    // 0. Fetch Topics for Subject
    const subjectSlug = "physics";
    console.log(`[0] Fetching Topics for ${subjectSlug}...`);
    const topicsRes = await client.get(`/api/v1/lessons/${subjectSlug}`);
    if (!topicsRes.data.success)
      throw new Error(`Failed to fetch topics for ${subjectSlug}`);

    // Find first available topic
    const topics = topicsRes.data.content.topics;
    let topicSlug = null;
    if (topics.first_term && topics.first_term.length > 0)
      topicSlug = topics.first_term[0].slug;
    else if (topics.second_term && topics.second_term.length > 0)
      topicSlug = topics.second_term[0].slug;
    else if (topics.third_term && topics.third_term.length > 0)
      topicSlug = topics.third_term[0].slug;

    if (!topicSlug) throw new Error("No topics found for Physics");
    console.log(`✅ Selected Topic: ${topicSlug}`);

    // 1. Fetch Lesson Content
    console.log(`[1] Fetching Lesson Content...`);
    const contentRes = await client.get(
      `/api/v1/lessons/${subjectSlug}/${topicSlug}/content`,
    );

    if (!contentRes.data.success) {
      throw new Error(`Failed to fetch content: ${contentRes.data.message}`);
    }

    const lesson = contentRes.data.content.lesson;
    const lessonId = lesson.id;
    console.log(`✅ Lesson ID: ${lessonId} | Title: ${lesson.topic}`);
    console.log(
      `   Concepts: ${lesson.concepts.length} | General Exercises: ${lesson.general_exercises.length}`,
    );

    // Helper to log score
    const logScore = async (label, endpoint) => {
      try {
        const res = await client.get(endpoint);
        if (res.data.success) {
          const c = res.data.content;
          console.log(
            `   📊 ${label} Score: ${c.total_score || c.lesson_total_score || c.subject_total_score} (Weight: ${c.weight || "N/A"})`,
          );
        }
      } catch (e) {
        console.log(`   🔸 ${label} score unavailable yet.`);
      }
    };

    // 2. Mark Overview as Complete
    console.log(`\n[2] Completing Overview...`);
    await client.get(`/api/v1/lessons/check/overview/${lessonId}`); // Docs say GET for checks
    console.log(`✅ Overview Checked.`);

    // 3. Process Concepts
    console.log(`\n[3] Processing Concepts...`);
    for (let i = 0; i < lesson.concepts.length; i++) {
      const concept = lesson.concepts[i];
      console.log(
        `   👉 Concept ${i + 1}: ${concept.title} (ID: ${concept.id})`,
      );

      // 3a. Answer Exercises in Concept
      if (concept.exercises && concept.exercises.length > 0) {
        console.log(`      Found ${concept.exercises.length} Exercises.`);
        for (const ex of concept.exercises) {
          // Try answering 'A' (Simulating user input)
          const ans = "A";
          try {
            const ansRes = await client.post(
              "/api/v1/lessons/check-exercise-answer",
              {
                exercise_id: ex.id,
                answer: ans,
              },
            );
            const result = ansRes.data.success ? "Correct/Answered" : "Wrong";
            console.log(
              `      📝 Ex ${ex.id}: Submitted '${ans}' -> ${result} (${ansRes.data.message})`,
            );
          } catch (e) {
            const msg = e.response ? e.response.data.message : e.message;
            console.log(`      ⚠️ Ex ${ex.id} Error: ${msg}`);
          }
        }
      }

      // 3b. Mark Concept as Complete
      try {
        await client.get(
          `/api/v1/lessons/check/concept/${lessonId}/${concept.id}`,
        );
        console.log(`      ✅ Marked Complete.`);
      } catch (e) {
        console.log(
          `      ❌ Failed to mark complete: ${e.response?.data?.message}`,
        );
      }

      // 3c. Check Concept Score
      await logScore(
        `Concept ${concept.id}`,
        `/api/v1/lessons/scores/concepts/${concept.id}`,
      );
    }

    // 4. Summary & Application
    console.log(`\n[4] Completing Summary & Application...`);
    try {
      await client.get(
        `/api/v1/lessons/check/summary-and-application/${lessonId}`,
      );
      console.log(`✅ Summary & Application Checked.`);
    } catch (e) {
      console.log(`❌ Failed summary check: ${e.message}`);
    }

    // 5. General Exercises
    console.log(`\n[5] Processing General Exercises...`);
    if (lesson.general_exercises && lesson.general_exercises.length > 0) {
      for (const genEx of lesson.general_exercises) {
        const ans = "C"; // Trying a different answer
        try {
          const ansRes = await client.post(
            "/api/v1/lessons/check-general-exercise-answer",
            {
              general_exercise_id: genEx.id,
              answer: ans,
            },
          );
          const result = ansRes.data.success ? "Correct/Answered" : "Wrong";
          console.log(
            `   📝 Gen Ex ${genEx.id}: Submitted '${ans}' -> ${result} (${ansRes.data.message})`,
          );
        } catch (e) {
          const msg = e.response ? e.response.data.message : e.message;
          console.log(`   ⚠️ Gen Ex ${genEx.id} Error: ${msg}`);
        }
      }
    }

    // 6. Complete Lesson (General Exercises Check)
    console.log(`\n[6] Completing General Exercises Section...`);
    try {
      await client.get(`/api/v1/lessons/check/general-exercises/${lessonId}`);
      console.log(`✅ General Exercises Section Checked.`);
    } catch (e) {
      console.log(`❌ Failed general check: ${e.message}`);
    }

    // 7. Final Verification
    console.log(`\n[7] Final Score Verification...`);
    await logScore(
      "Total Lesson",
      `/api/v1/lessons/scores/lessons/${lessonId}`,
    ); // Using verified plural endpoint

    console.log(`\n🎉 COURSE FLOW COMPLETE!`);
  } catch (err) {
    console.error(`\n❌ FLOW FAILED: ${err.message}`);
    if (err.response) {
      console.log("Context:", JSON.stringify(err.response.data, null, 2));
    }
  }
}

runCourseFlow();
