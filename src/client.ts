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
import { setBaseUrl } from "./http";

export function createClient(baseURL: string) {
    const client = new CodepostClient();
    client.setBaseUrl(baseURL);

    return client;
}

class CodepostClient {
    users: typeof Users;
    submissions: typeof Submissions;
    courses: typeof Courses;
    assignments: typeof Assignments;
    comments: typeof Comments;
    files: typeof Files;
    registration: typeof Registration;
    organizations: typeof Organizations;
    sections: typeof Sections;
    testCases: typeof TestCases;
    testCategories: typeof TestCategories;
    token: typeof Token;
    rubricCategories: typeof RubricCategories;
    rubricsComments: typeof RubricsComments;

    constructor() {
        // Initialize any necessary properties or configurations here
        this.users = Users;
        this.submissions = Submissions;
        this.courses = Courses;
        this.assignments = Assignments;
        this.comments = Comments;
        this.files = Files;
        this.registration = Registration;
        this.organizations = Organizations;
        this.sections = Sections;
        this.testCases = TestCases;
        this.testCategories = TestCategories;
        this.token = Token;
        this.rubricCategories = RubricCategories;
        this.rubricsComments = RubricsComments;

    }
    setBaseUrl(baseURL: string) {
        setBaseUrl(baseURL);
    }
    login(username: string, password: string) {
        return this.token.Tokens.login(username, password);
    }
    getUser() {
        return this.registration.RegistrationClient.CurrentUser();
    }

}