import { getQuestionData } from "../apis/get-question-data";
import { ProgressLocation, window } from "vscode";
import { languageService } from "../services/LanguageService";
import { questionDescriptionWebView } from "../webview/QuestionDescriptionWebView";

let opening = false;
/**
 * 打开题目的 Command
 */
export const questionOpen = (titleSlug: string) => {
    if (opening) {
        return;
    }
    opening = true;
    window.withProgress({location: ProgressLocation.Notification}, async progress => {
        return getQuestionData(titleSlug).then(res => {
            progress.report({message: "打开题目中"});
            return languageService.openEditor(res).then(() => {
                questionDescriptionWebView.show(res);
            });
        });
    }).then(() => {
        opening = false;
    }, (reason) => {
        opening = false;
        window.showWarningMessage(reason);
    });
};