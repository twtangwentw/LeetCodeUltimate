import { commands, ExtensionContext, window } from "vscode";
import { webSocketService } from "./services/WebSocketService";
import { questionExplorerTreeDataProvider } from "./views/question-explorer/QuestionExplorerTreeDataProvider";
import { previousPage } from "./commands/previous-page";
import { nextPage } from "./commands/next-page";
import { questionOpen } from "./commands/question-open";
import { languageService } from "./services/LanguageService";
import { Languages } from "./common";
import { rustServiceProvider } from "./languages/RustServiceProvider";
import { questionSubmit } from "./commands/question-submit";
import { questionTest } from "./commands/question-test";
import { codeLensController } from "./codelens/CodeLensController";
import {
	questionExplorerTreeItemDecorationProvider
} from "./views/question-explorer/QuestionExplorerTreeItemDecorationProvider";
import { questionDescriptionWebView } from "./webview/QuestionDescriptionWebView";
import { leetCodeOutputChannel } from "./output/LeetCodeOutputChannel";
import { javaServiceProvider } from "./languages/JavaServiceProvider";

// noinspection JSUnusedGlobalSymbols
export function activate(context: ExtensionContext) {
	console.log('LeetCodeUltimate 插件激活');

	context.subscriptions.push(
		webSocketService,
		codeLensController,
		questionDescriptionWebView,
		languageService,
		leetCodeOutputChannel,
		window.registerFileDecorationProvider(questionExplorerTreeItemDecorationProvider),
		window.createTreeView("question.explorer", {treeDataProvider: questionExplorerTreeDataProvider}),
		commands.registerCommand("question.explorer.refresh", () => questionExplorerTreeDataProvider.refresh()),
		commands.registerCommand("question.explorer.open", (titleSlug) => questionOpen(titleSlug)),
		commands.registerCommand("question.explorer.previous.page", (item) => previousPage(item)),
		commands.registerCommand("question.explorer.next.page", (item) => nextPage(item)),
		commands.registerCommand("leetcode.question.submit", (language) => questionSubmit(language)),
		commands.registerCommand("leetcode.question.test", (language) => questionTest(language)),
	);

	languageService.register(Languages.rust, rustServiceProvider);
	languageService.register(Languages.java, javaServiceProvider);
}

// noinspection JSUnusedGlobalSymbols
export function deactivate() {
	console.log('LeetCodeUltimate 插件停用');
}
