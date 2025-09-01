// File: src/concepts/storage/indexeddb.js
// Browser Storage - IndexedDB in JavaScript

export const indexedDBContent = {
  title: "IndexedDB",
  description: "Master IndexedDB for client-side database storage and complex data management",
  
  theory: {
    introduction: `
      IndexedDB is a powerful client-side database that allows you to store large amounts 
      of structured data, including files and blobs. Unlike localStorage and sessionStorage 
      which are simple key-value stores, IndexedDB is a full-featured database with support 
      for transactions, indexes, and complex queries. It's asynchronous and provides much 
      larger storage capacity (typically hundreds of MB to GB).
    `,
    
    concepts: [
      {
        name: "Basic IndexedDB Operations",
        explanation: "Opening databases, creating object stores, and basic CRUD operations",
        example: `
// Basic IndexedDB wrapper class
class IndexedDBManager {
  constructor(dbName, version = 1) {
    this.dbName = dbName;
    this.version = version;
    this.db = null;
  }
  
  // Open database connection
  async openDB(storeConfigs = []) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => {
        console.error('Failed to open IndexedDB:', request.error);
        reject(request.error);
      };
      
      request.onsuccess = () => {
        this.db = request.result;
        console.log(\`IndexedDB '\${this.dbName}' opened successfully\`);
        resolve(this.db);
      };
      
      // Handle database upgrades/creation
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        console.log(\`Upgrading database from version \${event.oldVersion} to \${event.newVersion}\`);
        
        // Create object stores
        storeConfigs.forEach(config => {
          if (!db.objectStoreNames.contains(config.name)) {
            const store = db.createObjectStore(config.name, {
              keyPath: config.keyPath || 'id',
              autoIncrement: config.autoIncrement !== false
            });
            
            // Create indexes
            if (config.indexes) {
              config.indexes.forEach(index => {
                store.createIndex(index.name, index.keyPath, {
                  unique: index.unique || false,
                  multiEntry: index.multiEntry || false
                });
              });
            }
            
            console.log(\`Created object store: \${config.name}\`);
          }
        });
      };
    });
  }
  
  // Generic method to perform transactions
  async performTransaction(storeName, mode, operation) {
    if (!this.db) {
      throw new Error('Database not opened. Call openDB() first.');
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], mode);
      const store = transaction.objectStore(storeName);
      
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      
      try {
        const result = operation(store);
        
        // Handle requests that return values
        if (result && typeof result.onsuccess !== 'undefined') {
          result.onsuccess = () => resolve(result.result);
          result.onerror = () => reject(result.error);
        } else {
          resolve(result);
        }
      } catch (error) {
        reject(error);
      }
    });
  }
  
  // Add item to store
  async add(storeName, item) {
    return this.performTransaction(storeName, 'readwrite', (store) => {
      return store.add(item);
    });
  }
  
  // Put (add or update) item in store
  async put(storeName, item) {
    return this.performTransaction(storeName, 'readwrite', (store) => {
      return store.put(item);
    });
  }
  
  // Get item by key
  async get(storeName, key) {
    return this.performTransaction(storeName, 'readonly', (store) => {
      return store.get(key);
    });
  }
  
  // Get all items
  async getAll(storeName) {
    return this.performTransaction(storeName, 'readonly', (store) => {
      return store.getAll();
    });
  }
  
  // Delete item by key
  async delete(storeName, key) {
    return this.performTransaction(storeName, 'readwrite', (store) => {
      return store.delete(key);
    });
  }
  
  // Clear all items from store
  async clear(storeName) {
    return this.performTransaction(storeName, 'readwrite', (store) => {
      return store.clear();
    });
  }
  
  // Count items in store
  async count(storeName) {
    return this.performTransaction(storeName, 'readonly', (store) => {
      return store.count();
    });
  }
  
  // Get items using an index
  async getByIndex(storeName, indexName, key) {
    return this.performTransaction(storeName, 'readonly', (store) => {
      const index = store.index(indexName);
      return index.get(key);
    });
  }
  
  // Get all items using an index
  async getAllByIndex(storeName, indexName, key) {
    return this.performTransaction(storeName, 'readonly', (store) => {
      const index = store.index(indexName);
      return index.getAll(key);
    });
  }
  
  // Cursor-based iteration
  async iterate(storeName, callback, direction = 'next') {
    return this.performTransaction(storeName, 'readonly', (store) => {
      const request = store.openCursor(null, direction);
      
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          callback(cursor.value, cursor.key);
          cursor.continue();
        }
      };
      
      return request;
    });
  }
  
  // Close database connection
  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
      console.log('IndexedDB connection closed');
    }
  }
  
  // Delete entire database
  static async deleteDatabase(dbName) {
    return new Promise((resolve, reject) => {
      const deleteRequest = indexedDB.deleteDatabase(dbName);
      
      deleteRequest.onsuccess = () => {
        console.log(\`Database '\${dbName}' deleted successfully\`);
        resolve();
      };
      
      deleteRequest.onerror = () => {
        console.error(\`Failed to delete database '\${dbName}':\`, deleteRequest.error);
        reject(deleteRequest.error);
      };
      
      deleteRequest.onblocked = () => {
        console.warn('Database deletion blocked. Close all tabs using this database.');
      };
    });
  }
}

// Usage example
async function basicIndexedDBExample() {
  console.log('=== Basic IndexedDB Example ===');
  
  const dbManager = new IndexedDBManager('MyAppDB', 1);
  
  try {
    // Open database and create stores
    await dbManager.openDB([
      {
        name: 'users',
        keyPath: 'id',
        autoIncrement: true,
        indexes: [
          { name: 'email', keyPath: 'email', unique: true },
          { name: 'name', keyPath: 'name' },
          { name: 'department', keyPath: 'department' }
        ]
      },
      {
        name: 'products',
        keyPath: 'id',
        autoIncrement: true,
        indexes: [
          { name: 'category', keyPath: 'category' },
          { name: 'price', keyPath: 'price' }
        ]
      }
    ]);
    
    // Add some users
    await dbManager.put('users', {
      name: 'John Doe',
      email: 'john@example.com',
      department: 'Engineering',
      age: 30
    });
    
    await dbManager.put('users', {
      name: 'Jane Smith', 
      email: 'jane@example.com',
      department: 'Marketing',
      age: 28
    });
    
    await dbManager.put('users', {
      name: 'Bob Johnson',
      email: 'bob@example.com', 
      department: 'Engineering',
      age: 35
    });
    
    // Get all users
    const allUsers = await dbManager.getAll('users');
    console.log('All users:', allUsers);
    
    // Get user by email index
    const johnUser = await dbManager.getByIndex('users', 'email', 'john@example.com');
    console.log('User found by email:', johnUser);
    
    // Get users by department
    const engineers = await dbManager.getAllByIndex('users', 'department', 'Engineering');
    console.log('Engineers:', engineers);
    
    // Count total users
    const userCount = await dbManager.count('users');
    console.log('Total users:', userCount);
    
    // Add some products
    await dbManager.put('products', {
      name: 'Laptop',
      category: 'Electronics',
      price: 999.99,
      inStock: true
    });
    
    await dbManager.put('products', {
      name: 'Coffee Mug',
      category: 'Home',
      price: 12.99,
      inStock: true
    });
    
    // Iterate through products
    console.log('Iterating through products:');
    await dbManager.iterate('products', (product, key) => {
      console.log(\`Product \${key}: \${product.name} - $\${product.price}\`);
    });
    
    // Clean up
    dbManager.close();
    
  } catch (error) {
    console.error('IndexedDB operation failed:', error);
  }
}

// Run the basic example
basicIndexedDBExample();
        `
      },
      
      {
        name: "Advanced IndexedDB Features",
        explanation: "Complex queries, transactions, and database design patterns",
        example: `
// Advanced IndexedDB class with complex operations
class AdvancedIndexedDB {
  constructor(dbName, version = 1) {
    this.dbName = dbName;
    this.version = version;
    this.db = null;
    this.stores = new Map();
  }
  
  async initialize(schema) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        schema.forEach(storeSchema => {
          this.createObjectStore(db, storeSchema);
        });
      };
    });
  }
  
  createObjectStore(db, storeSchema) {
    const { name, config, indexes = [] } = storeSchema;
    
    if (db.objectStoreNames.contains(name)) {
      return; // Store already exists
    }
    
    const store = db.createObjectStore(name, config);
    this.stores.set(name, storeSchema);
    
    // Create indexes
    indexes.forEach(indexConfig => {
      store.createIndex(
        indexConfig.name, 
        indexConfig.keyPath, 
        indexConfig.options || {}
      );
    });
    
    console.log(\`Created store '\${name}' with \${indexes.length} indexes\`);
  }
  
  // Batch operations
  async batchAdd(storeName, items) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const results = [];
      
      transaction.oncomplete = () => resolve(results);
      transaction.onerror = () => reject(transaction.error);
      
      items.forEach(item => {
        const request = store.add(item);
        request.onsuccess = () => results.push(request.result);
      });
    });
  }
  
  async batchPut(storeName, items) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const results = [];
      
      transaction.oncomplete = () => resolve(results);
      transaction.onerror = () => reject(transaction.error);
      
      items.forEach(item => {
        const request = store.put(item);
        request.onsuccess = () => results.push(request.result);
      });
    });
  }
  
  async batchDelete(storeName, keys) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      let deletedCount = 0;
      
      transaction.oncomplete = () => resolve(deletedCount);
      transaction.onerror = () => reject(transaction.error);
      
      keys.forEach(key => {
        const request = store.delete(key);
        request.onsuccess = () => deletedCount++;
      });
    });
  }
  
  // Range queries
  async getRange(storeName, lowerBound, upperBound, indexName = null) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const source = indexName ? store.index(indexName) : store;
      
      const range = IDBKeyRange.bound(lowerBound, upperBound);
      const request = source.getAll(range);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  // Advanced cursor operations with filtering
  async filter(storeName, filterFn, indexName = null, direction = 'next') {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const source = indexName ? store.index(indexName) : store;
      
      const results = [];
      const request = source.openCursor(null, direction);
      
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          if (filterFn(cursor.value, cursor.key)) {
            results.push(cursor.value);
          }
          cursor.continue();
        } else {
          resolve(results);
        }
      };
      
      request.onerror = () => reject(request.error);
    });
  }
  
  // Search with multiple criteria
  async search(storeName, criteria) {
    const allItems = await this.getAll(storeName);
    
    return allItems.filter(item => {
      return Object.entries(criteria).every(([field, value]) => {
        if (typeof value === 'string') {
          return item[field] && item[field].toLowerCase().includes(value.toLowerCase());
        } else if (typeof value === 'object' && value.min !== undefined && value.max !== undefined) {
          return item[field] >= value.min && item[field] <= value.max;
        } else {
          return item[field] === value;
        }
      });
    });
  }
  
  // Aggregate operations
  async aggregate(storeName, operations) {
    const allItems = await this.getAll(storeName);
    const results = {};
    
    operations.forEach(op => {
      switch (op.type) {
        case 'count':
          results[op.name] = allItems.length;
          break;
          
        case 'sum':
          results[op.name] = allItems.reduce((sum, item) => {
            return sum + (parseFloat(item[op.field]) || 0);
          }, 0);
          break;
          
        case 'avg':
          const total = allItems.reduce((sum, item) => {
            return sum + (parseFloat(item[op.field]) || 0);
          }, 0);
          results[op.name] = allItems.length > 0 ? total / allItems.length : 0;
          break;
          
        case 'min':
          results[op.name] = Math.min(...allItems.map(item => parseFloat(item[op.field]) || 0));
          break;
          
        case 'max':
          results[op.name] = Math.max(...allItems.map(item => parseFloat(item[op.field]) || 0));
          break;
          
        case 'groupBy':
          results[op.name] = allItems.reduce((groups, item) => {
            const key = item[op.field];
            if (!groups[key]) groups[key] = [];
            groups[key].push(item);
            return groups;
          }, {});
          break;
      }
    });
    
    return results;
  }
  
  // Full-text search simulation
  async fullTextSearch(storeName, searchText, fields) {
    const items = await this.getAll(storeName);
    const searchTerms = searchText.toLowerCase().split(' ');
    
    return items.filter(item => {
      const itemText = fields.map(field => item[field] || '').join(' ').toLowerCase();
      return searchTerms.every(term => itemText.includes(term));
    });
  }
  
  // Pagination
  async paginate(storeName, pageSize, pageNumber, sortField = null, sortDirection = 'asc') {
    const allItems = await this.getAll(storeName);
    
    // Sort if specified
    if (sortField) {
      allItems.sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    const totalItems = allItems.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    return {
      items: allItems.slice(startIndex, endIndex),
      pagination: {
        currentPage: pageNumber,
        totalPages,
        totalItems,
        pageSize,
        hasNextPage: pageNumber < totalPages,
        hasPreviousPage: pageNumber > 1
      }
    };
  }
  
  // Basic getAll method
  async getAll(storeName) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  // Database statistics
  async getStatistics() {
    const stats = {
      dbName: this.dbName,
      version: this.version,
      stores: {}
    };
    
    for (const storeName of this.db.objectStoreNames) {
      const count = await this.count(storeName);
      stats.stores[storeName] = { count };
    }
    
    return stats;
  }
  
  async count(storeName) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.count();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  // Export data
  async exportData(storeNames = null) {
    const storesToExport = storeNames || Array.from(this.db.objectStoreNames);
    const exportData = {
      dbName: this.dbName,
      version: this.version,
      exportDate: new Date().toISOString(),
      data: {}
    };
    
    for (const storeName of storesToExport) {
      exportData.data[storeName] = await this.getAll(storeName);
    }
    
    return exportData;
  }
  
  // Import data
  async importData(importData) {
    const results = {};
    
    for (const [storeName, items] of Object.entries(importData.data)) {
      if (this.db.objectStoreNames.contains(storeName)) {
        try {
          await this.batchPut(storeName, items);
          results[storeName] = { success: true, count: items.length };
        } catch (error) {
          results[storeName] = { success: false, error: error.message };
        }
      } else {
        results[storeName] = { success: false, error: 'Store does not exist' };
      }
    }
    
    return results;
  }
}

// Usage example with advanced features
async function advancedIndexedDBExample() {
  console.log('\\n=== Advanced IndexedDB Example ===');
  
  const advancedDB = new AdvancedIndexedDB('AdvancedAppDB', 1);
  
  const schema = [
    {
      name: 'employees',
      config: { keyPath: 'id', autoIncrement: true },
      indexes: [
        { name: 'email', keyPath: 'email', options: { unique: true } },
        { name: 'department', keyPath: 'department' },
        { name: 'salary', keyPath: 'salary' },
        { name: 'hireDate', keyPath: 'hireDate' }
      ]
    },
    {
      name: 'projects',
      config: { keyPath: 'id', autoIncrement: true },
      indexes: [
        { name: 'name', keyPath: 'name' },
        { name: 'status', keyPath: 'status' },
        { name: 'budget', keyPath: 'budget' }
      ]
    }
  ];
  
  try {
    await advancedDB.initialize(schema);
    
    // Batch insert employees
    const employees = [
      { name: 'Alice Johnson', email: 'alice@company.com', department: 'Engineering', salary: 85000, hireDate: '2020-01-15' },
      { name: 'Bob Smith', email: 'bob@company.com', department: 'Marketing', salary: 65000, hireDate: '2019-03-20' },
      { name: 'Charlie Brown', email: 'charlie@company.com', department: 'Engineering', salary: 92000, hireDate: '2018-07-10' },
      { name: 'Diana Wilson', email: 'diana@company.com', department: 'Sales', salary: 70000, hireDate: '2021-02-01' },
      { name: 'Eve Davis', email: 'eve@company.com', department: 'Engineering', salary: 88000, hireDate: '2020-11-30' }
    ];
    
    await advancedDB.batchPut('employees', employees);
    console.log('Batch inserted', employees.length, 'employees');
    
    // Range query: employees with salary between 70k and 90k
    const midRangeSalaries = await advancedDB.getRange('employees', 70000, 90000, 'salary');
    console.log('Employees with 70k-90k salary:', midRangeSalaries.length);
    
    // Filter: Engineering employees hired in 2020
    const engineersHired2020 = await advancedDB.filter('employees', (emp) => {
      return emp.department === 'Engineering' && emp.hireDate.startsWith('2020');
    });
    console.log('Engineers hired in 2020:', engineersHired2020);
    
    // Search with multiple criteria
    const searchResults = await advancedDB.search('employees', {
      department: 'Engineering',
      salary: { min: 80000, max: 95000 }
    });
    console.log('Engineering employees with 80k-95k salary:', searchResults);
    
    // Aggregate operations
    const aggregates = await advancedDB.aggregate('employees', [
      { type: 'count', name: 'totalEmployees' },
      { type: 'avg', field: 'salary', name: 'averageSalary' },
      { type: 'max', field: 'salary', name: 'maxSalary' },
      { type: 'min', field: 'salary', name: 'minSalary' },
      { type: 'groupBy', field: 'department', name: 'byDepartment' }
    ]);
    
    console.log('Salary statistics:', {
      total: aggregates.totalEmployees,
      average: Math.round(aggregates.averageSalary),
      max: aggregates.maxSalary,
      min: aggregates.minSalary
    });
    
    console.log('Employees by department:', Object.keys(aggregates.byDepartment));
    
    // Full-text search
    const fullTextResults = await advancedDB.fullTextSearch('employees', 'alice engineering', ['name', 'department']);
    console.log('Full-text search results:', fullTextResults.map(emp => emp.name));
    
    // Pagination
    const paginatedResults = await advancedDB.paginate('employees', 2, 1, 'salary', 'desc');
    console.log('Page 1 (2 items, sorted by salary desc):', 
      paginatedResults.items.map(emp => \`\${emp.name}: $\${emp.salary}\`)
    );
    console.log('Pagination info:', paginatedResults.pagination);
    
    // Database statistics
    const stats = await advancedDB.getStatistics();
    console.log('Database statistics:', stats);
    
    // Export data
    const exportData = await advancedDB.exportData();
    console.log('Export data includes stores:', Object.keys(exportData.data));
    
  } catch (error) {
    console.error('Advanced IndexedDB operation failed:', error);
  }
}

// Run the advanced example
advancedIndexedDBExample();
        `
      },
      
      {
        name: "File and Blob Storage",
        explanation: "Storing files, images, and binary data in IndexedDB",
        example: `
// File storage manager using IndexedDB
class FileStorageManager {
  constructor(dbName = 'FileStorageDB', version = 1) {
    this.dbName = dbName;
    this.version = version;
    this.db = null;
  }
  
  async initialize() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Files store
        if (!db.objectStoreNames.contains('files')) {
          const filesStore = db.createObjectStore('files', { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          
          filesStore.createIndex('name', 'name', { unique: false });
          filesStore.createIndex('type', 'type', { unique: false });
          filesStore.createIndex('category', 'category', { unique: false });
          filesStore.createIndex('uploadDate', 'uploadDate', { unique: false });
          filesStore.createIndex('size', 'size', { unique: false });
        }
        
        // Thumbnails store
        if (!db.objectStoreNames.contains('thumbnails')) {
          db.createObjectStore('thumbnails', { keyPath: 'fileId' });
        }
        
        // Metadata store
        if (!db.objectStoreNames.contains('fileMetadata')) {
          const metadataStore = db.createObjectStore('fileMetadata', { 
            keyPath: 'fileId' 
          });
          metadataStore.createIndex('tags', 'tags', { multiEntry: true });
        }
      };
    });
  }
  
  // Store file with metadata
  async storeFile(file, metadata = {}) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['files', 'fileMetadata'], 'readwrite');
      const filesStore = transaction.objectStore('files');
      const metadataStore = transaction.objectStore('fileMetadata');
      
      const fileRecord = {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
        uploadDate: new Date().toISOString(),
        category: metadata.category || 'general',
        data: file // Store the actual file/blob
      };
      
      const filesRequest = filesStore.add(fileRecord);
      
      filesRequest.onsuccess = () => {
        const fileId = filesRequest.result;
        
        // Store additional metadata
        const metadataRecord = {
          fileId,
          description: metadata.description || '',
          tags: metadata.tags || [],
          customData: metadata.customData || {},
          createdAt: new Date().toISOString()
        };
        
        const metadataRequest = metadataStore.add(metadataRecord);
        
        metadataRequest.onsuccess = () => {
          resolve({ fileId, ...fileRecord });
        };
        
        metadataRequest.onerror = () => reject(metadataRequest.error);
      };
      
      filesRequest.onerror = () => reject(filesRequest.error);
    });
  }
  
  // Generate and store thumbnail for images
  async generateThumbnail(fileId, maxWidth = 200, maxHeight = 200) {
    const file = await this.getFile(fileId);
    
    if (!file || !file.data.type.startsWith('image/')) {
      throw new Error('File is not an image');
    }
    
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate thumbnail dimensions
        let { width, height } = img;
        const aspectRatio = width / height;
        
        if (width > height) {
          if (width > maxWidth) {
            width = maxWidth;
            height = width / aspectRatio;
          }
        } else {
          if (height > maxHeight) {
            height = maxHeight;
            width = height * aspectRatio;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and convert to blob
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((thumbnailBlob) => {
          const transaction = this.db.transaction(['thumbnails'], 'readwrite');
          const thumbnailsStore = transaction.objectStore('thumbnails');
          
          const thumbnailRecord = {
            fileId,
            thumbnail: thumbnailBlob,
            width,
            height,
            createdAt: new Date().toISOString()
          };
          
          const request = thumbnailsStore.put(thumbnailRecord);
          
          request.onsuccess = () => resolve(thumbnailRecord);
          request.onerror = () => reject(request.error);
        }, 'image/jpeg', 0.8);
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file.data);
    });
  }
  
  // Get file by ID
  async getFile(fileId) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['files'], 'readonly');
      const store = transaction.objectStore('files');
      const request = store.get(fileId);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  // Get file with metadata
  async getFileWithMetadata(fileId) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['files', 'fileMetadata'], 'readonly');
      const filesStore = transaction.objectStore('files');
      const metadataStore = transaction.objectStore('fileMetadata');
      
      let file, metadata;
      let completed = 0;
      
      const checkComplete = () => {
        completed++;
        if (completed === 2) {
          resolve({ file, metadata });
        }
      };
      
      const fileRequest = filesStore.get(fileId);
      fileRequest.onsuccess = () => {
        file = fileRequest.result;
        checkComplete();
      };
      fileRequest.onerror = () => reject(fileRequest.error);
      
      const metadataRequest = metadataStore.get(fileId);
      metadataRequest.onsuccess = () => {
        metadata = metadataRequest.result;
        checkComplete();
      };
      metadataRequest.onerror = () => reject(metadataRequest.error);
    });
  }
  
  // Get thumbnail
  async getThumbnail(fileId) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['thumbnails'], 'readonly');
      const store = transaction.objectStore('thumbnails');
      const request = store.get(fileId);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  // List files with filtering
  async listFiles(filter = {}) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['files'], 'readonly');
      const store = transaction.objectStore('files');
      const files = [];
      
      let source = store;
      let range = null;
      
      // Use index if filtering by indexed field
      if (filter.type) {
        source = store.index('type');
        range = IDBKeyRange.only(filter.type);
      } else if (filter.category) {
        source = store.index('category');
        range = IDBKeyRange.only(filter.category);
      }
      
      const request = source.openCursor(range);
      
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          const file = cursor.value;
          let include = true;
          
          // Apply additional filters
          if (filter.sizeMin && file.size < filter.sizeMin) include = false;
          if (filter.sizeMax && file.size > filter.sizeMax) include = false;
          if (filter.dateAfter && new Date(file.uploadDate) < new Date(filter.dateAfter)) include = false;
          if (filter.dateBefore && new Date(file.uploadDate) > new Date(filter.dateBefore)) include = false;
          if (filter.nameContains && !file.name.toLowerCase().includes(filter.nameContains.toLowerCase())) include = false;
          
          if (include) {
            files.push({
              id: file.id,
              name: file.name,
              type: file.type,
              size: file.size,
              uploadDate: file.uploadDate,
              category: file.category
            });
          }
          
          cursor.continue();
        } else {
          resolve(files);
        }
      };
      
      request.onerror = () => reject(request.error);
    });
  }
  
  // Search files by tags
  async searchByTags(tags) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['fileMetadata'], 'readonly');
      const store = transaction.objectStore('fileMetadata');
      const index = store.index('tags');
      const results = new Set();
      
      let completed = 0;
      const targetCompleted = tags.length;
      
      if (targetCompleted === 0) {
        resolve([]);
        return;
      }
      
      tags.forEach(tag => {
        const request = index.getAll(tag);
        
        request.onsuccess = () => {
          request.result.forEach(metadata => {
            results.add(metadata.fileId);
          });
          
          completed++;
          if (completed === targetCompleted) {
            resolve(Array.from(results));
          }
        };
        
        request.onerror = () => reject(request.error);
      });
    });
  }
  
  // Delete file and associated data
  async deleteFile(fileId) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['files', 'fileMetadata', 'thumbnails'], 'readwrite');
      
      transaction.oncomplete = () => resolve(true);
      transaction.onerror = () => reject(transaction.error);
      
      // Delete from all stores
      transaction.objectStore('files').delete(fileId);
      transaction.objectStore('fileMetadata').delete(fileId);
      transaction.objectStore('thumbnails').delete(fileId);
    });
  }
  
  // Get storage statistics
  async getStorageStats() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['files'], 'readonly');
      const store = transaction.objectStore('files');
      const request = store.openCursor();
      
      const stats = {
        totalFiles: 0,
        totalSize: 0,
        byType: {},
        byCategory: {},
        averageSize: 0
      };
      
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          const file = cursor.value;
          
          stats.totalFiles++;
          stats.totalSize += file.size;
          
          // Group by type
          if (!stats.byType[file.type]) {
            stats.byType[file.type] = { count: 0, size: 0 };
          }
          stats.byType[file.type].count++;
          stats.byType[file.type].size += file.size;
          
          // Group by category
          if (!stats.byCategory[file.category]) {
            stats.byCategory[file.category] = { count: 0, size: 0 };
          }
          stats.byCategory[file.category].count++;
          stats.byCategory[file.category].size += file.size;
          
          cursor.continue();
        } else {
          stats.averageSize = stats.totalFiles > 0 ? stats.totalSize / stats.totalFiles : 0;
          resolve(stats);
        }
      };
      
      request.onerror = () => reject(request.error);
    });
  }
  
  // Format file size
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Usage example
async function fileStorageExample() {
  console.log('\\n=== File Storage Example ===');
  
  const fileManager = new FileStorageManager();
  
  try {
    await fileManager.initialize();
    console.log('File storage initialized');
    
    // Create sample files (in real app, these would come from file inputs)
    const sampleFiles = [
      new File(['Hello World!'], 'hello.txt', { type: 'text/plain' }),
      new File(['{"name": "test"}'], 'data.json', { type: 'application/json' }),
      // Note: In real usage, you'd get these from file input elements
    ];
    
    // Store files with metadata
    for (const file of sampleFiles) {
      const metadata = {
        category: file.name.endsWith('.txt') ? 'documents' : 'data',
        description: \`Sample file: \${file.name}\`,
        tags: ['sample', 'test', file.type.split('/')[0]]
      };
      
      const result = await fileManager.storeFile(file, metadata);
      console.log(\`Stored file: \${result.name} (ID: \${result.fileId})\`);
      
      // For images, generate thumbnail
      if (file.type.startsWith('image/')) {
        try {
          const thumbnail = await fileManager.generateThumbnail(result.fileId);
          console.log(\`Generated thumbnail: \${thumbnail.width}x\${thumbnail.height}\`);
        } catch (error) {
          console.log('Could not generate thumbnail:', error.message);
        }
      }
    }
    
    // List all files
    const allFiles = await fileManager.listFiles();
    console.log('\\nAll files:', allFiles.map(f => \`\${f.name} (\${fileManager.formatFileSize(f.size)})\`));
    
    // Filter files
    const textFiles = await fileManager.listFiles({ type: 'text/plain' });
    console.log('Text files:', textFiles.map(f => f.name));
    
    // Search by tags
    const sampleFiles_tagged = await fileManager.searchByTags(['sample']);
    console.log('Files tagged "sample":', sampleFiles_tagged.length);
    
    // Get storage statistics
    const stats = await fileManager.getStorageStats();
    console.log('\\nStorage Statistics:');
    console.log(\`Total files: \${stats.totalFiles}\`);
    console.log(\`Total size: \${fileManager.formatFileSize(stats.totalSize)}\`);
    console.log(\`Average size: \${fileManager.formatFileSize(stats.averageSize)}\`);
    console.log('By type:', Object.entries(stats.byType).map(([type, data]) => 
      \`\${type}: \${data.count} files, \${fileManager.formatFileSize(data.size)}\`
    ));
    
  } catch (error) {
    console.error('File storage operation failed:', error);
  }
}

// Run the file storage example
fileStorageExample();
        `
      }
    ]
  },
  
  practicalExamples: [
    {
      title: "Offline-First Task Management App",
      description: "Complete task management system with offline support using IndexedDB",
      code: `
// Offline-First Task Management System
class OfflineTaskManager {
  constructor() {
    this.dbName = 'TaskManagerDB';
    this.version = 1;
    this.db = null;
    this.syncQueue = [];
    this.isOnline = navigator.onLine;
    
    this.setupEventListeners();
  }
  
  async initialize() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        console.log('Task Manager DB initialized');
        resolve(this.db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Tasks store
        if (!db.objectStoreNames.contains('tasks')) {
          const tasksStore = db.createObjectStore('tasks', { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          
          tasksStore.createIndex('status', 'status');
          tasksStore.createIndex('priority', 'priority');
          tasksStore.createIndex('dueDate', 'dueDate');
          tasksStore.createIndex('category', 'category');
          tasksStore.createIndex('createdAt', 'createdAt');
          tasksStore.createIndex('syncStatus', 'syncStatus');
        }
        
        // Categories store
        if (!db.objectStoreNames.contains('categories')) {
          const categoriesStore = db.createObjectStore('categories', { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          
          categoriesStore.createIndex('name', 'name', { unique: true });
        }
        
        // Sync queue store
        if (!db.objectStoreNames.contains('syncQueue')) {
          db.createObjectStore('syncQueue', { 
            keyPath: 'id', 
            autoIncrement: true 
          });
        }
        
        // Settings store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };
    });
  }
  
  setupEventListeners() {
    // Network status monitoring
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('Back online - syncing...');
      this.syncWithServer();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('Gone offline - queuing changes');
    });
  }
  
  // Task CRUD operations
  async createTask(taskData) {
    const task = {
      ...taskData,
      id: Date.now() + Math.random(), // Temporary ID for offline
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      syncStatus: this.isOnline ? 'pending' : 'offline'
    };
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['tasks', 'syncQueue'], 'readwrite');
      const tasksStore = transaction.objectStore('tasks');
      const syncStore = transaction.objectStore('syncQueue');
      
      transaction.oncomplete = () => {
        console.log('Task created:', task.title);
        resolve(task);
      };
      
      transaction.onerror = () => reject(transaction.error);
      
      // Add task
      tasksStore.add(task);
      
      // Queue for sync if online
      if (this.isOnline) {
        syncStore.add({
          action: 'CREATE',
          entityType: 'task',
          entityId: task.id,
          data: task,
          timestamp: new Date().toISOString()
        });
      }
    });
  }
  
  async updateTask(taskId, updates) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['tasks', 'syncQueue'], 'readwrite');
      const tasksStore = transaction.objectStore('tasks');
      const syncStore = transaction.objectStore('syncQueue');
      
      const getRequest = tasksStore.get(taskId);
      
      getRequest.onsuccess = () => {
        const task = getRequest.result;
        if (!task) {
          reject(new Error('Task not found'));
          return;
        }
        
        const updatedTask = {
          ...task,
          ...updates,
          updatedAt: new Date().toISOString(),
          syncStatus: this.isOnline ? 'pending' : 'offline'
        };
        
        const putRequest = tasksStore.put(updatedTask);
        
        putRequest.onsuccess = () => {
          // Queue for sync
          if (this.isOnline) {
            syncStore.add({
              action: 'UPDATE',
              entityType: 'task',
              entityId: taskId,
              data: updatedTask,
              timestamp: new Date().toISOString()
            });
          }
          
          console.log('Task updated:', updatedTask.title);
          resolve(updatedTask);
        };
        
        putRequest.onerror = () => reject(putRequest.error);
      };
      
      getRequest.onerror = () => reject(getRequest.error);
    });
  }
  
  async deleteTask(taskId) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['tasks', 'syncQueue'], 'readwrite');
      const tasksStore = transaction.objectStore('tasks');
      const syncStore = transaction.objectStore('syncQueue');
      
      transaction.oncomplete = () => {
        console.log('Task deleted:', taskId);
        resolve(true);
      };
      
      transaction.onerror = () => reject(transaction.error);
      
      // Mark as deleted instead of removing (for sync)
      const getRequest = tasksStore.get(taskId);
      
      getRequest.onsuccess = () => {
        const task = getRequest.result;
        if (task) {
          const deletedTask = {
            ...task,
            deleted: true,
            updatedAt: new Date().toISOString(),
            syncStatus: this.isOnline ? 'pending' : 'offline'
          };
          
          tasksStore.put(deletedTask);
          
          // Queue for sync
          if (this.isOnline) {
            syncStore.add({
              action: 'DELETE',
              entityType: 'task',
              entityId: taskId,
              timestamp: new Date().toISOString()
            });
          }
        }
      };
    });
  }
  
  async getTasks(filter = {}) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['tasks'], 'readonly');
      const store = transaction.objectStore('tasks');
      const tasks = [];
      
      let source = store;
      let range = null;
      
      // Use appropriate index
      if (filter.status) {
        source = store.index('status');
        range = IDBKeyRange.only(filter.status);
      } else if (filter.category) {
        source = store.index('category');
        range = IDBKeyRange.only(filter.category);
      } else if (filter.priority) {
        source = store.index('priority');
        range = IDBKeyRange.only(filter.priority);
      }
      
      const request = source.openCursor(range);
      
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          const task = cursor.value;
          
          // Skip deleted tasks
          if (task.deleted) {
            cursor.continue();
            return;
          }
          
          // Apply additional filters
          let include = true;
          
          if (filter.dueBefore && task.dueDate && new Date(task.dueDate) > new Date(filter.dueBefore)) {
            include = false;
          }
          
          if (filter.dueAfter && task.dueDate && new Date(task.dueDate) < new Date(filter.dueAfter)) {
            include = false;
          }
          
          if (filter.search) {
            const searchTerm = filter.search.toLowerCase();
            if (!task.title.toLowerCase().includes(searchTerm) && 
                !task.description.toLowerCase().includes(searchTerm)) {
              include = false;
            }
          }
          
          if (include) {
            tasks.push(task);
          }
          
          cursor.continue();
        } else {
          resolve(tasks);
        }
      };
      
      request.onerror = () => reject(request.error);
    });
  }
  
  async getTask(taskId) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['tasks'], 'readonly');
      const store = transaction.objectStore('tasks');
      const request = store.get(taskId);
      
      request.onsuccess = () => {
        const task = request.result;
        resolve(task && !task.deleted ? task : null);
      };
      
      request.onerror = () => reject(request.error);
    });
  }
  
  // Category management
  async createCategory(categoryData) {
    const category = {
      ...categoryData,
      createdAt: new Date().toISOString()
    };
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['categories'], 'readwrite');
      const store = transaction.objectStore('categories');
      const request = store.add(category);
      
      request.onsuccess = () => {
        category.id = request.result;
        resolve(category);
      };
      
      request.onerror = () => reject(request.error);
    });
  }
  
  async getCategories() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['categories'], 'readonly');
      const store = transaction.objectStore('categories');
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  // Analytics and reporting
  async getTaskStatistics() {
    const allTasks = await this.getTasks();
    const stats = {
      total: allTasks.length,
      byStatus: {},
      byPriority: {},
      byCategory: {},
      overdue: 0,
      completedThisWeek: 0
    };
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const today = new Date();
    
    allTasks.forEach(task => {
      // Count by status
      stats.byStatus[task.status] = (stats.byStatus[task.status] || 0) + 1;
      
      // Count by priority
      stats.byPriority[task.priority] = (stats.byPriority[task.priority] || 0) + 1;
      
      // Count by category
      stats.byCategory[task.category] = (stats.byCategory[task.category] || 0) + 1;
      
      // Count overdue
      if (task.dueDate && new Date(task.dueDate) < today && task.status !== 'completed') {
        stats.overdue++;
      }
      
      // Count completed this week
      if (task.status === 'completed' && 
          task.updatedAt && 
          new Date(task.updatedAt) > oneWeekAgo) {
        stats.completedThisWeek++;
      }
    });
    
    return stats;
  }
  
  // Sync operations
  async syncWithServer() {
    if (!this.isOnline) return;
    
    try {
      // Get sync queue
      const syncItems = await this.getSyncQueue();
      
      for (const item of syncItems) {
        try {
          // Simulate server sync
          await this.simulateServerSync(item);
          
          // Remove from sync queue
          await this.removeSyncItem(item.id);
          
          // Update sync status
          if (item.entityType === 'task') {
            await this.updateTaskSyncStatus(item.entityId, 'synced');
          }
          
        } catch (error) {
          console.error('Sync failed for item:', item.id, error);
        }
      }
      
      console.log(\`Synced \${syncItems.length} items\`);
      
    } catch (error) {
      console.error('Sync operation failed:', error);
    }
  }
  
  async getSyncQueue() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['syncQueue'], 'readonly');
      const store = transaction.objectStore('syncQueue');
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  async removeSyncItem(syncId) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['syncQueue'], 'readwrite');
      const store = transaction.objectStore('syncQueue');
      const request = store.delete(syncId);
      
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }
  
  async updateTaskSyncStatus(taskId, status) {
    const task = await this.getTask(taskId);
    if (task) {
      await this.updateTask(taskId, { syncStatus: status });
    }
  }
  
  // Simulate server sync (replace with actual API calls)
  async simulateServerSync(syncItem) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(\`Synced: \${syncItem.action} \${syncItem.entityType}\`);
        resolve();
      }, 100);
    });
  }
  
  // Data export/import
  async exportData() {
    const tasks = await this.getTasks();
    const categories = await this.getCategories();
    
    return {
      version: 1,
      exportDate: new Date().toISOString(),
      data: {
        tasks: tasks.filter(task => !task.deleted),
        categories
      }
    };
  }
  
  async importData(importData) {
    const transaction = this.db.transaction(['tasks', 'categories'], 'readwrite');
    const tasksStore = transaction.objectStore('tasks');
    const categoriesStore = transaction.objectStore('categories');
    
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        console.log('Data imported successfully');
        resolve(true);
      };
      
      transaction.onerror = () => reject(transaction.error);
      
      // Import categories
      if (importData.data.categories) {
        importData.data.categories.forEach(category => {
          categoriesStore.add(category);
        });
      }
      
      // Import tasks
      if (importData.data.tasks) {
        importData.data.tasks.forEach(task => {
          task.syncStatus = 'offline'; // Mark as needing sync
          tasksStore.add(task);
        });
      }
    });
  }
  
  // Settings management
  async getSetting(key, defaultValue = null) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['settings'], 'readonly');
      const store = transaction.objectStore('settings');
      const request = store.get(key);
      
      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.value : defaultValue);
      };
      
      request.onerror = () => reject(request.error);
    });
  }
  
  async setSetting(key, value) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['settings'], 'readwrite');
      const store = transaction.objectStore('settings');
      const request = store.put({ key, value });
      
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }
}

// Usage example
async function taskManagerExample() {
  console.log('=== Offline Task Manager Demo ===');
  
  const taskManager = new OfflineTaskManager();
  
  try {
    await taskManager.initialize();
    
    // Create categories
    const workCategory = await taskManager.createCategory({
      name: 'Work',
      color: '#3498db',
      description: 'Work-related tasks'
    });
    
    const personalCategory = await taskManager.createCategory({
      name: 'Personal',
      color: '#e74c3c',
      description: 'Personal tasks'
    });
    
    console.log('Created categories:', [workCategory.name, personalCategory.name]);
    
    // Create tasks
    const tasks = [
      {
        title: 'Complete project proposal',
        description: 'Finish the Q4 project proposal document',
        status: 'in-progress',
        priority: 'high',
        category: workCategory.id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 1 week from now
      },
      {
        title: 'Buy groceries',
        description: 'Weekly grocery shopping',
        status: 'pending',
        priority: 'medium',
        category: personalCategory.id,
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days from now
      },
      {
        title: 'Review code changes',
        description: 'Review pull request #123',
        status: 'pending',
        priority: 'high',
        category: workCategory.id,
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString() // Tomorrow
      }
    ];
    
    for (const taskData of tasks) {
      const task = await taskManager.createTask(taskData);
      console.log(\`Created task: \${task.title}\`);
    }
    
    // Get and display tasks
    const allTasks = await taskManager.getTasks();
    console.log(\`\\nTotal tasks: \${allTasks.length}\`);
    
    // Filter tasks
    const highPriorityTasks = await taskManager.getTasks({ priority: 'high' });
    console.log(\`High priority tasks: \${highPriorityTasks.length}\`);
    
    const workTasks = await taskManager.getTasks({ category: workCategory.id });
    console.log(\`Work tasks: \${workTasks.length}\`);
    
    // Update a task
    const firstTask = allTasks[0];
    await taskManager.updateTask(firstTask.id, { 
      status: 'completed',
      completedAt: new Date().toISOString()
    });
    console.log(\`Completed task: \${firstTask.title}\`);
    
    // Get statistics
    const stats = await taskManager.getTaskStatistics();
    console.log('\\nTask Statistics:');
    console.log(\`Total: \${stats.total}\`);
    console.log(\`By Status: \${JSON.stringify(stats.byStatus)}\`);
    console.log(\`By Priority: \${JSON.stringify(stats.byPriority)}\`);
    console.log(\`Overdue: \${stats.overdue}\`);
    console.log(\`Completed this week: \${stats.completedThisWeek}\`);
    
    // Test search
    const searchResults = await taskManager.getTasks({ search: 'project' });
    console.log(\`\\nSearch results for 'project': \${searchResults.length} tasks\`);
    
    // Save settings
    await taskManager.setSetting('defaultView', 'list');
    await taskManager.setSetting('showCompleted', false);
    
    const defaultView = await taskManager.getSetting('defaultView');
    console.log(\`\\nDefault view setting: \${defaultView}\`);
    
    // Export data
    const exportData = await taskManager.exportData();
    console.log(\`\\nExported data: \${exportData.data.tasks.length} tasks, \${exportData.data.categories.length} categories\`);
    
    console.log('\\nTask manager demo completed successfully!');
    
  } catch (error) {
    console.error('Task manager operation failed:', error);
  }
}

// Run the task manager example
taskManagerExample();
      `
    }
  ],
  
  exercises: [
    {
      id: "indexeddb-basic",
      title: "Simple Note Taking App",
      difficulty: "easy",
      prompt: "Create a simple note-taking app using IndexedDB with the ability to add, edit, delete, and search notes.",
      solution: `
class SimpleNoteApp {
  constructor() {
    this.dbName = 'NotesDB';
    this.version = 1;
    this.db = null;
  }
  
  async initialize() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        const notesStore = db.createObjectStore('notes', {
          keyPath: 'id',
          autoIncrement: true
        });
        
        notesStore.createIndex('title', 'title');
        notesStore.createIndex('createdAt', 'createdAt');
        notesStore.createIndex('updatedAt', 'updatedAt');
      };
    });
  }
  
  async createNote(title, content) {
    const note = {
      title,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['notes'], 'readwrite');
      const store = transaction.objectStore('notes');
      const request = store.add(note);
      
      request.onsuccess = () => {
        note.id = request.result;
        resolve(note);
      };
      
      request.onerror = () => reject(request.error);
    });
  }
  
  async updateNote(id, title, content) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['notes'], 'readwrite');
      const store = transaction.objectStore('notes');
      const getRequest = store.get(id);
      
      getRequest.onsuccess = () => {
        const note = getRequest.result;
        if (!note) {
          reject(new Error('Note not found'));
          return;
        }
        
        note.title = title;
        note.content = content;
        note.updatedAt = new Date().toISOString();
        
        const putRequest = store.put(note);
        putRequest.onsuccess = () => resolve(note);
        putRequest.onerror = () => reject(putRequest.error);
      };
      
      getRequest.onerror = () => reject(getRequest.error);
    });
  }
  
  async deleteNote(id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['notes'], 'readwrite');
      const store = transaction.objectStore('notes');
      const request = store.delete(id);
      
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }
  
  async getAllNotes() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['notes'], 'readonly');
      const store = transaction.objectStore('notes');
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  async searchNotes(searchTerm) {
    const allNotes = await this.getAllNotes();
    const term = searchTerm.toLowerCase();
    
    return allNotes.filter(note => 
      note.title.toLowerCase().includes(term) || 
      note.content.toLowerCase().includes(term)
    );
  }
  
  async getNote(id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['notes'], 'readonly');
      const store = transaction.objectStore('notes');
      const request = store.get(id);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

// Usage
const noteApp = new SimpleNoteApp();

async function testNoteApp() {
  await noteApp.initialize();
  
  // Create notes
  const note1 = await noteApp.createNote('My First Note', 'This is the content of my first note.');
  const note2 = await noteApp.createNote('Shopping List', 'Milk, Bread, Eggs, Butter');
  
  console.log('Created notes:', [note1.title, note2.title]);
  
  // Get all notes
  const allNotes = await noteApp.getAllNotes();
  console.log('All notes:', allNotes.map(n => n.title));
  
  // Search notes
  const searchResults = await noteApp.searchNotes('first');
  console.log('Search results:', searchResults.map(n => n.title));
  
  // Update note
  await noteApp.updateNote(note1.id, 'Updated First Note', 'This content has been updated.');
  
  // Get updated note
  const updatedNote = await noteApp.getNote(note1.id);
  console.log('Updated note:', updatedNote.title);
}

testNoteApp();
      `
    },
    
    {
      id: "indexeddb-advanced",
      title: "Personal Finance Tracker",
      difficulty: "hard",
      prompt: "Build a personal finance tracker with categories, transactions, budgets, and reporting using IndexedDB.",
      solution: `
class FinanceTracker {
  constructor() {
    this.dbName = 'FinanceDB';
    this.version = 1;
    this.db = null;
  }
  
  async initialize() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Transactions store
        const transactionsStore = db.createObjectStore('transactions', {
          keyPath: 'id',
          autoIncrement: true
        });
        
        transactionsStore.createIndex('date', 'date');
        transactionsStore.createIndex('category', 'category');
        transactionsStore.createIndex('type', 'type');
        transactionsStore.createIndex('amount', 'amount');
        
        // Categories store
        const categoriesStore = db.createObjectStore('categories', {
          keyPath: 'id',
          autoIncrement: true
        });
        
        categoriesStore.createIndex('name', 'name', { unique: true });
        categoriesStore.createIndex('type', 'type');
        
        // Budgets store
        const budgetsStore = db.createObjectStore('budgets', {
          keyPath: 'id',
          autoIncrement: true
        });
        
        budgetsStore.createIndex('category', 'category');
        budgetsStore.createIndex('month', 'month');
      };
    });
  }
  
  // Category Management
  async createCategory(name, type, color = '#3498db') {
    const category = { name, type, color };
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['categories'], 'readwrite');
      const store = transaction.objectStore('categories');
      const request = store.add(category);
      
      request.onsuccess = () => {
        category.id = request.result;
        resolve(category);
      };
      
      request.onerror = () => reject(request.error);
    });
  }
  
  async getCategories(type = null) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['categories'], 'readonly');
      const store = transaction.objectStore('categories');
      
      let request;
      if (type) {
        const index = store.index('type');
        request = index.getAll(type);
      } else {
        request = store.getAll();
      }
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  // Transaction Management
  async addTransaction(amount, type, categoryId, description, date = new Date()) {
    const transaction = {
      amount: parseFloat(amount),
      type, // 'income' or 'expense'
      category: categoryId,
      description,
      date: date.toISOString().split('T')[0], // YYYY-MM-DD
      createdAt: new Date().toISOString()
    };
    
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(['transactions'], 'readwrite');
      const store = tx.objectStore('transactions');
      const request = store.add(transaction);
      
      request.onsuccess = () => {
        transaction.id = request.result;
        resolve(transaction);
      };
      
      request.onerror = () => reject(request.error);
    });
  }
  
  async getTransactions(filters = {}) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['transactions'], 'readonly');
      const store = transaction.objectStore('transactions');
      const transactions = [];
      
      let source = store;
      if (filters.category) {
        source = store.index('category');
      } else if (filters.type) {
        source = store.index('type');
      }
      
      const request = source.openCursor();
      
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          const tx = cursor.value;
          let include = true;
          
          // Apply filters
          if (filters.category && tx.category !== filters.category) include = false;
          if (filters.type && tx.type !== filters.type) include = false;
          if (filters.dateFrom && tx.date < filters.dateFrom) include = false;
          if (filters.dateTo && tx.date > filters.dateTo) include = false;
          if (filters.minAmount && tx.amount < filters.minAmount) include = false;
          if (filters.maxAmount && tx.amount > filters.maxAmount) include = false;
          
          if (include) {
            transactions.push(tx);
          }
          
          cursor.continue();
        } else {
          resolve(transactions);
        }
      };
      
      request.onerror = () => reject(request.error);
    });
  }
  
  // Budget Management
  async setBudget(categoryId, amount, month) {
    const budget = {
      category: categoryId,
      amount: parseFloat(amount),
      month, // YYYY-MM format
      createdAt: new Date().toISOString()
    };
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['budgets'], 'readwrite');
      const store = transaction.objectStore('budgets');
      const request = store.add(budget);
      
      request.onsuccess = () => {
        budget.id = request.result;
        resolve(budget);
      };
      
      request.onerror = () => reject(request.error);
    });
  }
  
  async getBudgets(month = null) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['budgets'], 'readonly');
      const store = transaction.objectStore('budgets');
      
      let request;
      if (month) {
        const index = store.index('month');
        request = index.getAll(month);
      } else {
        request = store.getAll();
      }
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  // Reporting
  async getMonthlyReport(year, month) {
    const monthStr = \`\${year}-\${month.toString().padStart(2, '0')}\`;
    const transactions = await this.getTransactions({
      dateFrom: \`\${monthStr}-01\`,
      dateTo: \`\${monthStr}-31\`
    });
    
    const report = {
      month: monthStr,
      totalIncome: 0,
      totalExpenses: 0,
      netIncome: 0,
      transactionCount: transactions.length,
      byCategory: {}
    };
    
    for (const tx of transactions) {
      if (tx.type === 'income') {
        report.totalIncome += tx.amount;
      } else {
        report.totalExpenses += tx.amount;
      }
      
      // Group by category
      if (!report.byCategory[tx.category]) {
        report.byCategory[tx.category] = {
          totalAmount: 0,
          transactionCount: 0,
          transactions: []
        };
      }
      
      report.byCategory[tx.category].totalAmount += tx.amount;
      report.byCategory[tx.category].transactionCount++;
      report.byCategory[tx.category].transactions.push(tx);
    }
    
    report.netIncome = report.totalIncome - report.totalExpenses;
    
    return report;
  }
  
  async getBudgetStatus(month) {
    const budgets = await this.getBudgets(month);
    const transactions = await this.getTransactions({
      type: 'expense',
      dateFrom: \`\${month}-01\`,
      dateTo: \`\${month}-31\`
    });
    
    const budgetStatus = [];
    
    for (const budget of budgets) {
      const categoryTransactions = transactions.filter(tx => tx.category === budget.category);
      const spent = categoryTransactions.reduce((sum, tx) => sum + tx.amount, 0);
      const remaining = budget.amount - spent;
      const percentUsed = (spent / budget.amount) * 100;
      
      budgetStatus.push({
        budget,
        spent: parseFloat(spent.toFixed(2)),
        remaining: parseFloat(remaining.toFixed(2)),
        percentUsed: parseFloat(percentUsed.toFixed(1)),
        isOverBudget: spent > budget.amount,
        transactionCount: categoryTransactions.length
      });
    }
    
    return budgetStatus;
  }
  
  async getSpendingTrends(months = 6) {
    const trends = [];
    const currentDate = new Date();
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      
      const report = await this.getMonthlyReport(year, month);
      trends.push({
        month: \`\${year}-\${month.toString().padStart(2, '0')}\`,
        totalIncome: report.totalIncome,
        totalExpenses: report.totalExpenses,
        netIncome: report.netIncome
      });
    }
    
    return trends;
  }
}

// Usage example
async function financeTrackerDemo() {
  const tracker = new FinanceTracker();
  await tracker.initialize();
  
  // Create categories
  const foodCategory = await tracker.createCategory('Food', 'expense', '#e74c3c');
  const salaryCategory = await tracker.createCategory('Salary', 'income', '#27ae60');
  const transportCategory = await tracker.createCategory('Transport', 'expense', '#f39c12');
  
  console.log('Created categories:', [foodCategory.name, salaryCategory.name, transportCategory.name]);
  
  // Add transactions
  await tracker.addTransaction(3000, 'income', salaryCategory.id, 'Monthly salary', new Date('2024-01-01'));
  await tracker.addTransaction(50, 'expense', foodCategory.id, 'Grocery shopping', new Date('2024-01-02'));
  await tracker.addTransaction(25, 'expense', transportCategory.id, 'Bus fare', new Date('2024-01-03'));
  await tracker.addTransaction(120, 'expense', foodCategory.id, 'Restaurant dinner', new Date('2024-01-05'));
  
  console.log('Added sample transactions');
  
  // Set budgets
  await tracker.setBudget(foodCategory.id, 400, '2024-01');
  await tracker.setBudget(transportCategory.id, 100, '2024-01');
  
  console.log('Set budgets for January 2024');
  
  // Generate reports
  const monthlyReport = await tracker.getMonthlyReport(2024, 1);
  console.log('January 2024 Report:');
  console.log(\`  Income: $\${monthlyReport.totalIncome}\`);
  console.log(\`  Expenses: $\${monthlyReport.totalExpenses}\`);
  console.log(\`  Net: $\${monthlyReport.netIncome}\`);
  
  // Check budget status
  const budgetStatus = await tracker.getBudgetStatus('2024-01');
  console.log('\\nBudget Status:');
  budgetStatus.forEach(status => {
    console.log(\`  Category \${status.budget.category}: $\${status.spent}/$\${status.budget.amount} (\${status.percentUsed}% used)\`);
  });
  
  // Get spending trends
  const trends = await tracker.getSpendingTrends(3);
  console.log('\\nSpending Trends:');
  trends.forEach(trend => {
    console.log(\`  \${trend.month}: Income $\${trend.totalIncome}, Expenses $\${trend.totalExpenses}\`);
  });
}

financeTrackerDemo();
      `
    }
  ],
  
  quiz: [
    {
      question: "What is the main advantage of IndexedDB over localStorage?",
      options: [
        "IndexedDB is synchronous",
        "IndexedDB can store much larger amounts of data and supports complex queries",
        "IndexedDB is available in all browsers",
        "IndexedDB is easier to use"
      ],
      correct: 1,
      explanation: "IndexedDB can store much larger amounts of data (hundreds of MB to GB) and supports complex operations like transactions, indexes, and queries, unlike the simple key-value storage of localStorage."
    },
    
    {
      question: "What is a transaction in IndexedDB?",
      options: [
        "A single database operation",
        "A way to group multiple database operations that either all succeed or all fail",
        "A method to delete data",
        "A type of index"
      ],
      correct: 1,
      explanation: "A transaction in IndexedDB groups multiple database operations together, ensuring that either all operations succeed or all fail (atomicity), maintaining database consistency."
    },
    
    {
      question: "What is the purpose of indexes in IndexedDB?",
      options: [
        "To make the database smaller",
        "To improve query performance and enable searching by non-key fields",
        "To encrypt the data",
        "To backup the data"
      ],
      correct: 1,
      explanation: "Indexes in IndexedDB improve query performance by creating alternative access paths to data, allowing you to efficiently search and sort by fields other than the primary key."
    },
    
    {
      question: "How do you handle the asynchronous nature of IndexedDB operations?",
      options: [
        "IndexedDB operations are synchronous",
        "Using callbacks and event handlers or Promises/async-await",
        "Using setTimeout",
        "IndexedDB operations are automatic"
      ],
      correct: 1,
      explanation: "IndexedDB operations are asynchronous and use event handlers (onsuccess, onerror) or can be wrapped in Promises to handle the asynchronous nature using async/await syntax."
    }
  ]
};

export default indexedDBContent;