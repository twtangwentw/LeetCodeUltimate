import { configurationUtil } from "../utils/ConfigurationUtil";
import * as path from "path";
import { Languages, SYNC_END_FLAG } from "../common";
import * as fs from "fs-extra";
import { LanguageServiceProviderAbstract } from "./LanguageServiceProviderAbstract";

class JavaServiceProvider extends LanguageServiceProviderAbstract {

    protected language = Languages.java;

    protected template = "java-code.rs.txt";

    protected regex = `([\\s\\S]*)\\s+// ${SYNC_END_FLAG} //\\s*// QuestionId: (\\d+)[\\s\\S]*/\\*.*\\s+([\\s\\S]*)\\s+\\*/`;

    protected dirPath = async () => path.join(await configurationUtil.getWorkPath() as string, "java");

    protected filePath = async() => path.join(await this.dirPath(), "Main.java");

    protected async initEnv(): Promise<void> {
        const javaPath = await this.filePath();
        return fs.pathExists(javaPath).then(res => {
            if (!res) {
                return fs.createFile(javaPath);
            }
        });
    }

}

export const javaServiceProvider = new JavaServiceProvider();