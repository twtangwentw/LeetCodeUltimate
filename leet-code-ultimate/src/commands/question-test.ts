import { languageMapLeetCode, Languages } from "../common";
import { languageService } from "../services/LanguageService";
import { interpretSolution, InterpretSolutionArgs } from "../apis/interpret-solution";
import { ProgressLocation, window } from "vscode";
import { InterpretCheck, interpretCheck } from "../apis/interpret-check";
import { leetCodeOutputChannel } from "../output/LeetCodeOutputChannel";

let testing = false;
/**
 * 测试编写的 LeetCode 代码
 */
export const questionTest = (language: Languages) => {
    if (testing) {
        return;
    }
    testing = true;
    window.withProgress({location: ProgressLocation.Notification}, async p => {
        p.report({message: "执行测试用例中..."});
        return languageService.getTestOrSubmitQuestionData(language).then(data => {
            const lang = languageMapLeetCode.get(language);
            if (!lang) {
                throw Error("不支持的语言" + language);
            }
            const args = new InterpretSolutionArgs(data.titleSlug, data.id, lang, data.code, data.testCase, data.judgeType);
            return interpretSolution(args).then(res => {
                return check(res.interpretId, res.interpretExpectedId, res.testCase);
            });
        }).catch((reason) => {
            leetCodeOutputChannel.show();
            leetCodeOutputChannel.append(reason);
            return Promise.resolve();
        }).then(() => {
            testing = false;
        });
    });
};

const check = async (id: string, expectedId: string, testCase: string): Promise<void> => {
    const _check: () => Promise<undefined | Awaited<InterpretCheck>[]> = () => {
        return Promise.all([
            interpretCheck({id}),
            interpretCheck({id: expectedId})]
        ).then(res => {
            if (res[0].state === "SUCCESS" && res[1].state === "SUCCESS") {
                leetCodeOutputChannel.show();
                if (res[0].run_success) {
                    leetCodeOutputChannel.append(
                        "执行用时：" + res[0].status_runtime + "，消耗内存：" + res[0].status_memory + "\n"
                        + "输入：\n"
                        + testCase + "\n"
                        + "输出：\n"
                        + res[0].code_answer + "\n"
                        + "预期输出：\n"
                        + res[0].expected_code_answer
                    );
                } else {
                    leetCodeOutputChannel.append(res[0].status_msg ?? "错误");
                    if (res[0].status_msg === "Compile Error") {
                        leetCodeOutputChannel.append(res[0].full_compile_error ?? "");
                    } else if (res[0].status_msg === "Runtime Error") {
                        leetCodeOutputChannel.append(res[0].full_runtime_error ?? "");
                    }
                }
                return;
            }
            return _check();
        });
    };
    return _check().then();
};