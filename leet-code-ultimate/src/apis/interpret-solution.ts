/* eslint-disable @typescript-eslint/naming-convention */
import { leetCodeApi } from "./common";

/**
 * 执行测试
 */
export const interpretSolution = (args: InterpretSolutionArgs) => leetCodeApi<InterpretSolution>({
    command: "interpretSolution",
    args
}).then(r => {
    const {interpret_id, interpret_expected_id, test_case} = r as any;
    return {interpretId: interpret_id, interpretExpectedId: interpret_expected_id, testCase: test_case};
});


// noinspection JSUnusedGlobalSymbols
export class InterpretSolutionArgs {
    constructor(
        public titleSlug: string,
        public question_id: number,
        public lang: string,
        public typed_code: string,
        public data_input: string,
        public judge_type: string,
        public test_mode: boolean = false,
        public test_judge: string = "",
    ) {
    }

}

export type InterpretSolution = {
    interpretId: string
    interpretExpectedId: string
};