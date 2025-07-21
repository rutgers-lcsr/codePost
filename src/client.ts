import * as Users from "./users/client";
import * as Submissions from "./submissions/client";
import * as Courses from "./courses/client";
import * as Assignments from "./assignments/client";
import * as Comments from "./comments/client";
import * as Files from "./files/client";
import * as Registration from "./registration/client";
import * as Organizations from "./organizations/client";
import * as RubricCategories from "./rubricCategories/client";
import * as RubricsComments from "./rubricComments/client";
import * as Sections from "./sections/client";
import * as TestCases from "./testCases/client";
import * as TestCategories from "./testCategories/client";
import * as Token from "./token/client";
import { Auth } from "./auth";
import { setBaseUrl } from "./http";

export function createClient(baseURL: string) {
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
    login(username: string, password: string) {
        return Auth.login(username, password);
    }
    logout() {
        Auth.clearTokens()
    }
    getUser() {
        return this.registration.CurrentUser();
    }

}