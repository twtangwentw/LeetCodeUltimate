import { AllState, QuestionNode } from "../views/question-explorer/QuestionNode";
import { questionExplorerTreeDataProvider } from "../views/question-explorer/QuestionExplorerTreeDataProvider";
import { window } from "vscode";

export const nextPage = (node: QuestionNode) => {
    console.log("下一页");
    const state = node.state as AllState;
    if (!state.total || (state.current * state.pageSize < state.total)) {
        state.current++;
        questionExplorerTreeDataProvider.refresh(node);
        return;
    }
    window.showInformationMessage("最后一页");
};