import { languageMapLeetCode, Languages } from "../common";
import { languageService } from "../services/LanguageService";
import { ProgressLocation, window } from "vscode";
import { leetCodeOutputChannel } from "../output/LeetCodeOutputChannel";
import { submitSolution, SubmitSolutionArgs } from "../apis/submit-solution";
import { submitCheck } from "../apis/submit-check";
import { questionExplorerTreeDataProvider } from "../views/question-explorer/QuestionExplorerTreeDataProvider";

let submitting = false;
/**
 * 提交编写的 LeetCode 代码
 */
export const questionSubmit = (language: Languages) => {
    if (submitting) {
        return;
    }
    submitting = true;
    window.withProgress({location: ProgressLocation.Notification}, async p => {
        p.report({message: "提交解决方案..."});
        return languageService.getTestOrSubmitQuestionData(language).then(data => {
            const lang = languageMapLeetCode.get(language);
            if (!lang) {
                throw Error("不支持的语言" + language);
            }
            const args = new SubmitSolutionArgs(data.titleSlug, data.id, lang, data.code);
            return submitSolution(args).then(res => {
                return check(res.id, language);
            });
        }).catch((reason) => {
            leetCodeOutputChannel.show();
            leetCodeOutputChannel.append(reason);
            return Promise.resolve();
        }).then(() => {
            submitting = false;
        });
    });
};

const check = async (id: string, lang: Languages): Promise<void> => {
    const _check: () => Promise<void> = () => {
        return submitCheck({id}).then(res => {
            if (res.state === "SUCCESS") {
                leetCodeOutputChannel.show();
                console.log(res);
                if (res.run_success) {
                    let result = "";
                    if (res.total_correct === res.total_testcases) {
                        questionExplorerTreeDataProvider.refresh();
                        result += "执行用时：" + res.status_runtime + " ，在所有 " + lang + " 提交中击败了 " + parsePercentile(res.runtime_percentile) + "% 的用户\n" +
                            "内存消耗：" + res.status_memory + " ，在所有 " + lang + " 提交中击败了 " + parsePercentile(res.memory_percentile) + "% 的用户\n";
                    } else {
                        result += "输入：\n" + res.last_testcase + "\n" +
                            "输出：\n" + res.code_output + "\n" +
                            "预期结果：\n" + res.expected_output + "\n";
                    }
                    leetCodeOutputChannel.append(
                        result + "通过测试用例：" + res.total_correct + " / " + res.total_testcases
                    );
                } else {
                    let result = (res.status_msg ?? "错误") + "\n";
                    if (res.status_msg === "Compile Error") {
                        result += res.full_compile_error ?? "";
                    } else if (res.status_msg === "Runtime Error") {
                        result += res.full_runtime_error ?? "";
                    }
                    leetCodeOutputChannel.append(result);
                }
                return;
            }
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(_check());
                }, 250);
            });
        });
    };
    return _check().then();
};

const parsePercentile = (percentile?: number) => {
    const res = String(percentile ?? 0);
    let end = res.length;
    const pointIndex = res.indexOf(".");
    if (pointIndex >= 0) {
        end = pointIndex + 2;
    }
    return res.substring(0, end);
};