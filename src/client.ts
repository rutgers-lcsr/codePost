import * as Assignments from "./assignments/client";
import { Auth } from "./auth";
import * as Comments from "./comments/client";
import * as Courses from "./courses/client";
import * as Files from "./files/client";
import { setBaseUrl } from "./http";
import * as Organizations from "./organizations/client";
import * as Registration from "./registration/client";
import * as RubricCategories from "./rubricCategories/client";
import * as RubricsComments from "./rubricComments/client";
import * as Sections from "./sections/client";
import * as Submissions from "./submissions/client";
import * as TestCases from "./testCases/client";
import * as TestCategories from "./testCategories/client";
import * as Token from "./token/client";
import * as Users from "./users/client";

export function createClient(baseURL: string = "https://codepost-api.cs.rutgers.edu") {
    const client = new CodepostClient();
    client.setBaseUrl(baseURL);

    return client;
}

export class CodepostClient {
    users: typeof Users.Users;
    submissions: typeof Submissions.Submissions;
    courses: typeof Courses.Courses;
    assignments: typeof Assignments.Assignments;
    comments: typeof Comments.Comments;
    files: typeof Files.Files;
    registration: typeof Registration.RegistrationClient;
    organizations: typeof Organizations.Organizations;
    sections: typeof Sections.Sections;
    testCases: typeof TestCases.TestCases;
    testCategories: typeof TestCategories.TestCategories;
    token: typeof Token.Tokens;
    rubricCategories: typeof RubricCategories.RubricCategories;
    rubricsComments: typeof RubricsComments.RubricComments;

    constructor() {
        // Initialize any necessary properties or configurations here
        this.users = Users.Users;
        this.submissions = Submissions.Submissions;
        this.courses = Courses.Courses;
        this.assignments = Assignments.Assignments;
        this.comments = Comments.Comments;
        this.files = Files.Files;
        this.registration = Registration.RegistrationClient;
        this.organizations = Organizations.Organizations;
        this.sections = Sections.Sections;
        this.testCases = TestCases.TestCases;
        this.testCategories = TestCategories.TestCategories;
        this.token = Token.Tokens;
        this.rubricCategories = RubricCategories.RubricCategories;
        this.rubricsComments = RubricsComments.RubricComments;
    }
    setBaseUrl(baseURL: string) {
        setBaseUrl(baseURL);
    }
    login(token: string): void;
    login(username: string, password: string): Promise<any>;
    login(tokenOrUsername: string, password?: string): void | Promise<any> {
        if (password === undefined) {
            // Assume token-based login
            Auth.setToken(tokenOrUsername);
            return;
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
