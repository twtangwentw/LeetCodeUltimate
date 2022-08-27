
export enum Languages {
    rust = "Rust",
    java = "Java"
}

export const languageMap: Map<string, Languages> = new Map([
    ["Rust", Languages.rust],
    ["rust", Languages.rust],
    ["Java", Languages.java],
    ["java", Languages.java],
]);

export const languageMapLeetCode: Map<Languages, string> = new Map([
   [Languages.rust, "rust"],
   [Languages.java, "java"]
]);

export const SYNC_END_FLAG = "@LEETCODE-ULTIMATE@SYNC-END@";
export const INFO_END_FLAG = "@LEETCODE-ULTIMATE@INFO-END@";
export const CASE_END_FLAG = "@LEETCODE-ULTIMATE@CASE-END@";