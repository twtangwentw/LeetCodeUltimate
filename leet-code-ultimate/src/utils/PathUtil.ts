import * as path from "path";
import * as os from "os";

class PathUtil {

    root: string = path.join(__dirname, "..", "..");

    resources: string = path.join(this.root, "resources");

    userDir: string = path.join(os.homedir());
}

export const pathUtil = new PathUtil();