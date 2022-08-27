/* eslint-disable @typescript-eslint/naming-convention */
import { leetCodeApi } from "./common";

/**
 * 提交解决方案
 */
export const submitSolution = (args: SubmitSolutionArgs) => leetCodeApi<{ id: string }>({
    command: "submitSolution",
    args
}).then(r => {
    const {submission_id} = r as any;
    return {id: submission_id};
});


// noinspection JSUnusedGlobalSymbols
export class SubmitSolutionArgs {
    constructor(
        public questionSlug: string,
        public question_id: number,
        public lang: string,
        public typed_code: string,
        public test_mode: boolean = false,
        public test_judge: string = "",
    ) {
    }

}