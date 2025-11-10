/**
 * Type tests to ensure the SDK type system works correctly
 *
 * This file contains type assertions and examples to verify that:
 * 1. All types are properly exported
 * 2. Type inference works correctly
 * 3. Namespaces have proper typing
 * 4. Helper methods have correct signatures
 */

import {
    CodepostClient,
    createClient,
    Grading,
    Testing,
    type AppliedRubric,
    type ApplyRubricCommentParams,
    type BulkApplyRubricParams,
    type Comment,
    type GradingNamespace,
    type RubricComment,
    type TestingNamespace,
} from "../src/index";

// ==========================================
// Test 1: Client Creation
// ==========================================

const client = createClient({
    baseURL: "https://api.example.com",
    accessToken: "test-token",
});

// Verify client is properly typed
const _clientType: CodepostClient = client;

// ==========================================
// Test 2: Core Resources Are Accessible
// ==========================================

// Should have all core resource properties
const courses = client.courses;
const assignments = client.assignments;
const submissions = client.submissions;
const users = client.users;
const organizations = client.organizations;
const sections = client.sections;
const files = client.files;
const fileTemplates = client.fileTemplates;
const registration = client.registration;
const token = client.token;

// ==========================================
// Test 3: Grading Namespace Types
// ==========================================

// Grading namespace should be properly typed
const grading: GradingNamespace = client.grading;

// Should have rubric sub-namespace
const rubricCategories = client.grading.rubric.categories;
const rubricComments = client.grading.rubric.comments;

// Should have comments
const comments = client.grading.comments;

// Should have helper methods with correct signatures
const applyRubricComment: (params: ApplyRubricCommentParams) => Promise<Comment> = client.grading.applyRubricComment;

const bulkApplyRubric: (params: BulkApplyRubricParams) => Promise<Comment[]> = client.grading.bulkApplyRubric;

const getAppliedRubrics: (fileId: number) => Promise<AppliedRubric[]> = client.grading.getAppliedRubrics;

const getRubricStats: (assignmentId: number) => Promise<{
    totalRubricComments: number;
    totalApplications: number;
    mostUsed: Array<{ template: RubricComment; count: number }>;
}> = client.grading.getRubricStats;

// ==========================================
// Test 4: Testing Namespace Types
// ==========================================

// Testing namespace should be properly typed
const testing: TestingNamespace = client.testing;

// Should have categories and cases
const testCategories = client.testing.categories;
const testCases = client.testing.cases;

// ==========================================
// Test 5: Parameter Types
// ==========================================

// ApplyRubricCommentParams should work correctly
const applyParams: ApplyRubricCommentParams = {
    file: 123,
    rubricComment: 456,
    startLine: 10,
    endLine: 20,
    // Optional params
    startChar: 0,
    endChar: 100,
    customText: "Custom feedback",
};

// BulkApplyRubricParams should work correctly
const bulkParams: BulkApplyRubricParams = {
    files: [123, 456, 789],
    rubricComment: 999,
    startLine: 1,
    endLine: 1,
    // Optional params
    startChar: 0,
    endChar: 50,
};

// ==========================================
// Test 6: Return Types
// ==========================================

async function testReturnTypes() {
    // applyRubricComment should return Comment
    const comment: Comment = await client.grading.applyRubricComment(applyParams);

    // bulkApplyRubric should return Comment[]
    const commentsArray: Comment[] = await client.grading.bulkApplyRubric(bulkParams);

    // getAppliedRubrics should return AppliedRubric[]
    const appliedRubrics: AppliedRubric[] = await client.grading.getAppliedRubrics(123);

    // Each AppliedRubric should have comment and template
    for (const applied of appliedRubrics) {
        const _comment: Comment = applied.comment;
        const _template: RubricComment = applied.template;
    }

    // getRubricStats should return stats object
    const stats = await client.grading.getRubricStats(123);
    const _totalComments: number = stats.totalRubricComments;
    const _totalApps: number = stats.totalApplications;
    const _mostUsed: Array<{ template: RubricComment; count: number }> = stats.mostUsed;
}

// ==========================================
// Test 7: Resource Method Types
// ==========================================

async function testResourceMethods() {
    // Rubric categories should have CRUD operations
    const categories = await client.grading.rubric.categories.list();
    const category = await client.grading.rubric.categories.retrieve(123);
    const newCategory = await client.grading.rubric.categories.create({
        assignment: 456,
        name: "Code Quality",
        pointLimit: -30,
        rubricComments: [],
        sortKey: "0",
        helpText: "Test",
        atMostOnce: false,
    } as any);

    // Rubric comments should have CRUD operations
    const rubricCommentsList = await client.grading.rubric.comments.list();
    const rubricComment = await client.grading.rubric.comments.retrieve(123);

    // Comments should have CRUD operations
    const commentsList = await client.grading.comments.list();
    const singleComment = await client.grading.comments.retrieve(123);

    // Test categories should have CRUD operations
    const testCategoriesList = await client.testing.categories.list();
    const testCategory = await client.testing.categories.retrieve(123);

    // Test cases should have CRUD operations
    const testCasesList = await client.testing.cases.list();
    const testCase = await client.testing.cases.retrieve(123);
}

// ==========================================
// Test 8: Namespace Object Types
// ==========================================

// Grading and Testing should be importable as objects
const gradingObject: typeof Grading = Grading;
const testingObject: typeof Testing = Testing;

// Should be able to use them independently
async function useNamespaces() {
    const categories = await Grading.rubric.categories.list();
    const cases = await Testing.cases.list();
}

// ==========================================
// Test 9: Type Compatibility
// ==========================================

// Client grading should be compatible with Grading namespace
function acceptsGrading(grading: GradingNamespace) {
    // Can call methods
    grading.applyRubricComment;
    grading.bulkApplyRubric;
    grading.getAppliedRubrics;
    grading.getRubricStats;

    // Can access resources
    grading.comments;
    grading.rubric.categories;
    grading.rubric.comments;
}

acceptsGrading(client.grading);

// Client testing should be compatible with Testing namespace
function acceptsTesting(testing: TestingNamespace) {
    testing.categories;
    testing.cases;
}

acceptsTesting(client.testing);

// ==========================================
// Test 10: Generic Type Preservation
// ==========================================

// Resource operations should preserve types
async function testGenericTypes() {
    // Create operations should return the created type
    const createdComment: Comment = await client.grading.comments.create({
        file: 123,
        text: "Test",
        startLine: 1,
        endLine: 1,
        startChar: 0,
        endChar: 0,
        pointDelta: -5,
        rubricComment: null,
        author: "test@example.com",
        feedback: 0,
        color: null,
        tags: [],
        course: 456,
    } as any);

    // Retrieve operations return CommentSerializer | CommentBasic (API specific types)
    const retrievedComment = await client.grading.comments.retrieve(123);
    // Should have common properties
    const _text: string = retrievedComment.text;
    const _id: number = retrievedComment.id;

    // List operations should return arrays
    const commentsList: Comment[] = await client.grading.comments.list();
}

// ==========================================
// Success! All type tests pass
// ==========================================

export type {
    AppliedRubric,
    ApplyRubricCommentParams,
    BulkApplyRubricParams,
    // Re-export to verify types are available
    GradingNamespace,
    TestingNamespace,
};

console.log("✅ All type tests passed!");
