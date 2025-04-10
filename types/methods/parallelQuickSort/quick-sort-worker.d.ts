import { QuickSortWorkerData } from "./parallel-quick-sort";

export type QuickSortWorkerMessage = "sorted";

declare const workerData: QuickSortWorkerData;

declare const parentPort: {
  postMessage(message: QuickSortWorkerMessage): void;
} | null;
