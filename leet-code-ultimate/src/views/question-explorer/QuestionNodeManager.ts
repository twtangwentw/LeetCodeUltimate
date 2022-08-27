import { ProgressLocation, ProviderResult, window } from "vscode";
import { AllState, QuestionNode, QuestionNodeType, QuestionState } from "./QuestionNode";
import { getQuestionOfToday } from "../../apis/get-question-of-today";
import { webSocketService } from "../../services/WebSocketService";
import { getQuestionList, GetQuestionListParam } from "../../apis/get-question-list";

/**
 * 结点的创建
 */
class QuestionNodeManager {

    /**
     * 获取根结点
     */
    getRootNode(): ProviderResult<QuestionNode[]> {
        return new Promise<QuestionNode[]>(async (resolve, reject) => {
            this.checkConnection().then(async () => {
                const todayNode = await this.getQuestionOfTodayNode().catch(reject);
                if (todayNode) {
                    resolve([
                        todayNode,
                        QuestionNode.all
                    ]);
                }
            }).catch(reject);
        }).catch(e => Promise.reject(typeof e === "string" ? e : "异常"));
    }

    /**
     * 等待浏览器
     */
    private async checkConnection(): Promise<void> {
        return window.withProgress({location: ProgressLocation.Notification, cancellable: true}, async (p, c) => {
            p.report({message: "等待浏览器连接"});
            return new Promise((resolve, reject) => {
                const interval = setInterval(() => {
                    if (webSocketService.isConnection()) {
                        resolve();
                        clearInterval(interval);
                        return;
                    }
                    if (c.isCancellationRequested) {
                        reject("取消成功，前往浏览器点击插件图标重新连接");
                    }
                }, 150);
            });
        });
    }

    /**
     * 获取每日一题的结点
     */
    private async getQuestionOfTodayNode(): Promise<QuestionNode> {
        return getQuestionOfToday().then(res => res.data.todayRecord[0]).then(record => {
            const {question, userStatus} = record;
            const {titleCn, titleSlug, difficulty} = question;
            return new QuestionNode(titleCn, QuestionNodeType.today, new QuestionState(
                userStatus,
                titleSlug,
                difficulty
            ));
        });
    }

    /**
     * 获取全部题目结点
     */
    getAllQuestionNode(args: GetQuestionListParam, node: QuestionNode): ProviderResult<QuestionNode[]> {
        return getQuestionList(args).then(res => res.data.problemsetQuestionList).then(questionList => {
            const {questions, total} = questionList;
            (node.state as AllState).total = total;
            return questions.map(question => {
                const {titleCn, status, titleSlug, difficulty} = question;
                return new QuestionNode(titleCn, QuestionNodeType.question, new QuestionState(
                    status,
                    titleSlug,
                    difficulty
                ));
            });
        });
    }
}

export const questionNodeManager = new QuestionNodeManager();