import { CancellationToken, FileDecoration, FileDecorationProvider, ProviderResult, ThemeColor, Uri } from "vscode";
import { QuestionNodeType } from "./QuestionNode";

/**
 * TreeView 装饰器
 */
export class QuestionExplorerTreeItemDecorationProvider implements FileDecorationProvider {
    private readonly difficultyBadgeLabel: Record<string, string> = {
        easy: "E",
        medium: "M",
        hard: "H",
    };

    private readonly itemColor: Record<string, ThemeColor> = {
        easy: new ThemeColor("charts.green"),
        medium: new ThemeColor("charts.blue"),
        hard: new ThemeColor("charts.red"),
    };

    provideFileDecoration(uri: Uri, token: CancellationToken): ProviderResult<FileDecoration> {
        if (uri.scheme !== "leetcode" || uri.authority === QuestionNodeType.all) {
            return;
        }

        const params: URLSearchParams = new URLSearchParams(uri.query);
        const difficulty: string = params.get("difficulty")!.toLowerCase();
        return {
            badge: this.difficultyBadgeLabel[difficulty],
            color: this.itemColor[difficulty],
        };
    }

}

export const questionExplorerTreeItemDecorationProvider = new QuestionExplorerTreeItemDecorationProvider();