import { Uri, window, workspace } from "vscode";
import { languageService } from "../services/LanguageService";
import * as path from "path";
import { pathUtil } from "./PathUtil";

class ConfigurationUtil {

    private readonly config = () => workspace.getConfiguration("leet.code");

    /**
     * 获取工作目录配置
     * @param select 如果为空是否出现选择
     */
    async getWorkPath(select: boolean = false): Promise<string | undefined> {
        return new Promise(async (resolve) => {
            let workPath = this.config().get<string>("work.path");
            if (!workPath && select) {
                workPath = await window.showOpenDialog({
                    defaultUri: Uri.file(path.join(pathUtil.userDir, ".leet-code-ultimate")),
                    canSelectMany: false,
                    canSelectFolders: true,
                    canSelectFiles: false,
                    openLabel: "选择为 Leet Code Ultimate 工作目录"
                }).then(uri => uri?.[0]?.path);
                if (workPath) {
                    this.updateWorkPath(workPath);
                }
            }
            resolve(workPath);
        });
        // return this.config.get("work.path");
    };

    /**
     * 更新工作目录配置
     */
    updateWorkPath(value: string | undefined) {
        if (value && value.match(/\/\w:\//)) {
            value = value.replace("/", "");
        }
        this.config().update("work.path", value, true);
    }

    /**
     * 获取配置的刷题语言
     * @param select 如果为空，是否出现选择
     */
    async getLanguage(select: boolean = false): Promise<string | undefined> {
        return new Promise(async (resolve) => {
            let language = this.config().get<string>("language");
            if (!language && select) {
                language = await window.showQuickPick(languageService.getLanguages(), {
                    placeHolder: "选择默认刷题语言"
                });
                if (language) {
                    this.updateLanguage(language);
                }
            }
            resolve(language);
        });
    }

    /**
     * 更新刷题语言配置
     */
    updateLanguage(value: string | undefined) {
        this.config().update("language", value, true);
    };
}

export const configurationUtil = new ConfigurationUtil();