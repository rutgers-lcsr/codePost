import * as Codepost from "./index";
import { SubmissionTests } from "./submissionTests/client";
import { describe, it, expect, beforeAll } from "vitest";
beforeAll(async () => {
    Codepost.setBaseUrl(process.env['API_URL'] || "https://api.codepost.io/");
    await Codepost.Auth.login(process.env['API_USER'] || "test_user", process.env['API_PASSWORD'] || "test_password")

})
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

describe("Assignments integration", () => {
    it("should list assignments (integration)", async () => {
        // This will likely require authentication and/or a valid API key
        // Uncomment and set up authentication if needed
        // indexExports.setToken("YOUR_TOKEN");
        try {
            const result = await Codepost.Assignments.list();

            expect(result).toHaveProperty("results");
            expect(Array.isArray(result.results)).toBe(true);
        } catch (e) {
            // If unauthorized or forbidden, this will fail
            console.log(e)
            expect(e).toBeFalsy();
        }
    });
});

describe("Comments integration", () => {
    it("should list comments (integration)", async () => {
        try {
            const result = await Codepost.Comments.list();
            expect(Array.isArray(result)).toBe(true);
        } catch (e) {
            expect(e).toBeFalsy();
        }
    });
});

describe("Courses integration", () => {
    it("should list courses (integration)", async () => {
        try {
            const result = await Codepost.Courses.list();
            expect(Array.isArray(result)).toBe(true);
        } catch (e) {
            expect(e).toBeFalsy();
        }
    });
});

describe("Files integration", () => {
    it("should list files (integration)", async () => {
        try {
            const result = await Codepost.Files.list();
            expect(Array.isArray(result)).toBe(true);

        } catch (e) {
            expect(e).toBeFalsy();
        }
    });
});

describe("Users integration", () => {
    it("should list users (integration)", async () => {
        try {
            const result = await Codepost.Users.list();
            expect(result).toHaveProperty("results");
            expect(Array.isArray(result.results)).toBe(true);
        } catch (e) {
            expect(e).toBeFalsy();
        }
    });
});

describe("FileTemplates integration", () => {
    it("should list file templates (integration)", async () => {
        try {
            const result = await Codepost.FileTemplates.list();
            expect(Array.isArray(result)).toBe(true);

        } catch (e) {
            expect(e).toBeFalsy();
        }
    });
});

describe("Organizations integration", () => {
    it("should list organizations (integration)", async () => {
        try {
            const result = await Codepost.Organizations.list();
            expect(result).toHaveProperty("results");
            expect(Array.isArray(result.results)).toBe(true);
        } catch (e) {
            expect(e).toBeFalsy();
        }
    });
});

describe("Registration integration", () => {
    it("should get current user (integration)", async () => {
        try {
            const result = await Codepost.RegistrationClient.CurrentUser();
            expect(result).toHaveProperty("token");
        } catch (e) {
            expect(e).toBeFalsy();
        }
    });
});

describe("RubricCategories integration", () => {
    it("should list rubric categories (integration)", async () => {
        try {
            const result = await Codepost.RubricCategories.list();
            expect(Array.isArray(result)).toBe(true);

        } catch (e) {
            expect(e).toBeFalsy();
        }
    });
});

describe("RubricComments integration", () => {
    it("should list rubric comments (integration)", async () => {
        try {
            const result = await Codepost.RubricComments.list();
            expect(Array.isArray(result)).toBe(true);

        } catch (e) {
            expect(e).toBeFalsy();
        }
    });
});

describe("Sections integration", () => {
    it("should list sections (integration)", async () => {
        try {
            const result = await Codepost.Sections.list();
            expect(Array.isArray(result)).toBe(true);

        } catch (e) {
            expect(e).toBeFalsy();
        }
    });
});

describe("Submissions integration", () => {
    it("should list submissions (integration)", async () => {
        try {
            const result = await Codepost.Submissions.list();
            expect(Array.isArray(result)).toBe(true);

        } catch (e) {
            expect(e).toBeFalsy();
        }
    });
});

