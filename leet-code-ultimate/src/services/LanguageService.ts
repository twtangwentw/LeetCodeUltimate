import { Languages } from "../common";
import { configurationUtil } from "../utils/ConfigurationUtil";
import { Disposable } from "vscode";
import { QuestionData } from "../apis/get-question-data";
import * as fs from "fs-extra";
import * as path from "path";
import { LanguageServiceProviderAbstract } from "../languages/LanguageServiceProviderAbstract";

/**
 * 语言环境服务
 */
class LanguageService implements Disposable {
    private readonly languages: Record<string, LanguageServiceProviderAbstract> = {};

    dispose(): any {
    }

    /**
     * 注册语言的服务
     * @param language 语言
     * @param service 服务
     */
    register(language: Languages, service: LanguageServiceProviderAbstract) {
        this.languages[language] = service;
    };

    /**
     * 获取所有注册的语言
     */
    getLanguages(): string[] {
        return Object.keys(this.languages);
    }

    private async checkConfig(): Promise<LanguageServiceProviderAbstract> {
        let workPath = await configurationUtil.getWorkPath(true);
        if (!workPath) {
            return Promise.reject("请选择工作目录");
        }
        const language = await configurationUtil.getLanguage(true);
        if (!language) {
            return Promise.reject("请选择默认刷题语言");
        }
        return this.languages[language];
    }

    async openEditor(question: QuestionData): Promise<void> {
        return this.checkConfig().then(async provider => {
            const questionId = question.data.question.questionId;
            const questionFilePath = path.join(await configurationUtil.getWorkPath() as string, "questions", `${questionId}.json`);
            fs.createFileSync(questionFilePath);
            fs.writeFileSync(questionFilePath, JSON.stringify(question));
            return provider.openEditor(question);
        });
    }

    // private async closeEditors(): Promise<void[]> {
    //     const promises = Object.values(this.languages).map(ls => ls.closeEditor());
    //     return Promise.all(promises);
    // }

    /**
     * 获取提交或者测试需要的数据
     */
    async getTestOrSubmitQuestionData(language: Languages): Promise<TestOrSubmitQuestionData> {

        const ls = this.languages[language];
        if (!ls) {
            return Promise.reject("不支持的语言" + language);
        }
        return ls.getQuestionData().then(async base => {
            const questionFilePath = path.join(await configurationUtil.getWorkPath() as string, "questions", `${base.id}.json`);
            const data: QuestionData = JSON.parse(fs.readFileSync(questionFilePath).toString());
            const {titleSlug, judgeType} = data.data.question;
            return {
                titleSlug,
                judgeType,
                ...base
            };
        });
    }
}

export const languageService = new LanguageService();

/**
 * 提交或者测试需要的数据
 */
export type TestOrSubmitQuestionData = {
    code: string,
    id: number,
    testCase: string,
    titleSlug: string,
    judgeType: string
};