import { Disposable, ViewColumn, WebviewPanel, window } from "vscode";
import { QuestionData, QuestionStats } from "../apis/get-question-data";
import * as fs from "fs";
import * as path from "path";
import { pathUtil } from "../utils/PathUtil";

/**
 * 问题描述 WebView
 */
export class QuestionDescriptionWebView implements Disposable {

    private readonly viewType = "leetcode.question.description";
    private readonly title = "LeetCode";

    private panel?: WebviewPanel;

    dispose(): any {
        this.panel?.dispose();
    }

    show(data: QuestionData) {
        if (!this.panel) {
            this.panel = window.createWebviewPanel(this.viewType, this.title, {viewColumn: ViewColumn.Two, preserveFocus: true}, {
                enableScripts: true,
                enableFindWidget: true,
                enableCommandUris: true,
                retainContextWhenHidden: true,
            });
            this.panel.onDidDispose(this.onDidDispose, this);
            this.panel.webview.onDidReceiveMessage(this.onDidReceiveMessage, this);
        } else {
            this.panel.reveal(ViewColumn.Two, true);
        }

        this.panel.webview.html = this.render(data);
    }

    private onDidDispose() {
        this.panel = undefined;
    }

    private onDidReceiveMessage(_message: any) {

    }

    private render(data: QuestionData): string {
        const {titleSlug, translatedTitle, translatedContent, stats} = data.data.question;
        const statsObj = JSON.parse(stats) as QuestionStats;
        return fs.readFileSync(path.join(pathUtil.resources, "templates", "question-description.html")).toString()
            .replace("${titleSlug}", titleSlug)
            .replace("${titleCn}", translatedTitle)
            .replace("${contentCn}", translatedContent)
            .replace("${totalAccepted}", statsObj.totalAccepted)
            .replace("${totalSubmission}", statsObj.totalSubmission);
    }

}

export const questionDescriptionWebView = new QuestionDescriptionWebView();