describe("SubmissionTests integration", () => {
    it("should list submission tests (integration)", async () => {
        try {
            const result = await SubmissionTests.list();
            expect(Array.isArray(result)).toBe(true);

        } catch (e) {
            expect(e).toBeFalsy();
        }
    });
});

describe("TestCases integration", () => {
    it("should list test cases (integration)", async () => {
        try {
            const result = await Codepost.TestCases.list();
            expect(result).toHaveProperty("results");
            expect(Array.isArray(result.results)).toBe(true);
        } catch (e) {
            expect(e).toBeFalsy();
        }
    });
});

describe("TestCategories integration", () => {
    it("should list test categories (integration)", async () => {
        try {
            const result = await Codepost.TestCategories.list();
            expect(Array.isArray(result)).toBe(true);

        } catch (e) {
            expect(e).toBeFalsy();
        }
    });
});

describe("Token integration", () => {
    it("should fail to refresh token without credentials (integration)", async () => {
        try {
            await Codepost.Tokens.refresh("invalid_refresh_token");
            // Should not reach here
            expect(true).toBe(false);
        } catch (e) {
            expect(e).toBeTruthy();
        }
    });
});

describe("Webhooks integration", () => {
    it("should list webhooks (integration)", async () => {
        try {
            const result = await Codepost.Webhooks.list();
            expect(Array.isArray(result)).toBe(true);

        } catch (e) {
            expect(e).toBeFalsy();
        }
    });
});

describe("Assignments full integration", () => {
    it("should list assignments", async () => {
        const result = await Codepost.Assignments.list();
        expect(result).toHaveProperty("results");
    });
    it.skip("should get assignment by id", async () => {
        // TODO: Provide a real assignmentId
        const assignmentId = 1;
        const result = await Codepost.Assignments.getAssignment(assignmentId);
        expect(result).toHaveProperty("id");
    });
    it.skip("should get comments for assignment", async () => {
        // TODO: Provide a real assignmentId
        const assignmentId = 1;
        const result = await Codepost.Assignments.getComments(assignmentId);
        expect(result).toBeDefined();
    });
    it.skip("should get queue length for assignment", async () => {
        // TODO: Provide a real assignmentId
        const assignmentId = 1;
        const result = await Codepost.Assignments.getQueueLength(assignmentId);
        expect(result).toBeDefined();
    });
    it.skip("should get rubric for assignment", async () => {
        // TODO: Provide a real assignmentId
        const assignmentId = 1;
        const result = await Codepost.Assignments.getRubric(assignmentId);
        expect(result).toBeDefined();
    });
    it.skip("should get next unassigned submission", async () => {
        // TODO: Provide a real assignmentId and section
        const assignmentId = 1;
        const section = "A";
        const result = await Codepost.Assignments.getNextUnassigned(assignmentId, section);
        expect(result).toBeDefined();
    });
    it.skip("should list submissions for assignment", async () => {
        // TODO: Provide a real assignmentId
        const assignmentId = 1;
        const result = await Codepost.Assignments.listSubmissions(assignmentId);
        expect(Array.isArray(result)).toBe(true);
    });
    it.skip("should get submission histories for assignment", async () => {
        // TODO: Provide a real assignmentId
        const assignmentId = 1;
        const result = await Codepost.Assignments.getSubmissionHistories(assignmentId);
        expect(Array.isArray(result)).toBe(true);
    });
    it.skip("should get tests for assignment", async () => {
        // TODO: Provide a real assignmentId
        const assignmentId = 1;
        const result = await Codepost.Assignments.getTests(assignmentId);
        expect(result).toBeDefined();
    });
    it.skip("should get assignment info", async () => {
        // TODO: Provide a real assignmentId
        const assignmentId = 1;
        const result = await Codepost.Assignments.getAssignmentInfo(assignmentId);
        expect(result).toBeDefined();
    });
    it.skip("should get submission files for assignment", async () => {
        // TODO: Provide a real assignmentId
        const assignmentId = 1;
        const result = await Codepost.Assignments.getSubmissionFiles(assignmentId);
        expect(result).toBeDefined();
    });
    it.skip("should submit files for assignment", async () => {
        // TODO: Provide a real assignmentId and files
        const assignmentId = 1;
        const files: File[] = [];
        const result = await Codepost.Assignments.Submit(assignmentId, files);
        expect(result).toBeDefined();
    });
    it.skip("should add file to submission", async () => {
        // TODO: Provide a real assignmentId and files
        const assignmentId = 1;
        const files: File[] = [];
        const result = await Codepost.Assignments.addFileToSubmission(assignmentId, files);
        expect(result).toBeDefined();
    });
    it.skip("should get submission tests for assignment", async () => {
        // TODO: Provide a real assignmentId
        const assignmentId = 1;
        const result = await Codepost.Assignments.getSubmissionTests(assignmentId);
        expect(result).toBeDefined();
    });
    it.skip("should clone assignment", async () => {
        // TODO: Provide real assignmentId and courseId
        const assignmentId = 1;
        const courseId = 1;
        const result = await Codepost.Assignments.clone(assignmentId, courseId);
        expect(result).toBeDefined();
    });
});

