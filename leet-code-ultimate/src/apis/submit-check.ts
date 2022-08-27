/* eslint-disable @typescript-eslint/naming-convention */
import { leetCodeApi } from "./common";

/**
 * 执行测试
 */
export const submitCheck = (args: { id: string }) => leetCodeApi<SubmitCheck>({
    command: "submitCheck",
    args
});

export type SubmitCheck = {
    state: "PENDING" | "STARTED" | "SUCCESS"
    run_success?: boolean
    full_compile_error?: string
    full_runtime_error?: string
    status_runtime?: string
    code_answer?: any[]
    status_msg?: string | "Compile Error" | "Runtime Error" | "Accepted"
    status_memory?: string
    total_correct?: number
    total_testcases?: number
    code_output?: string
    expected_output?: string
    last_testcase?: string
    runtime_percentile?: number
    memory_percentile?: number
};