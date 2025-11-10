/**
 * Execution Module - SDK Client
 *
 * Provides TypeScript SDK for executing code and notebooks
 */

import { CodePostHTTP } from "../http";

/**
 * Result of code or notebook execution
 */
export interface ExecutionResult {
    success: boolean;
    stdout?: string;
    stderr?: string;
    error?: string | null;
    execution_time: number;
    output_data?: Record<string, any>;
    timestamp: string;
}

/**
 * Result of file execution (includes file metadata)
 */
export interface FileExecutionResult extends ExecutionResult {
    file_id: number;
    file_name: string;
    submission_id: number;
}

/**
 * Notebook cell output
 */
export interface NotebookCellOutput {
    output_type: string;
    text?: string;
    name?: string;
    data?: Record<string, any>;
    execution_count?: number;
    ename?: string;
    evalue?: string;
    traceback?: string[];
}

/**
 * Notebook cell with outputs
 */
export interface NotebookCell {
    source: string;
    outputs: NotebookCellOutput[];
    execution_count: number | null;
}

/**
 * Request to execute code
 */
export interface CodeExecutionRequest {
    code: string;
    language: string;
    timeout?: number;
    working_dir?: string;
}

/**
 * Request to execute notebook
 */
export interface NotebookExecutionRequest {
    notebook_content: string;
    timeout?: number;
    kernel_name?: string;
}

/**
 * Request to execute notebook cell
 */
export interface NotebookCellExecutionRequest {
    cell_code: string;
    cell_index?: number;
    timeout?: number;
    kernel_name?: string;
}

/**
 * Request to execute a file
 */
export interface FileExecutionRequest {
    file_id: number;
    timeout?: number;
}

/**
 * Execution SDK Client
 */
export const Execution = {
    /**
     * Execute arbitrary code in a specified language
     *
     * @param request Code execution request
     * @returns Execution result with outputs
     *
     * @example
     * ```ts
     * const result = await Execution.executeCode({
     *   code: "print('Hello World')",
     *   language: "python",
     *   timeout: 30
     * });
     *
     * if (result.success) {
     *   console.log(result.stdout);
     * } else {
     *   console.error(result.error);
     * }
     * ```
     */
    executeCode: async (request: CodeExecutionRequest): Promise<ExecutionResult> => {
        return await CodePostHTTP.post<ExecutionResult>("/autograder/execute/code/", request);
    },

    /**
     * Execute a complete Jupyter notebook
     *
     * @param request Notebook execution request
     * @returns Execution result with notebook outputs
     *
     * @example
     * ```ts
     * const result = await Execution.executeNotebook({
     *   notebook_content: JSON.stringify(notebookJSON),
     *   timeout: 60,
     *   kernel_name: "python3"
     * });
     *
     * if (result.success && result.output_data) {
     *   const cells = result.output_data.cells as NotebookCell[];
     *   cells.forEach(cell => {
     *     console.log('Cell outputs:', cell.outputs);
     *   });
     * }
     * ```
     */
    executeNotebook: async (request: NotebookExecutionRequest): Promise<ExecutionResult> => {
        return await CodePostHTTP.post<ExecutionResult>("/autograder/execute/notebook/", request);
    },

    /**
     * Execute a single notebook cell
     *
     * @param request Notebook cell execution request
     * @returns Execution result with cell output
     *
     * @example
     * ```ts
     * const result = await Execution.executeNotebookCell({
     *   cell_code: "import pandas as pd\nprint(pd.__version__)",
     *   cell_index: 0,
     *   timeout: 30
     * });
     *
     * if (result.success && result.output_data) {
     *   console.log('Cell output:', result.output_data.cell);
     * }
     * ```
     */
    executeNotebookCell: async (request: NotebookCellExecutionRequest): Promise<ExecutionResult> => {
        return await CodePostHTTP.post<ExecutionResult>("/autograder/execute/notebook-cell/", request);
    },

    /**
     * Execute a codePost file (code or notebook)
     *
     * Automatically detects file type and executes appropriately.
     * Requires permission to access the file's submission.
     *
     * @param request File execution request
     * @returns Execution result with file metadata
     *
     * @example
     * ```ts
     * const result = await Execution.executeFile({
     *   file_id: 12345,
     *   timeout: 30
     * });
     *
     * console.log(`Executed ${result.file_name}`);
     * if (result.success) {
     *   console.log(result.stdout);
     * }
     * ```
     */
    executeFile: async (request: FileExecutionRequest): Promise<FileExecutionResult> => {
        return await CodePostHTTP.post<FileExecutionResult>("/autograder/execute/file/", request);
    },
};