describe("Comments full integration", () => {
    it("should list comments", async () => {
        const result = await Codepost.Comments.list();
        expect(result).toHaveProperty("results");
    });
    it.skip("should retrieve comment by id", async () => {
        // TODO: Provide a real commentId
        const commentId = "1";
        const result = await Codepost.Comments.retrieve(commentId);
        expect(result).toBeDefined();
    });
    it.skip("should send feedback for comment", async () => {
        // TODO: Provide a real commentId and feedback string
        const commentId = "1";
        const feedback = "Great job!";
        await Codepost.Comments.feedback(commentId, feedback);
        // No assertion, just check no error thrown
    });
});

describe("Courses full integration", () => {
    it("should list courses", async () => {
        const result = await Codepost.Courses.list();
        expect(result).toHaveProperty("results");
    });
    it.skip("should get course by id", async () => {
        // TODO: Provide a real courseId
        const courseId = "1";
        const result = await Codepost.Courses.getCourse(courseId);
        expect(result).toHaveProperty("id");
    });
    it.skip("should get course settings", async () => {
        // TODO: Provide a real courseId
        const courseId = "1";
        const result = await Codepost.Courses.getCourseSettings(courseId);
        expect(result).toBeDefined();
    });
    it.skip("should update course settings", async () => {
        // TODO: Provide a real courseId and settings
        const courseId = "1";
        const settings = {};
        const result = await Codepost.Courses.updateCourseSettings(courseId, settings);
        expect(result).toBeDefined();
    });
    it.skip("should change invite code", async () => {
        // TODO: Provide a real courseId
        const courseId = "1";
        const result = await Codepost.Courses.changeInviteCode(courseId);
        expect(result).toBeDefined();
    });
    it.skip("should get roster", async () => {
        // TODO: Provide a real courseId
        const courseId = "1";
        const result = await Codepost.Courses.getRoster(courseId);
        expect(result).toBeDefined();
    });
    it.skip("should update roster", async () => {
        // TODO: Provide a real courseId and roster
        const courseId = "1";
        const roster = {};
        const result = await Codepost.Courses.updateRoster(courseId, roster);
        expect(result).toBeDefined();
    });
    it.skip("should add to roster", async () => {
        // TODO: Provide a real courseId and roster
        const courseId = "1";
        const roster = {};
        const result = await Codepost.Courses.addToRoster(courseId, roster);
        expect(result).toBeDefined();
    });
    it.skip("should remove from roster", async () => {
        // TODO: Provide a real courseId and roster
        const courseId = "1";
        const roster = {};
        const result = await Codepost.Courses.removeFromRoster(courseId, roster);
        expect(result).toBeDefined();
    });
    it.skip("should get LMS roster", async () => {
        // TODO: Provide a real courseId
        const courseId = "1";
        const result = await Codepost.Courses.getLMSRoster(courseId);
        expect(result).toBeDefined();
    });
    it.skip("should update LMS roster", async () => {
        // TODO: Provide a real courseId and roster
        const courseId = "1";
        const roster = {};
        const result = await Codepost.Courses.updateLMSRoster(courseId, roster);
        expect(result).toBeDefined();
    });
    it.skip("should get student captions", async () => {
        // TODO: Provide a real courseId
        const courseId = "1";
        const result = await Codepost.Courses.getStudentCaptions(courseId);
        expect(result).toBeDefined();
    });
    it.skip("should update student captions", async () => {
        // TODO: Provide a real courseId and captions
        const courseId = "1";
        const captions = {};
        const result = await Codepost.Courses.updateStudentCaptions(courseId, captions);
        expect(result).toBeDefined();
    });
    it.skip("should get sections for course", async () => {
        // TODO: Provide a real courseId and options
        const courseId = "1";
        const options = {};
        const result = await Codepost.Courses.getSections(courseId, options);
        expect(result).toBeDefined();
    });
});

