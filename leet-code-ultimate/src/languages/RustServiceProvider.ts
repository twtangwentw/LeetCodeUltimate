import { exec } from "child_process";
import { configurationUtil } from "../utils/ConfigurationUtil";
import * as path from "path";
import * as fs from "fs-extra";
import { Languages, SYNC_END_FLAG } from "../common";
import { LanguageServiceProviderAbstract } from "./LanguageServiceProviderAbstract";

/**
 * Rust 的服务类
 */
class RustServiceProvider extends LanguageServiceProviderAbstract {

    protected language = Languages.rust;

    protected template = "rust-code.rs.txt";

    protected regex = `([\\s\\S]*)\\s+// ${SYNC_END_FLAG} //\\s*// QuestionId: (\\d+)[\\s\\S]*/\\*.*\\s+([\\s\\S]*)\\s+\\*/`;

    protected dirPath = async () => path.join(await configurationUtil.getWorkPath() as string, "rust");

    protected filePath = async() => path.join(await this.dirPath(), "src", "main.rs");

    protected async initEnv(): Promise<void> {
        const rustPath = await this.dirPath();
        return new Promise((resolve) => {
            exec("cargo init " + rustPath, (error) => {
                if (!error) {
                    fs.removeSync(path.join(rustPath, ".git"));
                }
                resolve();
            });
        });
    }

}

export const rustServiceProvider = new RustServiceProvider();