import { Disposable, OutputChannel, window } from "vscode";
import * as moment from "moment";

/**
 * LeetCode Ultimate 测试或提交输出通道
 */
class LeetCodeOutputChannel implements Disposable {

    private channel: OutputChannel;

    dispose(): any {
        this.channel.dispose();
    }

    constructor() {
        this.channel = window.createOutputChannel("LeetCode Ultimate");
    }

    show(focus: boolean = true) {
        this.channel.show(!focus);
    }

    append(value: string) {
        this.channel.appendLine("\n\n\n===================\n" + moment().format("yyyy-MM-DD HH:mm:ss"));
        this.channel.appendLine(value);
    }
}

export const leetCodeOutputChannel = new LeetCodeOutputChannel();