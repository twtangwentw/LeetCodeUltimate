import { Disposable, languages } from "vscode";
import { leetCodeCodeLensProvider } from "./LeetCodeCodeLensProvider";

/**
 * CodeLens 控制器
 */
class CodeLensController implements Disposable {
    private readonly registeredProvider: Disposable[] = [];

    constructor() {
        this.registeredProvider.push(
            languages.registerCodeLensProvider({scheme: "file"}, leetCodeCodeLensProvider)
        );
    }

    public dispose(): void {
        if (this.registeredProvider) {
            this.registeredProvider.forEach(p => p.dispose());
        }
    }
}

export const codeLensController: CodeLensController = new CodeLensController();