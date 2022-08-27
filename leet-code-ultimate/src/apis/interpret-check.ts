/* eslint-disable @typescript-eslint/naming-convention */
import { leetCodeApi } from "./common";

/**
 * 执行测试
 */
export const interpretCheck = (args: { id: string }) => leetCodeApi<InterpretCheck>({
    command: "interpretCheck",
    args
});

export type InterpretCheck = {
    state: "PENDING" | "STARTED" | "SUCCESS"
    run_success?: boolean
    full_compile_error?: string
    full_runtime_error?: string
    status_runtime?: string
    code_answer?: any[]
    expected_code_answer?: any[]
    status_msg?: string | "Compile Error" | "Runtime Error"
    status_memory?: string
};