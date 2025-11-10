// Core API
export * from "./api";
export * from "./auth";
export { CodepostClient, createClient } from "./client";
export { setBaseUrl } from "./http";

// Resource modules
export * from "./assignments";
export * from "./courses";
export * from "./execution";
export * from "./files";
export * from "./fileTemplates";
export * from "./organizations";
export * from "./registration";
export * from "./sections";
export * from "./submissions";
export * from "./submissionTests";
export * from "./token";
export * from "./users";
export * from "./webhooks";

// Grading resources (also available via client.grading namespace)
export * from "./comments";
export * from "./rubricCategories";
export * from "./rubricComments";

// Testing resources (also available via client.testing namespace)
export * from "./testCases";
export * from "./testCategories";

// Organized namespaces (recommended)
export { Grading } from "./grading";
export { Testing } from "./testing";

// Export types from namespaces for external use
export type { AppliedRubric, ApplyRubricCommentParams, BulkApplyRubricParams, GradingNamespace } from "./grading";

export type { TestingNamespace } from "./testing";
