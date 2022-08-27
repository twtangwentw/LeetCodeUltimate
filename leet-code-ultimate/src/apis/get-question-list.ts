import { leetCodeApi } from "./common";

/**
 * 获取全部题目分页列表
 * @param args
 */
export const getQuestionList = async (args: GetQuestionListParam) => {
    return leetCodeApi<QuestionList>({
        command: "getQuestionList",
        args
    });
};

export type GetQuestionListParam = {
    categorySlug: string
    filters: any
    limit: number
    skip: number
};

export type QuestionList = {
    data: {
        problemsetQuestionList: {
            hasMore: boolean
            questions: {
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
                topicTags: {
                    name: string
                    nameTranslated: string
                    id: string
                    slug: string
                    imgUrl: string
                }[]
                extra: {
                    companyTagNum: number
                    hasVideoSolution: boolean
                    topCompanyTags: {
                        name: string
                        nameTranslated: string
                        id: string
                        slug: string
                        imgUrl: string
                    }[]
                }
            }[]
            total: number
        }
    }
};