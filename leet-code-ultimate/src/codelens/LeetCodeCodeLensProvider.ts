import { CodeLens, CodeLensProvider, Event, EventEmitter, ProviderResult, Range, TextDocument } from "vscode";
import { languageMap } from "../common";

/**
 * 显示提交和测试按钮
 */
export class LeetCodeCodeLensProvider implements CodeLensProvider {

    private onDidChangeCodeLensesEmitter: EventEmitter<void> = new EventEmitter<void>();

    get onDidChangeCodeLenses(): Event<void> {
        return this.onDidChangeCodeLensesEmitter.event;
    }

    public refresh(): void {
        this.onDidChangeCodeLensesEmitter.fire();
    }

    public provideCodeLenses(document: TextDocument): ProviderResult<CodeLens[]> {

        const content: string = document.getText();
        if (content.indexOf("@LEETCODE-ULTIMATE@SYNC-END@") < 0) {
            return undefined;
        }

        let codeLensLine: number = document.lineCount - 1;
        for (let i: number = document.lineCount - 1; i >= 0; i--) {
            const lineContent: string = document.lineAt(i).text;
            if (lineContent.indexOf("@LEETCODE-ULTIMATE@SYNC-END@") >= 0) {
                codeLensLine = i;
                break;
            }
        }

        const range: Range = new Range(codeLensLine, 0, codeLensLine, 0);
        const codeLens: CodeLens[] = [];
        
        codeLens.push(new CodeLens(range, {
            title: "提交",
            command: "leetcode.question.submit",
            arguments: [languageMap.get(document.languageId)],
        }));
        codeLens.push(new CodeLens(range, {
            title: "测试",
            command: "leetcode.question.test",
            arguments: [languageMap.get(document.languageId)]
        }));

        return codeLens;
    }
}

export const leetCodeCodeLensProvider = new LeetCodeCodeLensProvider();