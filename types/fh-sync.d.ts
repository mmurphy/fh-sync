declare module 'fh-sync' {

  interface PendingWorkerBackoff {
    strategy: string;
    max: string;
  }

  interface AckWorkerBackoff {
    strategy: string;
    max: string;
  }

  interface SyncWorkerBackoff {
    strategy: string;
    max: number;
  }

  interface SyncGlobalOptions {
    pendingWorkerInterval?: number;
    pendingWorkerConcurrency?: number;
    pendingWorkerBackoff?: PendingWorkerBackoff;
    ackWorkerInterval?: number;
    ackWorkerConcurrency?: number;
    ackWorkerBackoff?: AckWorkerBackoff;
    syncWorkerInterval?: number;
    syncWorkerConcurrency?: number;
    syncWorkerBackoff?: SyncWorkerBackoff;
    schedulerInterval?: number;
    schedulerLockMaxTime?: number;
    schedulerLockName?: string;
    datasetClientUpdateConcurrency?: number;
    collectStats?: boolean;
    statsRecordsToKeep?: number;
    collectStatsInterval?: number;
    metricsInfluxdbHost?: string;
    metricsInfluxdbPort?: number;
    metricsReportConcurrency?: number;
    useCache?: boolean;
    queueMessagesTTL?: string;
    datasetClientCleanerCheckFrequency?: string;
  }

  type StandardCb<T> = (err: Error | string | undefined, res: T | undefined) => void;
  type NoRespCb = (err: Error | string | undefined) => void;

  interface SyncInitOptions {
    /**
     * Value indicating how often the dataset client should be sync with the backend. Matches the clients default 
     * frequency. Value in seconds
     */
    syncFrequency?: number,

    /**
     * Value that will be used to decide if the dataset client is not active anymore.
     */
    clientSyncTimeout?: number,

    /**
     * Value that determines how long it should wait for the backend list operation to complete
     */
    backendListTimeout?: number,

    /**
    * Specify the max wait time the dataset can be scheduled to sync again after its previous schedule, in seconds.
    */
    maxScheduleWaitTime?: number
  }

  interface SyncInterceptParams {
    query_params: any;
    meta_data: any;
  }

  namespace Sync {
    function connect(mongoDBConnectionUrl: string, mongoDBConnectionOption: any, redisUrl: string, cb: StandardCb<void>)

    function init(dataset_id: string, options: SyncInitOptions, callback: StandardCb<void>): void;
    function invoke(dataset_id: string, options: any, callback: () => void): void;

    function stop(dataset_id: string, onStop: () => void): void;
    function stopAll(onstop: StandardCb<string[]>): void;

    function handleList(dataset_id: string, onList: (dataset_id: string, params: any, meta_data: any, callback: StandardCb<any>) => void): void;
    function globalHandleList(onList: (dataset_id: string, params: any, meta_data: any, callback: StandardCb<any>) => void): void;

    function handleCreate(dataset_id: string, onCreate: (dataset_id: string, data: any, meta_data: any, callback: StandardCb<any>) => void): void;
    function globalHandleCreate(onCreate: (dataset_id: string, params: any, meta_data: any, callback: StandardCb<any>) => void): void;

    function handleRead(dataset_id: string, onRead: (dataset_id: string, uid: any, meta_data: any, callback: StandardCb<any>) => void): void;
    function globalHandleRead(onRead: (dataset_id: string, uid: string, meta_data: any, callback: StandardCb<any>) => void): void;

    function handleUpdate(dataset_id: string, onUpdate: (dataset_id: string, uid: string, data: any, meta_data: any, callback: StandardCb<any>) => void): void;
    function globalHandleUpdate(onCreate: (dataset_id: string, uid: string, data: any, meta_data: any, callback: StandardCb<any>) => void): void;

    function handleDelete(dataset_id: string, onCreate: (dataset_id: string, uid: string, meta_data: any, callback: StandardCb<any>) => void): void;
    function globalHandleDelete(onCreate: (dataset_id: string, uid: string, meta_data: any, callback: StandardCb<any>) => void): void;

    function handleCollision(dataset_id: string, onCollision: (dataset_id: string, hash: string, timestamp: any, uid: string, pre: any, post: any, meta_data: any, callback: StandardCb<any>) => void): void;
    function globalHandleCollision(onCollision: (dataset_id: string, hash: string, timestamp: Date, uid: string, pre: any, post: any, meta_data: any, callback: StandardCb<any>) => void): void;

    function listCollisions(dataset_id: string, onList: (dataset_id: string, meta_data: any, callback: StandardCb<{ [hash: string]: any }>) => void): void;
    function globalListCollisions(onList: (dataset_id: string, meta_data: any, callback: StandardCb<{ [hash: string]: any }>) => void): void;

    function removeCollision(dataset_id: string, onRemove: (dataset_id: string, collision_hash: string, meta_data: any, callback: StandardCb<any>) => void): void;

    function interceptRequest(dataset_id: string, onIntercept: (dataset_id: string, interceptor_params: SyncInterceptParams, callback: NoRespCb) => void): void;
    function interceptResponse(): void;

    function setConfig(config: any): void;

    function globalInterceptRequest(onIntercept: (dataset_id: string, interceptor_params: SyncInterceptParams, callback: NoRespCb) => void): void;
    function globalInterceptResponse(): void;

    function setGlobalHashFn(hashFunction: (target: any) => string): void;
    function setRecordHashFn(hashFunction: (object: any) => any): void;

    // Legacy function please do not use.
    function toJSON(dataset_id: string, returnData: any, cb: (err: Error, data: any) => void): void;
  }
  export = Sync;
}