describe("Files full integration", () => {
    it("should list files", async () => {
        const result = await Codepost.Files.list();
        expect(result).toHaveProperty("results");
    });
});

describe("Users full integration", () => {
    it("should list users", async () => {
        const result = await Codepost.Users.list();
        expect(result).toHaveProperty("results");
    });
    it.skip("should email user", async () => {
        // TODO: Provide a real email and options
        const email = "test@example.com";
        const options = { course: 1, template: "welcome" };
        const result = await Codepost.Users.emailUser(email, options);
        expect(result).toBeDefined();
    });
    it.skip("should update me", async () => {
        // TODO: Provide a real UserUpdate object
        const options = { showProductTips: true };
        const result = await Codepost.Users.updateMe(options);
        expect(result).toBeDefined();
    });
    it.skip("should get current user info", async () => {
        const result = await Codepost.Users.me();
        expect(result).toBeDefined();
    });
    it.skip("should request API token", async () => {
        const result = await Codepost.Users.requestAPIToken();
        expect(result).toBeDefined();
    });
});

describe("FileTemplates full integration", () => {
    it("should list file templates", async () => {
        const result = await Codepost.FileTemplates.list();
        expect(result).toHaveProperty("results");
    });
});

describe("Organizations full integration", () => {
    it("should list organizations", async () => {
        const result = await Codepost.Organizations.list();
        expect(result).toHaveProperty("results");
    });
});

