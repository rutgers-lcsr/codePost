export namespace Course {
    export interface Course {
        id: number;
        name: string;
        period: string;
        assignments: Assignment[];
        section: string[];
        sendReleasedSubmissionsToBack: boolean;
        showStudentsStatistics: boolean;
        timezone: string;
        emailNewUsers: boolean;
        anonymousGradingDefault: boolean;
        allowGradersToEditRubric: boolean;
        minComments: number;
        noUnfinalized: boolean;
        archive: boolean;
        lateDayCreditsAllowable: number;
        activeQueue: boolean;
        inviteCode: string;
        emailWhitelist: string;
        inviteCodeEnabled: boolean;
        enableStudentFeedbackNotifications: boolean;
        webhooks: Webhook[];
    }
    export interface Assignment {}
    export interface Roster {}
}

export interface User {
    id: number;
    email: string;
    organization: string;
    studentCourses: Course.Course[];
    graderCourses: Course.Course[];
    superGraderCourses: Course.Course[];
    courseadminCourses: Course.Course[];
    leaderSections: Section[];
    codePostAdmin: boolean;
    canCreateCourses: boolean;
    canModifyRosters: boolean;
    showProductTips: boolean;
    api_token: string;
    student_sections: Section[];
    hasCredentials: boolean;
}
export namespace Token {
    export interface TokenResponse {
        token: string;
        user: User;
    }
    export interface TokenRefreshResponse {
        token: string;
    }
}
