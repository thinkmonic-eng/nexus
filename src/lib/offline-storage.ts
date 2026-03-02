// Offline storage utilities using IndexedDB

const DB_NAME = 'nexus-offline-db';
const DB_VERSION = 1;
const STORES = {
  TASKS: 'tasks',
  PROJECTS: 'projects',
  SYNC_QUEUE: 'syncQueue'
};

let db: IDBDatabase | null = null;

export async function initOfflineStorage(): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve();
    };
    
    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      
      if (!database.objectStoreNames.contains(STORES.TASKS)) {
        const taskStore = database.createObjectStore(STORES.TASKS, { keyPath: 'id' });
        taskStore.createIndex('status', 'status', { unique: false });
        taskStore.createIndex('projectId', 'projectId', { unique: false });
      }
      
      if (!database.objectStoreNames.contains(STORES.PROJECTS)) {
        database.createObjectStore(STORES.PROJECTS, { keyPath: 'id' });
      }
      
      if (!database.objectStoreNames.contains(STORES.SYNC_QUEUE)) {
        const syncStore = database.createObjectStore(STORES.SYNC_QUEUE, { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        syncStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
}

export async function saveTasks(tasks: any[]): Promise<void> {
  if (!db) await initOfflineStorage();
  
  const transaction = db!.transaction([STORES.TASKS], 'readwrite');
  const store = transaction.objectStore(STORES.TASKS);
  
  for (const task of tasks) {
    await new Promise<void>((resolve, reject) => {
      const request = store.put(task);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export async function getTasks(): Promise<any[]> {
  if (!db) await initOfflineStorage();
  
  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([STORES.TASKS], 'readonly');
    const store = transaction.objectStore(STORES.TASKS);
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function queueSyncAction(action: {
  type: 'create' | 'update' | 'delete';
  entity: 'task' | 'project';
  data: any;
}): Promise<void> {
  if (!db) await initOfflineStorage();
  
  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([STORES.SYNC_QUEUE], 'readwrite');
    const store = transaction.objectStore(STORES.SYNC_QUEUE);
    
    const request = store.add({
      ...action,
      timestamp: Date.now(),
      synced: false
    });
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getPendingSyncActions(): Promise<any[]> {
  if (!db) await initOfflineStorage();
  
  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([STORES.SYNC_QUEUE], 'readonly');
    const store = transaction.objectStore(STORES.SYNC_QUEUE);
    const index = store.index('timestamp');
    const request = index.getAll();
    
    request.onsuccess = () => resolve(request.result.filter(item => !item.synced));
    request.onerror = () => reject(request.error);
  });
}

export async function markSyncActionComplete(id: number): Promise<void> {
  if (!db) await initOfflineStorage();
  
  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([STORES.SYNC_QUEUE], 'readwrite');
    const store = transaction.objectStore(STORES.SYNC_QUEUE);
    
    const getRequest = store.get(id);
    getRequest.onsuccess = () => {
      const data = getRequest.result;
      if (data) {
        data.synced = true;
        const putRequest = store.put(data);
        putRequest.onsuccess = () => resolve();
        putRequest.onerror = () => reject(putRequest.error);
      } else {
        resolve();
      }
    };
    getRequest.onerror = () => reject(getRequest.error);
  });
}

export function clearOfflineStorage(): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DB_NAME);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
