import { Event, EventEmitter, ProviderResult, TreeDataProvider, TreeItem } from "vscode";
import { AllState, QuestionNode, QuestionNodeType } from "./QuestionNode";
import { questionNodeManager } from "./QuestionNodeManager";

/**
 * LeetCode 题目浏览器视图树数据提供者
 */
export class QuestionExplorerTreeDataProvider implements TreeDataProvider<QuestionNode> {

    private _onDidChangeTreeDataEvent: EventEmitter<QuestionNode[] | void | undefined | null | QuestionNode> = new EventEmitter();
    public readonly onDidChangeTreeData: Event<QuestionNode[] | void | undefined | null | QuestionNode> = this._onDidChangeTreeDataEvent.event;

    refresh(node: QuestionNode[] | QuestionNode | undefined | null | void = null) {
        this._onDidChangeTreeDataEvent.fire(node);
    }

    getChildren(element?: QuestionNode): ProviderResult<QuestionNode[]> {
        if (!element) {
            return questionNodeManager.getRootNode();
        }
        if (element.type === QuestionNodeType.all) {
            const state = element.state as AllState;
            return questionNodeManager.getAllQuestionNode({
                categorySlug: state.categorySlug,
                filters: state.filters,
                limit: state.pageSize,
                skip: (state.current - 1) * state.pageSize
            }, element);
        }
        return [];
    }

    getTreeItem(element: QuestionNode): TreeItem | Thenable<TreeItem> {
        return element;
    }

}

export const questionExplorerTreeDataProvider = new QuestionExplorerTreeDataProvider();