import { leetCodeApi } from "./common";

/**
 * 获取每日一题数据
 */
export const getQuestionOfToday = async () => {
    return leetCodeApi<QuestionOfToday>({
        command: "getQuestionOfToday",
        args: {}
    });
};

export type QuestionOfToday = {
    data: {
        todayRecord: {
            date: string
            userStatus: "FINISH" | "NOT_START" | null
            question: {
                questionId: string
                frontendQuestionId: string
                difficulty: "Easy" | "Medium" | "Hard" | "EASY" | "MEDIUM" | "HARD"
                title: string
                titleCn: string
                titleSlug: string
                paidOnly: boolean
                freqBar: number | null
                isFavor: boolean
                acRate: number
                status: "AC" | "NOT_START" | null
                solutionNum: number
                hasVideoSolution: boolean
                topicTags: {
                    name: string
                    nameTranslated: string
                    id: string
                }[]
                extra: {
                    topCompanyTags: {
                        imgUrl: string
                        slug: string
                        numSubscribed: number
                    }[]
                }
            }
            lastSubmission: unknown | null
        }[]
    }
};