describe("Registration full integration", () => {
    it("should get current user", async () => {
        const result = await Codepost.RegistrationClient.CurrentUser();
        expect(result).toHaveProperty("token");
    });
    it.skip("should register email", async () => {
        // TODO: Provide real email and token
        const email = "test@example.com";
        const token = "sometoken";
        const result = await Codepost.RegistrationClient.EmailRegister(email, token);
        expect(result).toBeDefined();
    });
    it.skip("should verify registration token", async () => {
        // TODO: Provide real token and uid
        const token = "sometoken";
        const uid = "someuid";
        const result = await Codepost.RegistrationClient.VerifyRegistrationToken(token, uid);
        expect(result).toBeDefined();
    });
    it.skip("should register and set password", async () => {
        // TODO: Provide real token, uid, and password
        const token = "sometoken";
        const uid = "someuid";
        const password1 = "password";
        const result = await Codepost.RegistrationClient.RegisterAndSetPassword(token, uid, password1);
        expect(result).toBeDefined();
    });
    it.skip("should validate new admin user", async () => {
        // TODO: Provide real email and organization
        const email = "test@example.com";
        const organization = "org";
        await Codepost.RegistrationClient.ValidateNewAdminUser(email, organization);
    });
    it.skip("should validate mooc signup", async () => {
        // TODO: Provide real email
        const email = "test@example.com";
        await Codepost.RegistrationClient.ValidateMoocSignup(email);
    });
    it.skip("should handle validation response", async () => {
        // TODO: Provide real token, uid, activate
        const token = "sometoken";
        const uid = "someuid";
        const activate = true;
        await Codepost.RegistrationClient.HandleValidationResponse(token, uid, activate);
    });
    it.skip("should check admin status", async () => {
        // TODO: Provide real email
        const email = "test@example.com";
        const result = await Codepost.RegistrationClient.AdminCheckStatus(email);
        expect(result).toBeDefined();
    });
    it.skip("should get email for password reset", async () => {
        // TODO: Provide real email and is_mooc
        const email = "test@example.com";
        const is_mooc = false;
        const result = await Codepost.RegistrationClient.GetEmailForPasswordReset(email, is_mooc);
        expect(result).toBeDefined();
    });
    it.skip("should verify password reset token", async () => {
        // TODO: Provide real token and uid
        const token = "sometoken";
        const uid = "someuid";
        const result = await Codepost.RegistrationClient.VerifyPasswordResetToken(token, uid);
        expect(result).toBeDefined();
    });
    it.skip("should reset password", async () => {
        // TODO: Provide real token, uid, password1
        const token = "sometoken";
        const uid = "someuid";
        const password1 = "password";
        const result = await Codepost.RegistrationClient.ResetPassword(token, uid, password1);
        expect(result).toBeDefined();
    });
    it.skip("should set credentials", async () => {
        // TODO: Provide real token, uid, password1
        const token = "sometoken";
        const uid = "someuid";
        const password1 = "password";
        const result = await Codepost.RegistrationClient.SetCredentials(token, uid, password1);
        expect(result).toBeDefined();
    });
    it.skip("should promote grader to admin", async () => {
        await Codepost.RegistrationClient.GraderToAdmin();
    });
});

describe("RubricCategories full integration", () => {
    it("should list rubric categories", async () => {
        const result = await Codepost.RubricCategories.list();
        expect(result).toHaveProperty("results");
    });
});

describe("RubricComments full integration", () => {
    it("should list rubric comments", async () => {
        const result = await Codepost.RubricComments.list();
        expect(result).toHaveProperty("results");
    });
    it.skip("should get comments for rubric comment", async () => {
        // TODO: Provide real rubricCommentId
        const rubricCommentId = "1";
        const result = await Codepost.RubricComments.getComments(rubricCommentId);
        expect(result).toBeDefined();
    });
    it.skip("should get feedback score for rubric comment", async () => {
        // TODO: Provide real rubricCommentId
        const rubricCommentId = "1";
        const result = await Codepost.RubricComments.getFeedbackScore(rubricCommentId);
        expect(result).toBeDefined();
    });
});

describe("Sections full integration", () => {
    it("should list sections", async () => {
        const result = await Codepost.Sections.list();
        expect(result).toHaveProperty("results");
    });
    it.skip("should get submissions for section", async () => {
        // TODO: Provide real sectionId and assignmentId
        const sectionId = "1";
        const assignmentId = "1";
        const result = await Codepost.Sections.getSubmissions(sectionId, assignmentId);
        expect(Array.isArray(result)).toBe(true);
    });
});

