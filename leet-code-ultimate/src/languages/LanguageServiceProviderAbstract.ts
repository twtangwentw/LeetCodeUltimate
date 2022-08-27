import { QuestionData } from "../apis/get-question-data";
import { commands, Position, Range, TextEditor, Uri, ViewColumn, window } from "vscode";
import { CASE_END_FLAG, INFO_END_FLAG, Languages, SYNC_END_FLAG } from "../common";
import * as fs from "fs-extra";
import { pathUtil } from "../utils/PathUtil";
import * as path from "path";

/**
 * 语言服务的接口抽象
 */
export abstract class LanguageServiceProviderAbstract {
    protected editor?: TextEditor;
    protected abstract regex: string;
    protected abstract language: string;
    protected abstract template: string;
    protected abstract initEnv(): Promise<void>;
    protected abstract dirPath(): Promise<string>;
    protected abstract filePath(): Promise<string>;

    async getQuestionData(): Promise<{ code: string; id: number; testCase: string }> {
        if (!this.editor) {
            this.editor = await this.openEditorInternal();
        }
        const editor = this.editor;
        return editor.document.save().then(() => {
            const content = editor.document.getText();
            const match = content.match(this.regex);
            if (!match) {
                return Promise.reject("解析文件失败");
            }
            return Promise.resolve({
                code: match[1],
                id: Number(match[2]),
                testCase: match[3]
            });
        });
    }

    openEditor(question: QuestionData): Promise<void> {
        return this.initEnv().then(async () => {
            const parseContent = this.parseQuestion(question);
            return this.openEditorInternal().then((editor) => {
                this.editor = editor;
                return editor.edit((builder => {
                    builder.replace(new Range(new Position(0, 0), editor.document.lineAt(editor.document.lineCount - 1).range.end), parseContent);
                })).then();
            });
        });
    }

    closeEditor(): Promise<void> {
        return this.openEditorInternal().then(async (editor) => {
            if (editor.document.isDirty) {
                await editor.document.save();
            }
            return commands.executeCommand("workbench.action.closeActiveEditor");
        });
    }

    protected async openEditorInternal(): Promise<TextEditor> {
        return window.showTextDocument(Uri.file(await this.filePath()), {
            preview: false,
            viewColumn: ViewColumn.One
        });
    }

    private parseQuestion(data: QuestionData): string {
        const {questionId, codeSnippets, sampleTestCase} = data.data.question;
        const codeSnippet = codeSnippets.filter(s => s.lang === this.language).pop();
        if (!codeSnippet) {
            throw new Error("该题不支持使用" + Languages.rust);
        }
        return fs.readFileSync(path.join(pathUtil.resources, "templates", this.template)).toString()
            .replace("${codeSnippet}", codeSnippet?.code ?? "")
            .replace("${SYNC_END_FLAG}", SYNC_END_FLAG)
            .replace("${questionId}", questionId)
            .replace("${INFO_END_FLAG}", INFO_END_FLAG)
            .replace("${testCase}", sampleTestCase)
            .replace("${CASE_END_FLAG}", CASE_END_FLAG);
    }
}