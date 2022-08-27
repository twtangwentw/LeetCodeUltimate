import { TreeItem, TreeItemCollapsibleState, Uri } from "vscode";
import { pathUtil } from "../../utils/PathUtil";
import * as path from "path";

export enum QuestionNodeType {
    all = "all",
    today = "today",
    question = "question"
}

export class QuestionState {

    constructor(
        public status: "AC" | "FINISH" | "NOT_START" | null,
        public titleSlug: string,
        public difficulty: "Easy" | "Medium" | "Hard" | "EASY" | "MEDIUM" | "HARD"
    ) {
    }
}

export class AllState {
    categorySlug: string = "";
    filters: any = {};
    pageSize = 50;
    current = 1;
    total?: number;
}

export class QuestionNode extends TreeItem {

    static all = new QuestionNode("全部题目", QuestionNodeType.all, new AllState());

    constructor(label: string, public type: QuestionNodeType = QuestionNodeType.question, public state: QuestionState | AllState) {
        super(label);

        this.tooltip = label;

        switch (type) {
            case QuestionNodeType.all:
                this.initAll();
                break;
            case QuestionNodeType.today:
                this.initToday();
                break;
            case QuestionNodeType.question:
                this.initQuestion();
                break;
        }
    }

    /**
     * 初始化全部分组
     */
    private initAll() {
        this.collapsibleState = TreeItemCollapsibleState.Expanded;
        this.contextValue = "all";
    }

    /**
     * 初始化每日一题
     */
    private initToday() {
        this.collapsibleState = TreeItemCollapsibleState.None;
        const state  = this.state as QuestionState;
        if (state.status === "FINISH") {
            this.iconPath = path.join(pathUtil.resources, "question", "question-of-today-complete.svg");
        } else {
            this.iconPath = path.join(pathUtil.resources, "question", "question-of-today.svg");
        }
        this.command = {
            arguments: [state.titleSlug],
            command: "question.explorer.open",
            title: "打开题目",
        };
        this.initUri();
    }

    /**
     * 初始化普通题目
     */
    private initQuestion() {
        this.collapsibleState = TreeItemCollapsibleState.None;
        const state  = this.state as QuestionState;
        if (state?.status === "AC") {
            this.iconPath = path.join(pathUtil.resources, "question", "question-complete.svg");
        } else {
            this.iconPath = path.join(pathUtil.resources, "question", "question.svg");
        }
        this.command = {
            arguments: [state.titleSlug],
            command: "question.explorer.open",
            title: "打开题目",
        };
        this.initUri();
    }

    /**
     * 初始化题目的 Uri
     */
    private initUri() {
        const state  = this.state as QuestionState;
        this.resourceUri = Uri.from({
            scheme: "leetcode",
            authority: this.type,
            query: "difficulty=" + state.difficulty,
            path: "/" + state.titleSlug,
        });
    };
}