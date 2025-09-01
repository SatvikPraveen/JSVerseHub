// File: src/concepts/functional/map-filter-reduce.js
// Functional Programming - Map, Filter, Reduce in JavaScript

export const mapFilterReduceContent = {
  title: "Map, Filter, and Reduce",
  description: "Master the fundamental array methods for functional data transformation",
  
  theory: {
    introduction: `
      Map, filter, and reduce are the holy trinity of functional programming in JavaScript.
      These higher-order functions allow you to transform, filter, and aggregate data in a 
      declarative way without mutating the original arrays. Understanding these methods is 
      essential for writing clean, readable, and maintainable JavaScript code.
    `,
    
    concepts: [
      {
        name: "Array.map() - Data Transformation",
        explanation: "Transform each element in an array and return a new array of the same length",
        example: `
// Basic map usage
const numbers = [1, 2, 3, 4, 5];

// Transform each number
const doubled = numbers.map(num => num * 2);
const squared = numbers.map(num => num * num);
const formatted = numbers.map(num => \`Number: \${num}\`);

console.log(doubled);   // [2, 4, 6, 8, 10]
console.log(squared);   // [1, 4, 9, 16, 25]
console.log(formatted); // ["Number: 1", "Number: 2", ...]

// Working with objects
const users = [
  { id: 1, name: "Alice", age: 25 },
  { id: 2, name: "Bob", age: 30 },
  { id: 3, name: "Charlie", age: 35 }
];

// Extract specific properties
const names = users.map(user => user.name);
const ages = users.map(user => user.age);
const initials = users.map(user => user.name.charAt(0));

console.log(names);    // ["Alice", "Bob", "Charlie"]
console.log(ages);     // [25, 30, 35]
console.log(initials); // ["A", "B", "C"]

// Transform objects
const usersWithStatus = users.map(user => ({
  ...user,
  status: user.age >= 30 ? 'senior' : 'junior',
  canVote: user.age >= 18
}));

console.log(usersWithStatus);
/*
[
  { id: 1, name: "Alice", age: 25, status: "junior", canVote: true },
  { id: 2, name: "Bob", age: 30, status: "senior", canVote: true },
  { id: 3, name: "Charlie", age: 35, status: "senior", canVote: true }
]
*/

// Map with index parameter
const numbersWithIndex = [10, 20, 30].map((value, index) => ({
  position: index + 1,
  value: value,
  multiplied: value * (index + 1)
}));

console.log(numbersWithIndex);
/*
[
  { position: 1, value: 10, multiplied: 10 },
  { position: 2, value: 20, multiplied: 40 },
  { position: 3, value: 30, multiplied: 90 }
]
*/

// Chaining with other array methods
const processedNumbers = numbers
  .map(num => num * 2)           // [2, 4, 6, 8, 10]
  .map(num => num + 1)           // [3, 5, 7, 9, 11]
  .map(num => \`[\${num}]\`);      // ["[3]", "[5]", "[7]", "[9]", "[11]"]

console.log(processedNumbers);

// Complex transformations
const products = [
  { name: "Laptop", price: 1000, category: "Electronics" },
  { name: "Book", price: 20, category: "Education" },
  { name: "Phone", price: 800, category: "Electronics" }
];

const enrichedProducts = products.map(product => ({
  ...product,
  priceCategory: product.price > 500 ? 'expensive' : 'affordable',
  slug: product.name.toLowerCase().replace(/\\s+/g, '-'),
  tax: product.price * 0.1,
  totalPrice: product.price * 1.1
}));

console.log(enrichedProducts);
        `
      },
      
      {
        name: "Array.filter() - Data Filtering",
        explanation: "Create a new array with elements that pass a test condition",
        example: `
// Basic filter usage
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Filter based on conditions
const evenNumbers = numbers.filter(num => num % 2 === 0);
const greaterThanFive = numbers.filter(num => num > 5);
const inRange = numbers.filter(num => num >= 3 && num <= 7);

console.log(evenNumbers);      // [2, 4, 6, 8, 10]
console.log(greaterThanFive);  // [6, 7, 8, 9, 10]
console.log(inRange);          // [3, 4, 5, 6, 7]

// Filter objects
const users = [
  { name: "Alice", age: 25, active: true, role: "admin" },
  { name: "Bob", age: 30, active: false, role: "user" },
  { name: "Charlie", age: 35, active: true, role: "user" },
  { name: "Diana", age: 28, active: true, role: "admin" }
];

// Filter by single property
const activeUsers = users.filter(user => user.active);
const admins = users.filter(user => user.role === 'admin');
const youngUsers = users.filter(user => user.age < 30);

console.log(activeUsers);  // Alice, Charlie, Diana
console.log(admins);       // Alice, Diana
console.log(youngUsers);   // Alice, Diana

// Filter by multiple conditions
const activeAdmins = users.filter(user => user.active && user.role === 'admin');
const seniorActiveUsers = users.filter(user => user.active && user.age >= 30);

console.log(activeAdmins);     // Alice, Diana
console.log(seniorActiveUsers); // Charlie

// Complex filtering
const products = [
  { name: "Laptop", price: 1000, inStock: true, rating: 4.5 },
  { name: "Phone", price: 800, inStock: false, rating: 4.2 },
  { name: "Tablet", price: 500, inStock: true, rating: 3.8 },
  { name: "Watch", price: 300, inStock: true, rating: 4.0 }
];

// Premium available products
const premiumAvailable = products.filter(product => 
  product.inStock && 
  product.price > 400 && 
  product.rating >= 4.0
);

console.log(premiumAvailable); // Laptop, Tablet, Watch

// Filter with index
const firstFewEven = numbers.filter((num, index) => num % 2 === 0 && index < 5);
console.log(firstFewEven); // [2, 4]

// Remove null/undefined values
const mixedArray = [1, null, 2, undefined, 3, "", 4, false, 5, 0];
const truthyValues = mixedArray.filter(Boolean);
const definedValues = mixedArray.filter(item => item != null);
const nonEmptyValues = mixedArray.filter(item => item !== "" && item != null);

console.log(truthyValues);    // [1, 2, 3, 4, 5]
console.log(definedValues);   // [1, 2, 3, "", 4, false, 5, 0]
console.log(nonEmptyValues);  // [1, 2, 3, 4, false, 5, 0]

// Filter by string patterns
const words = ["apple", "banana", "cherry", "date", "elderberry"];
const aWords = words.filter(word => word.startsWith('a'));
const longWords = words.filter(word => word.length > 5);
const containsE = words.filter(word => word.includes('e'));

console.log(aWords);     // ["apple"]
console.log(longWords);  // ["banana", "cherry", "elderberry"]
console.log(containsE);  // ["apple", "cherry", "date", "elderberry"]

// Unique values (using filter with indexOf)
const duplicateNumbers = [1, 2, 2, 3, 3, 3, 4, 5, 5];
const uniqueNumbers = duplicateNumbers.filter((num, index) => 
  duplicateNumbers.indexOf(num) === index
);
console.log(uniqueNumbers); // [1, 2, 3, 4, 5]
        `
      },
      
      {
        name: "Array.reduce() - Data Aggregation",
        explanation: "Reduce an array to a single value through accumulation",
        example: `
// Basic reduce usage
const numbers = [1, 2, 3, 4, 5];

// Sum all numbers
const sum = numbers.reduce((accumulator, current) => accumulator + current, 0);
console.log(sum); // 15

// Find maximum
const max = numbers.reduce((max, current) => Math.max(max, current), -Infinity);
console.log(max); // 5

// Multiply all numbers
const product = numbers.reduce((product, current) => product * current, 1);
console.log(product); // 120

// Count occurrences
const fruits = ['apple', 'banana', 'apple', 'orange', 'banana', 'apple'];
const fruitCount = fruits.reduce((count, fruit) => {
  count[fruit] = (count[fruit] || 0) + 1;
  return count;
}, {});
console.log(fruitCount); // { apple: 3, banana: 2, orange: 1 }

// Working with objects
const users = [
  { name: "Alice", age: 25, salary: 50000 },
  { name: "Bob", age: 30, salary: 60000 },
  { name: "Charlie", age: 35, salary: 70000 }
];

// Calculate total salary
const totalSalary = users.reduce((total, user) => total + user.salary, 0);
console.log(totalSalary); // 180000

// Find oldest user
const oldestUser = users.reduce((oldest, current) => 
  current.age > oldest.age ? current : oldest
);
console.log(oldestUser); // Charlie

// Group by property
const groupedByAgeRange = users.reduce((groups, user) => {
  const ageRange = user.age < 30 ? 'young' : 'experienced';
  if (!groups[ageRange]) groups[ageRange] = [];
  groups[ageRange].push(user);
  return groups;
}, {});
console.log(groupedByAgeRange);

// Build complex objects
const userStats = users.reduce((stats, user) => ({
  totalUsers: stats.totalUsers + 1,
  totalAge: stats.totalAge + user.age,
  totalSalary: stats.totalSalary + user.salary,
  averageAge: (stats.totalAge + user.age) / (stats.totalUsers + 1),
  averageSalary: (stats.totalSalary + user.salary) / (stats.totalUsers + 1)
}), {
  totalUsers: 0,
  totalAge: 0,
  totalSalary: 0,
  averageAge: 0,
  averageSalary: 0
});
console.log(userStats);

// Flatten arrays
const nestedArrays = [[1, 2], [3, 4], [5, 6]];
const flattened = nestedArrays.reduce((flat, current) => flat.concat(current), []);
console.log(flattened); // [1, 2, 3, 4, 5, 6]

// Advanced flattening with depth
const deeplyNested = [[1, [2, 3]], [4, [5, [6, 7]]]];
const flattenDeep = (arr) => arr.reduce((flat, item) => 
  Array.isArray(item) ? flat.concat(flattenDeep(item)) : flat.concat(item), []
);
console.log(flattenDeep(deeplyNested)); // [1, 2, 3, 4, 5, 6, 7]

// Create lookup objects
const products = [
  { id: 1, name: "Laptop", price: 1000 },
  { id: 2, name: "Phone", price: 800 },
  { id: 3, name: "Tablet", price: 500 }
];

const productLookup = products.reduce((lookup, product) => {
  lookup[product.id] = product;
  return lookup;
}, {});
console.log(productLookup[2]); // { id: 2, name: "Phone", price: 800 }

// Pipeline operations using reduce
const pipeline = [
  (data) => data.filter(x => x > 0),
  (data) => data.map(x => x * 2),
  (data) => data.reduce((sum, x) => sum + x, 0)
];

const result = pipeline.reduce((data, operation) => operation(data), [-1, 2, 3, -4, 5]);
console.log(result); // 20 (positive numbers: 2,3,5 -> doubled: 4,6,10 -> sum: 20)
        `
      },
      
      {
        name: "Combining Map, Filter, and Reduce",
        explanation: "Chain these methods together for powerful data processing",
        example: `
// Complex data processing pipeline
const salesData = [
  { product: "Laptop", price: 1000, quantity: 2, category: "Electronics", date: "2024-01-15" },
  { product: "Book", price: 20, quantity: 5, category: "Education", date: "2024-01-16" },
  { product: "Phone", price: 800, quantity: 1, category: "Electronics", date: "2024-01-17" },
  { product: "Desk", price: 300, quantity: 1, category: "Furniture", date: "2024-01-18" },
  { product: "Pen", price: 2, quantity: 10, category: "Office", date: "2024-01-19" }
];

// Calculate total revenue for Electronics over $500
const electronicsRevenue = salesData
  .filter(sale => sale.category === "Electronics")     // Filter electronics
  .filter(sale => sale.price >= 500)                   // Filter expensive items
  .map(sale => sale.price * sale.quantity)             // Calculate revenue per sale
  .reduce((total, revenue) => total + revenue, 0);     // Sum all revenues

console.log("Electronics revenue:", electronicsRevenue); // 4000

// Get top 3 sales by revenue with additional info
const topSales = salesData
  .map(sale => ({                                       // Add calculated fields
    ...sale,
    revenue: sale.price * sale.quantity,
    profitMargin: sale.price > 100 ? 0.3 : 0.5
  }))
  .filter(sale => sale.revenue > 50)                    // Filter significant sales
  .sort((a, b) => b.revenue - a.revenue)               // Sort by revenue (desc)
  .slice(0, 3)                                         // Take top 3
  .map(sale => ({                                      // Format for display
    product: sale.product,
    revenue: sale.revenue,
    profit: sale.revenue * sale.profitMargin
  }));

console.log("Top 3 sales:", topSales);

// Category-wise analysis
const categoryAnalysis = salesData
  .reduce((analysis, sale) => {
    const category = sale.category;
    if (!analysis[category]) {
      analysis[category] = {
        totalSales: 0,
        totalRevenue: 0,
        totalQuantity: 0,
        products: []
      };
    }
    
    analysis[category].totalSales += 1;
    analysis[category].totalRevenue += sale.price * sale.quantity;
    analysis[category].totalQuantity += sale.quantity;
    analysis[category].products.push(sale.product);
    
    return analysis;
  }, {});

// Add averages to each category
const enrichedAnalysis = Object.keys(categoryAnalysis).reduce((result, category) => {
  const data = categoryAnalysis[category];
  result[category] = {
    ...data,
    averageRevenue: data.totalRevenue / data.totalSales,
    averageQuantity: data.totalQuantity / data.totalSales
  };
  return result;
}, {});

console.log("Category analysis:", enrichedAnalysis);

// Advanced: Process nested data
const ordersData = [
  {
    orderId: 1,
    customer: "Alice",
    items: [
      { name: "Laptop", price: 1000, quantity: 1 },
      { name: "Mouse", price: 25, quantity: 2 }
    ]
  },
  {
    orderId: 2,
    customer: "Bob",
    items: [
      { name: "Book", price: 20, quantity: 3 },
      { name: "Pen", price: 2, quantity: 5 }
    ]
  }
];

// Calculate order totals and customer spending
const customerSpending = ordersData
  .map(order => ({                                      // Calculate order total
    ...order,
    orderTotal: order.items
      .map(item => item.price * item.quantity)
      .reduce((sum, itemTotal) => sum + itemTotal, 0)
  }))
  .reduce((spending, order) => {                        // Accumulate by customer
    spending[order.customer] = (spending[order.customer] || 0) + order.orderTotal;
    return spending;
  }, {});

console.log("Customer spending:", customerSpending); // { Alice: 1050, Bob: 70 }

// Find most popular products across all orders
const productPopularity = ordersData
  .flatMap(order => order.items)                       // Flatten all items
  .reduce((popularity, item) => {                      // Count occurrences
    popularity[item.name] = (popularity[item.name] || 0) + item.quantity;
    return popularity;
  }, {});

const sortedProducts = Object.entries(productPopularity)
  .sort(([, a], [, b]) => b - a)                       // Sort by quantity
  .map(([product, quantity]) => ({ product, quantity })); // Format

console.log("Product popularity:", sortedProducts);

// Performance metrics calculation
const performanceMetrics = salesData
  .map(sale => ({
    month: sale.date.substring(0, 7), // Extract YYYY-MM
    revenue: sale.price * sale.quantity
  }))
  .reduce((metrics, sale) => {
    if (!metrics[sale.month]) {
      metrics[sale.month] = { revenue: 0, transactions: 0 };
    }
    metrics[sale.month].revenue += sale.revenue;
    metrics[sale.month].transactions += 1;
    return metrics;
  }, {});

// Calculate growth rates
const monthlyData = Object.entries(performanceMetrics)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([month, data], index, array) => {
    const growthRate = index > 0 
      ? ((data.revenue - array[index - 1][1].revenue) / array[index - 1][1].revenue) * 100
      : 0;
    
    return {
      month,
      ...data,
      growthRate: parseFloat(growthRate.toFixed(2))
    };
  });

console.log("Monthly performance:", monthlyData);
        `
      }
    ]
  },
  
  practicalExamples: [
    {
      title: "E-commerce Order Processing System",
      description: "Complete order processing pipeline using map, filter, and reduce",
      code: `
// Sample e-commerce data
const orders = [
  {
    id: 'ORD-001',
    customerId: 'CUST-123',
    customerName: 'John Doe',
    email: 'john@example.com',
    status: 'completed',
    items: [
      { productId: 'PROD-001', name: 'Wireless Headphones', price: 99.99, quantity: 1, category: 'Electronics' },
      { productId: 'PROD-002', name: 'Phone Case', price: 19.99, quantity: 2, category: 'Accessories' }
    ],
    shippingCost: 9.99,
    tax: 14.39,
    orderDate: '2024-01-15',
    shippedDate: '2024-01-16'
  },
  {
    id: 'ORD-002',
    customerId: 'CUST-456',
    customerName: 'Jane Smith',
    email: 'jane@example.com',
    status: 'pending',
    items: [
      { productId: 'PROD-003', name: 'Laptop Stand', price: 49.99, quantity: 1, category: 'Office' },
      { productId: 'PROD-004', name: 'USB Cable', price: 12.99, quantity: 3, category: 'Electronics' }
    ],
    shippingCost: 7.99,
    tax: 6.89,
    orderDate: '2024-01-16',
    shippedDate: null
  },
  {
    id: 'ORD-003',
    customerId: 'CUST-123',
    customerName: 'John Doe',
    email: 'john@example.com',
    status: 'completed',
    items: [
      { productId: 'PROD-005', name: 'Bluetooth Speaker', price: 79.99, quantity: 1, category: 'Electronics' }
    ],
    shippingCost: 0, // Free shipping
    tax: 8.00,
    orderDate: '2024-01-18',
    shippedDate: '2024-01-19'
  }
];

// 1. Order Processing Functions
function calculateOrderSubtotal(order) {
  return order.items
    .map(item => item.price * item.quantity)
    .reduce((subtotal, itemTotal) => subtotal + itemTotal, 0);
}

function calculateOrderTotal(order) {
  const subtotal = calculateOrderSubtotal(order);
  return subtotal + order.shippingCost + order.tax;
}

function enrichOrderWithTotals(order) {
  const subtotal = calculateOrderSubtotal(order);
  const total = calculateOrderTotal(order);
  
  return {
    ...order,
    subtotal: parseFloat(subtotal.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
    itemCount: order.items.reduce((count, item) => count + item.quantity, 0)
  };
}

// 2. Customer Analytics
function getCustomerOrderSummary(orders) {
  return orders
    .map(enrichOrderWithTotals)
    .reduce((summary, order) => {
      const customerId = order.customerId;
      
      if (!summary[customerId]) {
        summary[customerId] = {
          customerId,
          customerName: order.customerName,
          email: order.email,
          totalOrders: 0,
          totalSpent: 0,
          completedOrders: 0,
          pendingOrders: 0,
          averageOrderValue: 0,
          favoriteCategories: {}
        };
      }
      
      const customer = summary[customerId];
      customer.totalOrders++;
      customer.totalSpent += order.total;
      
      if (order.status === 'completed') {
        customer.completedOrders++;
      } else if (order.status === 'pending') {
        customer.pendingOrders++;
      }
      
      // Track favorite categories
      order.items.forEach(item => {
        customer.favoriteCategories[item.category] = 
          (customer.favoriteCategories[item.category] || 0) + item.quantity;
      });
      
      customer.averageOrderValue = parseFloat((customer.totalSpent / customer.totalOrders).toFixed(2));
      
      return summary;
    }, {});
}

// 3. Product Performance Analysis
function getProductPerformance(orders) {
  const allItems = orders
    .filter(order => order.status === 'completed')
    .flatMap(order => order.items);
  
  return allItems
    .reduce((performance, item) => {
      if (!performance[item.productId]) {
        performance[item.productId] = {
          productId: item.productId,
          name: item.name,
          category: item.category,
          price: item.price,
          totalSold: 0,
          totalRevenue: 0,
          orderCount: 0
        };
      }
      
      const product = performance[item.productId];
      product.totalSold += item.quantity;
      product.totalRevenue += item.price * item.quantity;
      product.orderCount++;
      
      return performance;
    }, {});
}

// 4. Revenue Analytics by Time Period
function getRevenueByMonth(orders) {
  return orders
    .filter(order => order.status === 'completed')
    .map(enrichOrderWithTotals)
    .reduce((monthlyRevenue, order) => {
      const month = order.orderDate.substring(0, 7); // YYYY-MM
      
      if (!monthlyRevenue[month]) {
        monthlyRevenue[month] = {
          month,
          totalRevenue: 0,
          orderCount: 0,
          customerCount: new Set(),
          averageOrderValue: 0
        };
      }
      
      const monthData = monthlyRevenue[month];
      monthData.totalRevenue += order.total;
      monthData.orderCount++;
      monthData.customerCount.add(order.customerId);
      monthData.averageOrderValue = parseFloat((monthData.totalRevenue / monthData.orderCount).toFixed(2));
      
      return monthlyRevenue;
    }, {});
}

// 5. Shipping and Logistics Analysis
function getShippingAnalysis(orders) {
  const completedOrders = orders.filter(order => order.status === 'completed');
  
  const shippingStats = completedOrders
    .map(order => {
      const orderDate = new Date(order.orderDate);
      const shippedDate = new Date(order.shippedDate);
      const processingTime = Math.ceil((shippedDate - orderDate) / (1000 * 60 * 60 * 24));
      
      return {
        ...order,
        processingTime
      };
    })
    .reduce((stats, order) => {
      stats.totalShippingCost += order.shippingCost;
      stats.totalOrders++;
      stats.processingTimes.push(order.processingTime);
      
      if (order.shippingCost === 0) {
        stats.freeShippingOrders++;
      }
      
      return stats;
    }, {
      totalShippingCost: 0,
      totalOrders: 0,
      freeShippingOrders: 0,
      processingTimes: []
    });
  
  // Calculate averages
  shippingStats.averageShippingCost = parseFloat(
    (shippingStats.totalShippingCost / shippingStats.totalOrders).toFixed(2)
  );
  
  shippingStats.averageProcessingTime = parseFloat(
    (shippingStats.processingTimes.reduce((sum, time) => sum + time, 0) / shippingStats.processingTimes.length).toFixed(1)
  );
  
  shippingStats.freeShippingRate = parseFloat(
    ((shippingStats.freeShippingOrders / shippingStats.totalOrders) * 100).toFixed(1)
  );
  
  return shippingStats;
}

// 6. Execute Analytics
console.log("=== Order Processing Results ===");

// Enrich orders with calculated totals
const enrichedOrders = orders.map(enrichOrderWithTotals);
console.log("Enriched Orders:", enrichedOrders);

// Customer summary
const customerSummary = getCustomerOrderSummary(orders);
console.log("Customer Summary:", customerSummary);

// Product performance
const productPerformance = getProductPerformance(orders);
const topProducts = Object.values(productPerformance)
  .sort((a, b) => b.totalRevenue - a.totalRevenue)
  .slice(0, 3);
console.log("Top 3 Products by Revenue:", topProducts);

// Monthly revenue
const monthlyRevenue = getRevenueByMonth(orders);
console.log("Monthly Revenue:", monthlyRevenue);

// Shipping analysis
const shippingAnalysis = getShippingAnalysis(orders);
console.log("Shipping Analysis:", shippingAnalysis);

// Overall business metrics
const overallMetrics = enrichedOrders
  .filter(order => order.status === 'completed')
  .reduce((metrics, order) => ({
    totalRevenue: metrics.totalRevenue + order.total,
    totalOrders: metrics.totalOrders + 1,
    totalItems: metrics.totalItems + order.itemCount,
    averageOrderValue: 0 // Will calculate after
  }), { totalRevenue: 0, totalOrders: 0, totalItems: 0 });

overallMetrics.averageOrderValue = parseFloat(
  (overallMetrics.totalRevenue / overallMetrics.totalOrders).toFixed(2)
);

console.log("Overall Business Metrics:", overallMetrics);
      `
    },
    
    {
      title: "Student Grade Analysis System",
      description: "Comprehensive student performance analysis using functional programming",
      code: `
// Student data with multiple subjects and assignments
const studentData = [
  {
    id: 'STU-001',
    name: 'Alice Johnson',
    grade: 10,
    subjects: [
      {
        name: 'Mathematics',
        assignments: [
          { name: 'Algebra Test', score: 85, maxScore: 100, weight: 0.3 },
          { name: 'Geometry Quiz', score: 92, maxScore: 100, weight: 0.2 },
          { name: 'Final Exam', score: 88, maxScore: 100, weight: 0.5 }
        ]
      },
      {
        name: 'Science',
        assignments: [
          { name: 'Lab Report 1', score: 78, maxScore: 100, weight: 0.25 },
          { name: 'Midterm', score: 84, maxScore: 100, weight: 0.35 },
          { name: 'Final Project', score: 91, maxScore: 100, weight: 0.4 }
        ]
      },
      {
        name: 'English',
        assignments: [
          { name: 'Essay 1', score: 76, maxScore: 100, weight: 0.3 },
          { name: 'Essay 2', score: 82, maxScore: 100, weight: 0.3 },
          { name: 'Final Exam', score: 79, maxScore: 100, weight: 0.4 }
        ]
      }
    ]
  },
  {
    id: 'STU-002',
    name: 'Bob Smith',
    grade: 10,
    subjects: [
      {
        name: 'Mathematics',
        assignments: [
          { name: 'Algebra Test', score: 92, maxScore: 100, weight: 0.3 },
          { name: 'Geometry Quiz', score: 88, maxScore: 100, weight: 0.2 },
          { name: 'Final Exam', score: 95, maxScore: 100, weight: 0.5 }
        ]
      },
      {
        name: 'Science',
        assignments: [
          { name: 'Lab Report 1', score: 89, maxScore: 100, weight: 0.25 },
          { name: 'Midterm', score: 87, maxScore: 100, weight: 0.35 },
          { name: 'Final Project', score: 93, maxScore: 100, weight: 0.4 }
        ]
      },
      {
        name: 'English',
        assignments: [
          { name: 'Essay 1', score: 84, maxScore: 100, weight: 0.3 },
          { name: 'Essay 2', score: 88, maxScore: 100, weight: 0.3 },
          { name: 'Final Exam', score: 86, maxScore: 100, weight: 0.4 }
        ]
      }
    ]
  },
  {
    id: 'STU-003',
    name: 'Charlie Brown',
    grade: 11,
    subjects: [
      {
        name: 'Mathematics',
        assignments: [
          { name: 'Calculus Test', score: 73, maxScore: 100, weight: 0.4 },
          { name: 'Statistics Quiz', score: 81, maxScore: 100, weight: 0.3 },
          { name: 'Final Exam', score: 77, maxScore: 100, weight: 0.3 }
        ]
      },
      {
        name: 'Physics',
        assignments: [
          { name: 'Lab Report 1', score: 82, maxScore: 100, weight: 0.2 },
          { name: 'Mechanics Test', score: 75, maxScore: 100, weight: 0.4 },
          { name: 'Final Exam', score: 80, maxScore: 100, weight: 0.4 }
        ]
      },
      {
        name: 'Chemistry',
        assignments: [
          { name: 'Lab Practical', score: 88, maxScore: 100, weight: 0.3 },
          { name: 'Organic Test', score: 74, maxScore: 100, weight: 0.3 },
          { name: 'Final Exam', score: 79, maxScore: 100, weight: 0.4 }
        ]
      }
    ]
  }
];

// 1. Calculate weighted averages for subjects
function calculateSubjectGrade(subject) {
  const weightedScore = subject.assignments
    .map(assignment => (assignment.score / assignment.maxScore) * assignment.weight)
    .reduce((total, weighted) => total + weighted, 0);
  
  return Math.round(weightedScore * 100);
}

// 2. Calculate student's overall GPA
function calculateStudentGPA(student) {
  const subjectGrades = student.subjects.map(calculateSubjectGrade);
  const averageGrade = subjectGrades.reduce((sum, grade) => sum + grade, 0) / subjectGrades.length;
  
  return {
    ...student,
    subjectGrades: student.subjects.map((subject, index) => ({
      subject: subject.name,
      grade: subjectGrades[index],
      letterGrade: getLetterGrade(subjectGrades[index])
    })),
    overallGrade: Math.round(averageGrade),
    gpa: convertToGPA(averageGrade),
    letterGrade: getLetterGrade(averageGrade)
  };
}

// Helper functions
function getLetterGrade(score) {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

function convertToGPA(score) {
  if (score >= 90) return 4.0;
  if (score >= 80) return 3.0;
  if (score >= 70) return 2.0;
  if (score >= 60) return 1.0;
  return 0.0;
}

// 3. Class performance analysis
function analyzeClassPerformance(students) {
  const studentsWithGrades = students.map(calculateStudentGPA);
  
  // Overall class statistics
  const overallGrades = studentsWithGrades.map(student => student.overallGrade);
  const classStats = {
    totalStudents: studentsWithGrades.length,
    averageGrade: Math.round(overallGrades.reduce((sum, grade) => sum + grade, 0) / overallGrades.length),
    highestGrade: Math.max(...overallGrades),
    lowestGrade: Math.min(...overallGrades),
    passingStudents: studentsWithGrades.filter(student => student.overallGrade >= 60).length
  };
  
  classStats.passingRate = Math.round((classStats.passingStudents / classStats.totalStudents) * 100);
  
  // Grade distribution
  const gradeDistribution = studentsWithGrades
    .reduce((distribution, student) => {
      const letterGrade = student.letterGrade;
      distribution[letterGrade] = (distribution[letterGrade] || 0) + 1;
      return distribution;
    }, {});
  
  // Subject-wise performance
  const subjectPerformance = studentsWithGrades
    .flatMap(student => student.subjectGrades)
    .reduce((performance, subjectGrade) => {
      if (!performance[subjectGrade.subject]) {
        performance[subjectGrade.subject] = {
          subject: subjectGrade.subject,
          grades: [],
          average: 0,
          studentCount: 0
        };
      }
      
      performance[subjectGrade.subject].grades.push(subjectGrade.grade);
      performance[subjectGrade.subject].studentCount++;
      
      return performance;
    }, {});
  
  // Calculate subject averages
  Object.values(subjectPerformance).forEach(subject => {
    subject.average = Math.round(
      subject.grades.reduce((sum, grade) => sum + grade, 0) / subject.grades.length
    );
    subject.highest = Math.max(...subject.grades);
    subject.lowest = Math.min(...subject.grades);
  });
  
  return {
    classStats,
    gradeDistribution,
    subjectPerformance: Object.values(subjectPerformance),
    studentsWithGrades
  };
}

// 4. Identify at-risk students
function identifyAtRiskStudents(students) {
  return students
    .map(calculateStudentGPA)
    .filter(student => student.overallGrade < 70 || student.subjectGrades.some(sg => sg.grade < 60))
    .map(student => ({
      ...student,
      riskFactors: [
        ...(student.overallGrade < 70 ? ['Low overall grade'] : []),
        ...student.subjectGrades
          .filter(sg => sg.grade < 60)
          .map(sg => \`Failing \${sg.subject}\`),
        ...student.subjectGrades
          .filter(sg => sg.grade >= 60 && sg.grade < 70)
          .map(sg => \`At risk in \${sg.subject}\`)
      ]
    }));
}

// 5. Generate improvement recommendations
function generateRecommendations(students) {
  return students
    .map(calculateStudentGPA)
    .map(student => {
      const weakestSubject = student.subjectGrades
        .sort((a, b) => a.grade - b.grade)[0];
      
      const recommendations = [];
      
      if (student.overallGrade < 80) {
        recommendations.push("Focus on consistent study habits");
      }
      
      if (weakestSubject.grade < 70) {
        recommendations.push(\`Seek additional help in \${weakestSubject.subject}\`);
      }
      
      const failingSubjects = student.subjectGrades
        .filter(sg => sg.grade < 60)
        .map(sg => sg.subject);
      
      if (failingSubjects.length > 0) {
        recommendations.push(\`Consider tutoring for: \${failingSubjects.join(', ')}\`);
      }
      
      if (student.gpa >= 3.5) {
        recommendations.push("Consider advanced or honors courses");
      }
      
      return {
        studentId: student.id,
        name: student.name,
        currentGPA: student.gpa,
        recommendations
      };
    });
}

// 6. Execute comprehensive analysis
console.log("=== Student Grade Analysis Results ===");

// Individual student performance
const studentsWithGrades = studentData.map(calculateStudentGPA);
console.log("\\nIndividual Student Performance:");
studentsWithGrades.forEach(student => {
  console.log(\`\${student.name}: Overall Grade: \${student.overallGrade} (\${student.letterGrade}), GPA: \${student.gpa}\`);
  student.subjectGrades.forEach(sg => {
    console.log(\`  \${sg.subject}: \${sg.grade} (\${sg.letterGrade})\`);
  });
});

// Class performance analysis
const classAnalysis = analyzeClassPerformance(studentData);
console.log("\\nClass Performance Analysis:");
console.log("Class Statistics:", classAnalysis.classStats);
console.log("Grade Distribution:", classAnalysis.gradeDistribution);
console.log("Subject Performance:", classAnalysis.subjectPerformance);

// At-risk students
const atRiskStudents = identifyAtRiskStudents(studentData);
console.log("\\nAt-Risk Students:");
atRiskStudents.forEach(student => {
  console.log(\`\${student.name}: \${student.riskFactors.join(', ')}\`);
});

// Recommendations
const recommendations = generateRecommendations(studentData);
console.log("\\nRecommendations:");
recommendations.forEach(rec => {
  console.log(\`\${rec.name} (GPA: \${rec.currentGPA}):\`);
  rec.recommendations.forEach(recommendation => {
    console.log(\`  - \${recommendation}\`);
  });
});

// Top performers
const topPerformers = studentsWithGrades
  .filter(student => student.gpa >= 3.0)
  .sort((a, b) => b.gpa - a.gpa)
  .slice(0, 3);

console.log("\\nTop Performers:");
topPerformers.forEach((student, index) => {
  console.log(\`\${index + 1}. \${student.name}: GPA \${student.gpa} (\${student.overallGrade}%)\`);
});
      `
    }
  ],
  
  exercises: [
    {
      id: "map-filter-reduce-basic",
      title: "Basic Array Operations",
      difficulty: "easy",
      prompt: "Given an array of numbers, use map/filter/reduce to: 1) Square all numbers, 2) Keep only even results, 3) Sum them up.",
      solution: `
function processNumbers(numbers) {
  const result = numbers
    .map(num => num * num)                    // Square all numbers
    .filter(squared => squared % 2 === 0)     // Keep only even squares
    .reduce((sum, even) => sum + even, 0);    // Sum them up
  
  return result;
}

// Test
const numbers = [1, 2, 3, 4, 5, 6];
console.log(processNumbers(numbers)); // 56 (4 + 16 + 36)

// Step by step breakdown
const squares = numbers.map(num => num * num);        // [1, 4, 9, 16, 25, 36]
const evenSquares = squares.filter(sq => sq % 2 === 0); // [4, 16, 36]
const sum = evenSquares.reduce((acc, val) => acc + val, 0); // 56

console.log("Squares:", squares);
console.log("Even squares:", evenSquares);
console.log("Sum:", sum);
      `
    },
    
    {
      id: "map-filter-reduce-intermediate",
      title: "Employee Data Processing",
      difficulty: "medium", 
      prompt: "Process employee data to find average salary by department for employees over 25, formatted for display.",
      solution: `
function analyzeEmployeeSalaries(employees) {
  // Filter employees over 25 and group by department with salary calculation
  const departmentAnalysis = employees
    .filter(employee => employee.age > 25)
    .reduce((departments, employee) => {
      const dept = employee.department;
      
      if (!departments[dept]) {
        departments[dept] = {
          department: dept,
          employees: [],
          totalSalary: 0,
          count: 0
        };
      }
      
      departments[dept].employees.push(employee.name);
      departments[dept].totalSalary += employee.salary;
      departments[dept].count++;
      
      return departments;
    }, {});
  
  // Calculate averages and format for display
  return Object.values(departmentAnalysis)
    .map(dept => ({
      department: dept.department,
      employeeCount: dept.count,
      averageSalary: Math.round(dept.totalSalary / dept.count),
      employees: dept.employees,
      formattedSalary: `${(dept.totalSalary / dept.count).toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      })}`
    }))
    .sort((a, b) => b.averageSalary - a.averageSalary);
}

// Test data
const employees = [
  { name: "Alice", age: 28, department: "Engineering", salary: 75000 },
  { name: "Bob", age: 24, department: "Marketing", salary: 45000 },
  { name: "Charlie", age: 32, department: "Engineering", salary: 85000 },
  { name: "Diana", age: 26, department: "Design", salary: 55000 },
  { name: "Eve", age: 29, department: "Marketing", salary: 52000 }
];

const analysis = analyzeEmployeeSalaries(employees);
console.log("Department Analysis (Age > 25):");
analysis.forEach(dept => {
  console.log(`${dept.department}: ${dept.formattedSalary} avg (${dept.employeeCount} employees)`);
  console.log(`  Employees: ${dept.employees.join(', ')}`);
});
      `
    }
  ],
  
  quiz: [
    {
      question: "What does the map() method return?",
      options: [
        "The original array modified",
        "A new array with the same length as the original",
        "A single value",
        "An object with key-value pairs"
      ],
      correct: 1,
      explanation: "The map() method returns a new array with the same length as the original, where each element is transformed by the provided function."
    },
    
    {
      question: "Which method would you use to get a subset of an array based on a condition?",
      options: [
        "map()",
        "reduce()",
        "filter()",
        "forEach()"
      ],
      correct: 2,
      explanation: "The filter() method creates a new array with only the elements that pass the test condition."
    },
    
    {
      question: "What is the second parameter of the reduce() method?",
      options: [
        "The callback function",
        "The initial value for the accumulator",
        "The current index",
        "The original array"
      ],
      correct: 1,
      explanation: "The second parameter of reduce() is the initial value for the accumulator. If not provided, the first element of the array is used."
    },
    
    {
      question: "Can you chain map(), filter(), and reduce() together?",
      options: [
        "No, they must be used separately",
        "Yes, because they all return arrays",
        "Only map() and filter() can be chained",
        "Yes, but reduce() must be last since it returns a single value"
      ],
      correct: 3,
      explanation: "You can chain these methods, but reduce() should typically be last since it returns a single value, not an array."
    }
  ]
};

export default mapFilterReduceContent;