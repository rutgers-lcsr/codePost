/**
 * @module Grading
 *
 * Organized grading functionality for CodePost.
 *
 * ## Structure
 *
 * - **rubric**: Template management (categories and comments)
 * - **comments**: Actual feedback on student files
 * - **helpers**: Convenience methods for common grading tasks
 *
 * ## Workflow
 *
 * 1. **Setup**: Create rubric categories and comment templates
 * 2. **Grade**: Apply templates or create custom comments on student files
 * 3. **Finalize**: Update submission grades
 *
 * @example
 * ```typescript
 * // 1. Setup rubric
 * const category = await client.grading.rubric.categories.create({
 *   assignment: assignmentId,
 *   name: "Code Quality"
 * });
 *
 * const template = await client.grading.rubric.comments.create({
 *   category: category.id,
 *   text: "Missing error handling",
 *   pointDelta: -10
 * });
 *
 * // 2. Grade submission
 * await client.grading.applyRubricComment({
 *   file: fileId,
 *   rubricComment: template.id,
 *   startLine: 42,
 *   endLine: 50
 * });
 * ```
 */

import type { Comment } from "../comments";
import * as Comments from "../comments/client";
import * as RubricCategories from "../rubricCategories/client";
import type { RubricComment } from "../rubricComments";
import * as RubricComments from "../rubricComments/client";

/**
 * Parameters for applying a rubric comment template to a file location
 */
export interface ApplyRubricCommentParams {
    /** The file to comment on */
    file: number;
    /** The rubric comment template to apply */
    rubricComment: number;
    /** Starting line number */
    startLine: number;
    /** Ending line number */
    endLine: number;
    /** Starting character position (optional, defaults to 0) */
    startChar?: number;
    /** Ending character position (optional, defaults to end of line) */
    endChar?: number;
    /** Custom text to override template text (optional) */
    customText?: string;
}

/**
 * Parameters for bulk applying a rubric comment to multiple files
 */
export interface BulkApplyRubricParams {
    /** Files to apply the rubric comment to */
    files: number[];
    /** The rubric comment template to apply */
    rubricComment: number;
    /** Starting line number */
    startLine: number;
    /** Ending line number */
    endLine: number;
    /** Starting character position (optional) */
    startChar?: number;
    /** Ending character position (optional) */
    endChar?: number;
}

/**
 * Result of applying a rubric comment, including both the comment and template
 */
export interface AppliedRubric {
    /** The created comment instance */
    comment: Comment;
    /** The rubric comment template that was used */
    template: RubricComment;
}

/**
 * Grading namespace providing organized access to rubric templates and feedback comments
 */
