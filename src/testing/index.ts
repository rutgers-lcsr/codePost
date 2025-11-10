/**
 * @module Testing
 *
 * Organized testing/autograder functionality for CodePost.
 *
 * ## Structure
 *
 * - **categories**: Test categories (groups of test cases)
 * - **cases**: Individual test cases
 *
 * ## Workflow
 *
 * 1. **Setup**: Create test categories for an assignment
 * 2. **Define**: Add test cases to categories
 * 3. **Run**: Execute tests via autograder (submission tests)
 *
 * @example
 * ```typescript
 * // 1. Create test category
 * const category = await client.testing.categories.create({
 *   assignment: assignmentId,
 *   name: "Unit Tests"
 * });
 *
 * // 2. Add test case
 * const testCase = await client.testing.cases.create({
 *   testCategory: category.id,
 *   description: "Test linked list reversal",
 *   type: "unit"
 * });
 * ```
 */

import * as TestCases from "../testCases/client";
import * as TestCategories from "../testCategories/client";

/**
 * Testing namespace providing organized access to test categories and test cases
 */
export const Testing = {
    /**
     * Test category operations
     *
     * Test categories group related test cases together.
     * Each assignment can have multiple test categories.
     */
    categories: TestCategories.TestCategories,

    /**
     * Test case operations
     *
     * Test cases are individual tests that belong to a category.
     * They can be of various types: unit, io, io_cli, shell, file, or external.
     */
    cases: TestCases.TestCases,
};

/**
 * Type definition for the Testing namespace
 */
export type TestingNamespace = typeof Testing;

export default Testing;
