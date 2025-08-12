import { WorkerPool } from "../primitives/worker-pool.js";

export interface TaskPayload {
  [key: string]: any;
}

export interface WorkerTaskPayload {
  id: number;
  type: string;
  payload: TaskPayload;
}

export class Scheduler {
  private workerPool: WorkerPool<
    { modulePath: string },
    WorkerTaskPayload,
    any
  >;
  private taskId: number;

  constructor(numWorkers: number, modulePath: string);

  start(): void;

  runTask<TPayload extends TaskPayload = any, TResult = any>(
    name: string,
    payload: TPayload,
  ): Promise<TResult>;

  stop(): Promise<void>;
}
