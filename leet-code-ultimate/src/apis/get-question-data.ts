import { leetCodeApi } from "./common";

export const getQuestionData = async (titleSlug: string) => {
    return leetCodeApi<QuestionData>({
        command: "getQuestionData",
        args: {titleSlug}
    });
};

export type QuestionData = {
    data: {
        question: {
            questionId: string
            questionFrontendId: string
            categoryTitle: string
            boundTopicId: number
            title: string
            titleSlug: string
            content: string
            translatedTitle: string
            translatedContent: string
            isPaidOnly: boolean
            difficulty: "Easy" | "Medium" | "Hard" | "EASY" | "MEDIUM" | "HARD"
            likes: number
            dislikes: number
            isLiked: boolean | null
            similarQuestions: any
            contributors: any
            langToValidPlayground: string // "{[key: string]: boolean}"
            topicTags: {
                name: string
                slug: string
                translatedName: string
            }[]
            companyTagStats: any | null
            codeSnippets: {
                lang: string
                langSlug: string
                code: string
            }[]
            stats: string // QuestionStats
            hints: string[]
            solution: any | null
            status: "AC" | "NOT_START" | null
            sampleTestCase: string
            metaData: string // "{\n  \"name\": \"isPrefixOfWord\",\n  \"params\": [\n    {\n      \"name\": \"sentence\",\n      \"type\": \"string\"\n    },\n    {\n      \"type\": \"string\",\n      \"name\": \"searchWord\"\n    }\n  ],\n  \"return\": {\n    \"type\": \"integer\"\n  }\n}",
            judgerAvailable: boolean
            judgeType: "large" | string
            mysqlSchemas: any[] | null
            enableRunCode: boolean
            envInfo: string
            book: any | null
            isSubscribed: boolean
            isDailyQuestion: boolean
            dailyRecordStatus: "FINISH" | "NOT_START" | "AC" | null
            editorType: "CKEDITOR" | string
            ugcQuestionId: any | null
            style: "LEETCODE" | string
            exampleTestcases: string
            jsonExampleTestcases: string
        }
    }
};

export type QuestionStats = {
    totalAccepted: string
    totalSubmission: string
    totalAcceptedRaw: number
    totalSubmissionRaw: number
    acRate: string
};