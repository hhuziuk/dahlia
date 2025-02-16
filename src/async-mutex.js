// export class AsyncMutex {
//     constructor() {
//         this.buffer = new SharedArrayBuffer(4);
//         this.data = new Int32Array(this.buffer);
//         Atomics.store(this.data, 0, 0); // 1 - is locked, 0 - is unlocked
//         this.waiter = [];
//     }
//
//     async lock(timeout = Infinity) {
//         const startTime = Date.now();
//         return new Promise((resolve, reject) => {
//             const isLocked = Atomics.compareExchange(this.data, 0, 0, 1) === 0;
//             if (isLocked) {
//                 resolve();
//                 return;
//             }
//
//             const remainingTime = timeout - (Date.now() - startTime);
//             if (remainingTime <= 0) {
//                 reject(new Error("async-lock: timeout waiting for lock"));
//                 return;
//             }
//
//             const result = Atomics.waitAsync(this.data, 0, 1, remainingTime);
//             resolve(result);
//
//             if (result.value === "timed-out") {
//                 reject(new Error("syncLock: Timeout waiting for lock"));
//                 return;
//             }
//         })
//     }
//
//     async unlock(){
//         if (Atomics.load(this.data, 0) === 0) {
//             throw new Error("unlock() called on an unlocked mutex");
//         }
//
//         Atomics.store(this.data, 0, 0);
//         Atomics.notify(this.data, 0, 1);
//
//
//     }
// }