describe("Submissions full integration", () => {
    it("should list submissions", async () => {
        const result = await Codepost.Submissions.list();
        expect(result).toHaveProperty("results");
    });
    it.skip("should get permissions for submission", async () => {
        // TODO: Provide real submissionId
        const submissionId = "1";
        const result = await Codepost.Submissions.getPermissions(submissionId);
        expect(result).toBeDefined();
    });
    it.skip("should get history for submission", async () => {
        // TODO: Provide real submissionId
        const submissionId = "1";
        const result = await Codepost.Submissions.getHistory(submissionId);
        expect(Array.isArray(result)).toBe(true);
    });
    it.skip("should update history for submission", async () => {
        // TODO: Provide real submissionId and options
        const submissionId = "1";
        const options = { student: "studentId", hasViewed: true };
        const result = await Codepost.Submissions.updateHistory(submissionId, options);
        expect(result).toBeDefined();
    });
    it.skip("should submit regrade for submission", async () => {
        // TODO: Provide real submissionId and options
        const submissionId = "1";
        const options = { questionText: "Why did I lose points?" };
        const result = await Codepost.Submissions.submitRegrade(submissionId, options);
        expect(result).toBeDefined();
    });
    it.skip("should delete regrade for submission", async () => {
        // TODO: Provide real submissionId
        const submissionId = "1";
        const result = await Codepost.Submissions.deleteRegrade(submissionId);
        expect(result).toBeDefined();
    });
    it.skip("should get test results for submission", async () => {
        // TODO: Provide real submissionId
        const submissionId = "1";
        const result = await Codepost.Submissions.getTestResults(submissionId);
        expect(result).toBeDefined();
    });
    it.skip("should generate partner link for submission", async () => {
        // TODO: Provide real submissionId
        const submissionId = "1";
        const result = await Codepost.Submissions.generatePartnerLink(submissionId);
        expect(result).toBeDefined();
    });
    it.skip("should validate partner link for submission", async () => {
        // TODO: Provide real submissionId and token
        const submissionId = "1";
        const token = "sometoken";
        const result = await Codepost.Submissions.validatePartnerLink(submissionId, token);
        expect(result).toBeDefined();
    });
    it.skip("should get partner link for submission", async () => {
        // TODO: Provide real submissionId and token
        const submissionId = "1";
        const token = "sometoken";
        const result = await Codepost.Submissions.getPartnerLink(submissionId, token);
        expect(result).toBeDefined();
    });
    it.skip("should remove partner link for submission", async () => {
        // TODO: Provide real submissionId
        const submissionId = "1";
        const result = await Codepost.Submissions.removePartnerLink(submissionId);
        expect(result).toBeDefined();
    });
    it.skip("should notify students for submission", async () => {
        // TODO: Provide real submissionId
        const submissionId = "1";
        const result = await Codepost.Submissions.notifyStudents(submissionId);
        expect(result).toBeDefined();
    });
});

describe("SubmissionTests full integration", () => {
    it("should list submission tests", async () => {
        const result = await SubmissionTests.list();
        expect(result).toHaveProperty("results");
    });
});

describe("TestCases full integration", () => {
    it("should list test cases", async () => {
        const result = await Codepost.TestCases.list();
        expect(result).toHaveProperty("results");
    });
    it.skip("should run test case", async () => {
        // TODO: Provide real testCaseId, submissionId, and files
        const testCaseId = "1";
        const submissionId = "1";
        const files = { "main.py": "print('hello')" };
        const result = await Codepost.TestCases.run(testCaseId, submissionId, files);
        expect(result).toBeDefined();
    });
});

describe("TestCategories full integration", () => {
    it("should list test categories", async () => {
        const result = await Codepost.TestCategories.list();
        expect(result).toHaveProperty("results");
    });
});

describe("Token full integration", () => {
    it.skip("should refresh token", async () => {
        // TODO: Provide real refreshToken
        const refreshToken = "sometoken";
        const result = await Codepost.Tokens.refresh(refreshToken);
        expect(result).toBeDefined();
    });
    it.skip("should verify token", async () => {
        // TODO: Provide real accessToken
        const accessToken = "sometoken";
        const result = await Codepost.Tokens.verify(accessToken);
        expect(result).toBeDefined();
    });
    it.skip("should login", async () => {
        // TODO: Provide real username and password
        const username = "user";
        const password = "pass";
        const result = await Codepost.Tokens.login(username, password);
        expect(result).toBeDefined();
    });
});

describe("Webhooks full integration", () => {
    it("should list webhooks", async () => {
        const result = await Codepost.Webhooks.list();
        expect(result).toHaveProperty("results");
    });
});
