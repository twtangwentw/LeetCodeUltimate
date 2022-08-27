import { AllState, QuestionNode } from "../views/question-explorer/QuestionNode";
import { questionExplorerTreeDataProvider } from "../views/question-explorer/QuestionExplorerTreeDataProvider";
import { window } from "vscode";

export const previousPage = (node: QuestionNode) => {
    console.log("上一页");
    const state = node.state as AllState;
    if (state.current > 1) {
        state.current--;
        questionExplorerTreeDataProvider.refresh(node);
        return;
    }
    window.showInformationMessage("第一页");
};