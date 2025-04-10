import { Worker } from "node:worker_threads";

interface TaskQueueItem<TData, TResult> {
  callbackId: number;
  data: TData;
  resolve: (value: TResult | PromiseLike<TResult>) => void;
  reject: (reason?: any) => void;
}

interface PoolWorker extends Worker {
  currentCallback?: number;
  currentResolve?: (value: any) => void;
  currentReject?: (reason?: any) => void;
}

export class WorkerPool<TWorkerData = any, TData = any, TResult = any> {
  private workerNumber: number;
  private workerPath: string;
  private workerPool: Set<PoolWorker>;
  private callbackIdCounter: number;
  private pendingTasks: number;
  private callbackQueue: TaskQueueItem<TData, TResult>[];
  private stopped: boolean;
  private workerData: TWorkerData;

  constructor(
    workerNumber: number | undefined,
    workerPath: string,
    workerData?: TWorkerData,
  );

  private initializeWorkers(): void;
  private createWorker(): void;
  private dispatchNextTask(): void;

  submit<TSubmitData = TData, TSubmitResult = TResult>(
    data: TSubmitData,
  ): Promise<TSubmitResult>;

  stop(): void;

  resume(): void;

  wait(): Promise<void>;

  terminate(): Promise<number>;
}

export interface WorkerPoolTaskMessage<TData = any> {
  id: number;
  data: TData;
}

export interface WorkerPoolResultMessage<TResult = any> {
  callbackId: number;
  result?: TResult;
  error?: any;
}