export const Grading = {
    /**
     * Rubric template management
     */
    rubric: {
        /** Rubric category operations */
        categories: RubricCategories.RubricCategories,
        /** Rubric comment template operations */
        comments: RubricComments.RubricComments,
    },

    /**
     * Comment operations for actual feedback on files
     */
    comments: Comments.Comments,

    /**
     * Apply a rubric comment template to a specific file location
     *
     * This creates a new comment linked to a rubric template. The comment will
     * automatically inherit the pointDelta from the template.
     *
     * @param params - Parameters for applying the rubric comment
     * @returns The created comment
     *
     * @example
     * ```typescript
     * const comment = await client.grading.applyRubricComment({
     *   file: 123,
     *   rubricComment: 456,
     *   startLine: 10,
     *   endLine: 15
     * });
     * ```
     */
    async applyRubricComment(params: ApplyRubricCommentParams): Promise<Comment> {
        // Fetch the rubric comment template to get its details
        const template = await RubricComments.RubricComments.retrieve(params.rubricComment);

        // Create a comment linked to the rubric template
        // Note: The API will handle pointDelta, author, and other fields automatically
        return Comments.Comments.create({
            file: params.file,
            rubricComment: params.rubricComment,
            text: params.customText || template.text,
            startLine: params.startLine,
            endLine: params.endLine,
            startChar: params.startChar ?? 0,
            endChar: params.endChar ?? 0,
            pointDelta: null, // Let rubricComment handle the points
            author: "", // API will set from auth
            feedback: 0,
            color: null,
            tags: [],
            course: 0, // API will set from file
        } as any);
    },

    /**
     * Apply a rubric comment template to multiple files at once
     *
     * @param params - Parameters for bulk applying
     * @returns Array of created comments
     *
     * @example
     * ```typescript
     * const comments = await client.grading.bulkApplyRubric({
     *   files: [123, 124, 125],
     *   rubricComment: 456,
     *   startLine: 1,
     *   endLine: 1
     * });
     * ```
     */
    async bulkApplyRubric(params: BulkApplyRubricParams): Promise<Comment[]> {
        const template = await RubricComments.RubricComments.retrieve(params.rubricComment);

        const promises = params.files.map((fileId) =>
            Comments.Comments.create({
                file: fileId,
                rubricComment: params.rubricComment,
                text: template.text,
                startLine: params.startLine,
                endLine: params.endLine,
                startChar: params.startChar ?? 0,
                endChar: params.endChar ?? 0,
                pointDelta: null,
                author: "",
                feedback: 0,
                color: null,
                tags: [],
                course: 0,
            } as any)
        );

        return Promise.all(promises);
    },

    /**
     * Get all comments on a file that are linked to rubric templates
     *
     * Note: This method fetches all comments and filters client-side.
     * For better performance, use the Files API to get comments directly.
     *
     * @param fileId - The file to query
     * @returns Array of comments with their linked templates
     *
     * @example
     * ```typescript
     * const appliedRubrics = await client.grading.getAppliedRubrics(fileId);
     * for (const { comment, template } of appliedRubrics) {
     *   console.log(`Applied "${template.text}" at line ${comment.startLine}`);
     * }
     * ```
     */
    async getAppliedRubrics(fileId: number): Promise<AppliedRubric[]> {
        // Get all comments and filter to those for this file
        const allComments = await Comments.Comments.list();
        const comments = allComments.filter((c) => c.file === fileId);

        // Filter to only comments linked to rubric templates
        const rubricComments = comments.filter((c) => c.rubricComment != null);

        // Fetch the template details for each
        const appliedRubrics = await Promise.all(
            rubricComments.map(async (comment) => {
                const template = await RubricComments.RubricComments.retrieve(comment.rubricComment!);
                return { comment, template };
            })
        );

        return appliedRubrics;
    },

    /**
     * Get rubric usage statistics for an assignment
     *
     * This provides insights into which rubric comments are most commonly used.
     * Note: This method uses the RubricComments.getComments() API which returns
     * usage information for each template.
     *
     * @param assignmentId - The assignment to analyze
     * @returns Statistics about rubric comment usage
     *
     * @example
     * ```typescript
     * const stats = await client.grading.getRubricStats(assignmentId);
     * console.log(`Total templates: ${stats.totalRubricComments}`);
     * console.log(`Total applications: ${stats.totalApplications}`);
     * ```
     */
    async getRubricStats(assignmentId: number): Promise<{
        totalRubricComments: number;
        totalApplications: number;
        mostUsed: Array<{ template: RubricComment; count: number }>;
    }> {
        // Get all rubric categories and comments, then filter by assignment
        const allCategories = await RubricCategories.RubricCategories.list();
        const categories = allCategories.filter((cat) => cat.assignment === assignmentId);

        const allRubricComments = await RubricComments.RubricComments.list();
        const assignmentRubricComments = allRubricComments.filter((rc) => categories.some((cat) => cat.id === rc.category));

        // Get usage count for each rubric comment
        const usageCounts = await Promise.all(
            assignmentRubricComments.map(async (template) => {
                try {
                    // Use the API's getComments method to get usage
                    const commentsData = await RubricComments.RubricComments.getComments(template.id);
                    return { template, count: commentsData.comments?.length || 0 };
                } catch {
                    return { template, count: 0 };
                }
            })
        );

        // Sort by usage
        const mostUsed = usageCounts.sort((a, b) => b.count - a.count);

        return {
            totalRubricComments: assignmentRubricComments.length,
            totalApplications: usageCounts.reduce((sum, { count }) => sum + count, 0),
            mostUsed,
        };
    },
};

/**
 * Type definition for the Grading namespace
 */
export type GradingNamespace = typeof Grading;

export default Grading;
