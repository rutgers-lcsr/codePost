import * as Assignments from "./assignments/client";
import { Auth } from "./auth";
import * as Courses from "./courses/client";
import * as Files from "./files/client";
import * as FileTemplates from "./fileTemplates/client";
import { Grading, type GradingNamespace } from "./grading";
import { setBaseUrl } from "./http";
import * as Organizations from "./organizations/client";
import * as Registration from "./registration/client";
import * as Sections from "./sections/client";
import * as Submissions from "./submissions/client";
import { Testing, type TestingNamespace } from "./testing";
import * as Token from "./token/client";
import { User } from "./users";
import * as Users from "./users/client";
import { isBrowser } from "./utils/browser";
// Extend the Window interface to include codepostClient
declare global {
    interface Window {
        codepostClient: CodepostClient;
    }
}

function welcomeMessage(baseURL: string) {
    if (!isBrowser) return;
    console.log(`
    ██████╗ ██████╗ ██████╗ ███████╗██████╗  ██████╗ ███████╗████████╗
    ██╔════╝██╔═══██╗██╔══██╗██╔════╝██╔══██╗██╔═══██╗██╔════╝╚══██╔══╝
    ██║     ██║   ██║██║  ██║█████╗  ██████╔╝██║   ██║███████╗   ██║   
    ██║     ██║   ██║██║  ██║██╔══╝  ██╔═══╝ ██║   ██║╚════██║   ██║   
    ╚██████╗╚██████╔╝██████╔╝███████╗██║     ╚██████╔╝███████║   ██║   
    ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝╚═╝      ╚═════╝ ╚══════╝   ╚═╝                                                         
    Welcome to CodePost SDK!
    Explore the API at ${baseURL}/docs`);
}

export type CodepostClientOptions = {
    baseURL: string;
    accessToken?: string;
};

const defaultOptions: CodepostClientOptions = {
    baseURL: "https://codepost-api.cs.rutgers.edu",
    accessToken: undefined,
};

export function createClient(options: CodepostClientOptions = defaultOptions) {
    const client = new CodepostClient();

    client.setBaseUrl(options.baseURL);
    if (isBrowser) {
        welcomeMessage(options.baseURL);
        window.codepostClient = client;
    }
    if (options.accessToken) {
        try {
            client.login(options.accessToken);
        } catch (error) {
            console.error("Error logging in:", error);
        }
    }
    return client;
}

export class CodepostClient {
    // === CORE RESOURCES ===
    /** Course operations */
    courses: typeof Courses.Courses;
    /** Assignment operations */
    assignments: typeof Assignments.Assignments;
    /** Submission operations */
    submissions: typeof Submissions.Submissions;
    /** User operations */
    users: typeof Users.Users;
    /** Organization operations */
    organizations: typeof Organizations.Organizations;
    /** Section operations */
    sections: typeof Sections.Sections;
    /** File operations (all file types) */
    files: typeof Files.Files;
    /** Submission file operations */
    submissionFiles: typeof Files.SubmissionFiles;
    /** Assignment file operations */
    assignmentFiles: typeof Files.AssignmentFiles;
    /** Course file operations */
    courseFiles: typeof Files.CourseFiles;
    /** File template operations */
    fileTemplates: typeof FileTemplates.FileTemplates;
    /** Registration/authentication operations */
    registration: typeof Registration.RegistrationClient;
    /** Token operations */
    token: typeof Token.Tokens;

    // === ORGANIZED NAMESPACES ===
    /**
     * Grading operations: rubric templates, comments, and grading helpers
     *
     * @example
     * ```typescript
     * // Create rubric template
     * const template = await client.grading.rubric.comments.create({
     *   category: categoryId,
     *   text: "Missing error handling",
     *   pointDelta: -10
     * });
     *
     * // Apply to student work
     * await client.grading.applyRubricComment({
     *   file: fileId,
     *   rubricComment: template.id,
     *   startLine: 42,
     *   endLine: 50
     * });
     * ```
     *
     * @see {@link Grading} for detailed documentation
     */
    grading: GradingNamespace;

    /**
     * Testing operations: test categories and test cases
     *
     * @example
     * ```typescript
     * // Create test category
     * const category = await client.testing.categories.create({
     *   assignment: assignmentId,
     *   name: "Unit Tests"
     * });
     *
     * // Add test case
     * await client.testing.cases.create({
     *   testCategory: category.id,
     *   description: "Test linked list reversal",
     *   type: "unit"
     * });
     * ```
     *
     * @see {@link Testing} for detailed documentation
     */
    testing: TestingNamespace;

    constructor() {
        // Initialize core resources
        this.courses = Courses.Courses;
        this.assignments = Assignments.Assignments;
        this.submissions = Submissions.Submissions;
        this.users = Users.Users;
        this.organizations = Organizations.Organizations;
        this.sections = Sections.Sections;
        this.files = Files.Files;
        this.submissionFiles = Files.SubmissionFiles;
        this.assignmentFiles = Files.AssignmentFiles;
        this.courseFiles = Files.CourseFiles;
        this.fileTemplates = FileTemplates.FileTemplates;
        this.registration = Registration.RegistrationClient;
        this.token = Token.Tokens;

        // Initialize organized namespaces
        this.grading = Grading;
        this.testing = Testing;
    }
    setBaseUrl(baseURL: string) {
        setBaseUrl(baseURL);
    }
    login(token: string): Promise<User>;
    login(username: string, password: string): Promise<User>;
    login(tokenOrUsername: string, password?: string): Promise<User> {
        if (password === undefined) {
            // Assume token-based login
            Auth.setToken(tokenOrUsername);
            return Promise.resolve(this.getUser());
        } else {
            // Username/password login
            return Auth.login(tokenOrUsername, password);
        }
    }
    logout() {
        Auth.clearTokens();
    }
    getUser() {
        return this.registration.CurrentUser();
    }
}
