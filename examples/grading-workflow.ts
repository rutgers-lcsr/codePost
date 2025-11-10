/**
 * Example: Using the New SDK Organization
 *
 * This example demonstrates the new grading namespace and helper methods.
 */

import { createClient } from "../src/client";

async function main() {
    // === SETUP ===
    const client = createClient({
        baseURL: "https://codepost-api.cs.rutgers.edu",
        accessToken: "your-api-key",
    });

    const courseId = 123;
    const assignmentId = 456;

    // === 1. CREATE RUBRIC STRUCTURE ===
    console.log("📝 Setting up rubric...");

    // Create rubric categories
    const codeQuality = await client.grading.rubric.categories.create({
        assignment: assignmentId,
        name: "Code Quality",
        pointLimit: -30,
        rubricComments: [],
        sortKey: "0",
        helpText: "Deductions for code style and best practices",
        atMostOnce: false,
    } as any);

    const correctness = await client.grading.rubric.categories.create({
        assignment: assignmentId,
        name: "Correctness",
        pointLimit: -50,
        rubricComments: [],
        sortKey: "1",
        helpText: "Deductions for incorrect behavior",
        atMostOnce: false,
    } as any);

    // Create rubric comment templates
    const missingErrorHandling = await client.grading.rubric.comments.create({
        category: correctness.id,
        text: "Missing error handling",
        explanation: "Your code should handle potential errors gracefully",
        instructionText: "Describe which error cases are missing",
        templateTextOn: true,
        pointDelta: -10,
        name: "No Error Handling",
        sortKey: "0",
    } as any);

    const poorNaming = await client.grading.rubric.comments.create({
        category: codeQuality.id,
        text: "Variable names are not descriptive",
        explanation: "Use meaningful names that describe the purpose",
        pointDelta: -5,
        name: "Poor Naming",
        sortKey: "0",
    } as any);

    console.log("✅ Rubric created with", 2, "categories and", 2, "templates");

    // === 2. GRADE SUBMISSIONS ===
    console.log("\n📊 Grading submissions...");

    // Get all submissions for the assignment
    const submissions = await client.submissions.list();
    const assignmentSubmissions = submissions.filter((s) => s.assignment === assignmentId);

    for (const submission of assignmentSubmissions.slice(0, 3)) {
        // Just first 3 for demo
        console.log(`\nGrading submission ${submission.id}...`);

        // Get the files for this submission
        const allFiles = await client.files.list();
        const files = allFiles.filter((f) => f.submission === submission.id);
        const mainFile = files.find((f) => f.name.includes("Main")) || files[0];

        if (!mainFile) {
            console.log("  ⚠️ No files found");
            continue;
        }

        // Apply rubric template comments using the helper
        await client.grading.applyRubricComment({
            file: mainFile.id,
            rubricComment: missingErrorHandling.id,
            startLine: 42,
            endLine: 50,
            customText: "Missing error handling for null input",
        });

        await client.grading.applyRubricComment({
            file: mainFile.id,
            rubricComment: poorNaming.id,
            startLine: 10,
            endLine: 15,
        });

        // Add a custom comment (not from template)
        await client.grading.comments.create({
            file: mainFile.id,
            text: "Great implementation of the algorithm!",
            startLine: 100,
            endLine: 120,
            startChar: 0,
            endChar: 0,
            pointDelta: 5, // Bonus points
            rubricComment: null,
            author: "", // API will fill this
            feedback: 0,
            color: null,
            tags: [],
            course: courseId,
        });

        console.log("  ✅ Applied 2 rubric comments + 1 custom comment");

        // Finalize the submission
        await client.submissions.partial_update(submission.id, {
            isFinalized: true,
        });
    }

    // === 3. BULK OPERATIONS ===
    console.log("\n🔄 Bulk operations...");

    // Find all submissions with a common issue
    const allSubmissions = await client.submissions.list();
    const needsWarning = allSubmissions.filter((s) => s.assignment === assignmentId).filter((s) => !s.isFinalized);

    if (needsWarning.length > 0) {
        // Get all their main files
        const allFiles = await client.files.list();
        const mainFileIds = needsWarning
            .map((sub) => {
                const files = allFiles.filter((f) => f.submission === sub.id);
                return files.find((f) => f.name.includes("Main"))?.id;
            })
            .filter(Boolean) as number[];

        // Bulk apply a warning
        await client.grading.bulkApplyRubric({
            files: mainFileIds,
            rubricComment: missingErrorHandling.id,
            startLine: 1,
            endLine: 1,
        });

        console.log(`✅ Applied warning to ${mainFileIds.length} submissions`);
    }

    // === 4. ANALYZE RUBRIC USAGE ===
    console.log("\n📈 Analyzing rubric usage...");

    const stats = await client.grading.getRubricStats(assignmentId);
    console.log(`Total rubric templates: ${stats.totalRubricComments}`);
    console.log(`Total applications: ${stats.totalApplications}`);

    if (stats.mostUsed.length > 0) {
        const topTemplate = stats.mostUsed[0];
        console.log(`Most used: "${topTemplate.template.text}" (${topTemplate.count} times)`);
    }

    // === 5. GET APPLIED RUBRICS FOR A FILE ===
    console.log("\n🔍 Getting applied rubrics...");

    const firstSubmission = assignmentSubmissions[0];
    if (firstSubmission) {
        const allFiles = await client.files.list();
        const files = allFiles.filter((f) => f.submission === firstSubmission.id);
        const file = files[0];

        if (file) {
            const appliedRubrics = await client.grading.getAppliedRubrics(file.id);
            console.log(`File ${file.name} has ${appliedRubrics.length} rubric comments:`);

            for (const { comment, template } of appliedRubrics) {
                console.log(`  - "${template.text}" at line ${comment.startLine} (${template.pointDelta} pts)`);
            }
        }
    }

    console.log("\n✨ Done!");
}

// === COMPARISON: OLD VS NEW ===

async function oldWay(client: any) {
    // OLD WAY (still works, but verbose)
    const template = await client.rubricsComments.retrieve(123); // confusing spelling
    await client.comments.create({
        file: 456,
        rubricComment: 123,
        text: template.text,
        startLine: 10,
        endLine: 15,
        startChar: 0,
        endChar: 0,
        pointDelta: null,
        author: "",
        feedback: 0,
        color: null,
        tags: [],
        course: 789,
    });
}

async function newWay(client: any) {
    // NEW WAY (clean and simple)
    await client.grading.applyRubricComment({
        file: 456,
        rubricComment: 123,
        startLine: 10,
        endLine: 15,
    });
}

// === BACKWARD COMPATIBILITY ===

async function backwardCompatibility(client: any) {
    // Both of these work!

    // Old way (with deprecation warning)
    await client.rubricsComments.list();

    // New way (recommended)
    await client.grading.rubric.comments.list();

    // The deprecation warning will say:
    // ⚠️ Deprecation Warning: client.rubricsComments.list is deprecated.
    //    Please use client.grading.rubric.comments.list instead.
    //    See migration guide: https://github.com/codepost-io/codepost-sdk/blob/main/MIGRATION.md
}

// Run the example
if (require.main === module) {
    main().catch(console.error);
}

export { backwardCompatibility, main, newWay, oldWay };
