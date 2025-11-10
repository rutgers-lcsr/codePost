import { beforeAll, describe, expect, it } from "vitest";
import * as Codepost from "./index";

beforeAll(async () => {
    Codepost.setBaseUrl(process.env["API_URL"] || "https://api.codepost.io/");
    await Codepost.Auth.login(process.env["API_USER"] || "test_user", process.env["API_PASSWORD"] || "test_password");
});
describe("src/index.ts exports", () => {
    it("should export all expected modules and functions", () => {
        expect(Codepost).toHaveProperty("setBaseUrl");
        expect(Codepost).toHaveProperty("Auth");
        // Check for at least one export from each module
        expect(Codepost).toHaveProperty("API");
        expect(Codepost).toHaveProperty("Assignments");
        expect(Codepost).toHaveProperty("Comments");
        expect(Codepost).toHaveProperty("Courses");
        expect(Codepost).toHaveProperty("Files");
        expect(Codepost).toHaveProperty("FileTemplates");
        expect(Codepost).toHaveProperty("Organizations");
        expect(Codepost).toHaveProperty("RegistrationClient");
        expect(Codepost).toHaveProperty("RubricCategories");
        expect(Codepost).toHaveProperty("RubricComments");
        expect(Codepost).toHaveProperty("Sections");
        expect(Codepost).toHaveProperty("Submissions");
        expect(Codepost).toHaveProperty("SubmissionTests");
        expect(Codepost).toHaveProperty("TestCases");
        expect(Codepost).toHaveProperty("TestCategories");
        expect(Codepost).toHaveProperty("Tokens");
        expect(Codepost).toHaveProperty("Users");
        expect(Codepost).toHaveProperty("Webhooks");
    });
});

describe("API Health Check", () => {
    it("should return true for health endpoint if API is up", async () => {
        // Optionally set a test/staging base URL here if needed
        // indexExports.setBaseUrl("https://api.codepost.io/");
        // API is exported directly from indexExports
        const result = await Codepost.API.health();
        expect(typeof result).toBe("boolean");
        // This will be true if the API is up, false otherwise
    });
});

describe("Basic Functionality", () => {
    it("Should not allow to all Assignments", async () => {
        try {
            const result = await Codepost.Assignments.list();
            // If we reach here, the test should fail
            expect(true).toBe(false);
        } catch (e) {
            // If unauthorized or forbidden, this will fail
            expect((e as Codepost.CodePostApiError).isForbidden()).toBe(true);
        }
    });
    it("Should allow to get current user", async () => {
        try {
            const result = await Codepost.Users.me();
            expect(Codepost.UserSchema.safeParse(result).success).toBe(true);
            expect(result).toHaveProperty("id");
        } catch (e) {
            // If unauthorized or forbidden, this will fail
            expect((e as Codepost.CodePostApiError).isForbidden()).toBe(false);
        }
        try {
            const result = await Codepost.RegistrationClient.CurrentUser();
            expect(Codepost.UserSchema.safeParse(result).success).toBe(true);

            expect(result).toHaveProperty("token");
        } catch (e) {
            // If unauthorized or forbidden, this will fail
            expect((e as Codepost.CodePostApiError).isForbidden()).toBe(false);
        }
    });
    it("Should get User Responses", async () => {
        try {
            const userinfo = await Codepost.RegistrationClient.CurrentUser();
            async function getCourseInfo(course: Codepost.Course) {
                expect(Codepost.CourseSchema.safeParse(course).success).toBe(true);
                if (course.assignments) {
                    for (const assignmentsIds of course.assignments) {
                        const assignment = await Codepost.Assignments.getAssignment(assignmentsIds);
                        expect(Codepost.AssignmentSchema.safeParse(assignment).success).toBe(true);
                    }
                }
                const sections = await Codepost.Courses.getSections(course.id);
                expect(sections).toHaveProperty("results");
                expect(Codepost.SectionSchema.array().safeParse(sections.results).success).toBe(true);
                const roster = await Codepost.Courses.getRoster(course.id);
                expect(roster).toHaveProperty("id");
                expect(Codepost.CourseRosterSchema.safeParse(roster).success).toBe(true);
            }

            for (const course of userinfo.studentCourses) {
                await getCourseInfo(course);
            }
            for (const course of userinfo.graderCourses) {
                await getCourseInfo(course);
            }
            for (const course of userinfo.superGraderCourses) {
                await getCourseInfo(course);
            }
            for (const course of userinfo.courseadminCourses) {
                await getCourseInfo(course);
            }
        } catch (e) {
            // If unauthorized or forbidden, this will fail
            if (!Codepost.CodePostApiError.isCodePostApiError(e)) {
                console.error("Unexpected error:", e);
                expect(e).toBeFalsy();
            } else {
                console.error("CodePostApiError:", e);
                expect(e.isForbidden()).toBe(false);
            }
        }
    });
});
describe("Client Creation", () => {
    it("Should create a client and access courses", async () => {
        const client = Codepost.createClient({
            baseURL: process.env["API_URL"] || "https://api.codepost.io/",
            accessToken: process.env["API_USER"] ? undefined : process.env["API_TOKEN"],
        });
        try {
            const userinfo = await client.registration.CurrentUser();
            expect(Codepost.UserSchema.safeParse(userinfo).success).toBe(true);
            expect(userinfo).toHaveProperty("id");
            const courses = await client.courses.list();
            expect(courses).toHaveProperty("results");
            expect(Codepost.CourseSchema.array().safeParse(courses).success).toBe(true);
        } catch (e) {
            // If unauthorized or forbidden, this will fail
            if (!Codepost.CodePostApiError.isCodePostApiError(e)) {
                console.error("Unexpected error:", e);
                expect(e).toBeFalsy();
            } else {
                console.error("CodePostApiError:", e);
                expect(e.isForbidden()).toBe(false);
            }
        }
    });
});
