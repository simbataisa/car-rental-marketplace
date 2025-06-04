// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

// Check if we should use Admin SDK or regular Firebase
const useAdminSDK = process.env.FIREBASE_ADMIN_SDK === 'true';

let db, auth;

if (useAdminSDK) {
  // Use Firebase Admin SDK (bypasses security rules)
  const admin = require('firebase-admin');
  
  // Initialize Admin SDK with minimal configuration
  if (!admin.apps.length) {
    try {
      admin.initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
      });
    } catch (error) {
      console.error('Failed to initialize Admin SDK:', error.message);
      console.log('\n💡 Admin SDK requires proper authentication setup.');
      console.log('   Falling back to regular Firebase SDK with authentication...');
      process.env.FIREBASE_ADMIN_SDK = 'false';
      // Re-run with regular SDK
      require('./seed-data.js');
      return;
    }
  }
  
  db = admin.firestore();
  console.log('Using Firebase Admin SDK (bypasses security rules)');
  console.log(`Project ID: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`);
} else {
  // Use regular Firebase SDK with authentication
  const { initializeApp } = require('firebase/app');
  const { getFirestore } = require('firebase/firestore');
  const { getAuth } = require('firebase/auth');
  
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  };
  
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  console.log('Using Firebase Web SDK (requires authentication)');
}

// Sample orders data for specific users
const sampleOrders = [
  // Orders for Customer User (ZAqL1q2VOzYEujaODP5GMVcD9Ak2)
  {
    customerId: 'ZAqL1q2VOzYEujaODP5GMVcD9Ak2',
    customerName: 'Customer User',
    customerEmail: 'customer@example.com',
    carId: 'car-001',
    carName: 'VinFast VF 8',
    carImage: 'https://images.unsplash.com/photo-1549399736-8e8c2b0e7e8a?w=400',
    startDate: '2024-02-15',
    endDate: '2024-02-18',
    totalAmount: 240,
    status: 'confirmed',
    priority: 'medium',
    source: 'website',
    pickupLocation: '123 Nguyen Hue Street, District 1, Ho Chi Minh City',
    dropoffLocation: '123 Nguyen Hue Street, District 1, Ho Chi Minh City',
    createdAt: new Date('2024-01-20T10:30:00Z'),
    updatedAt: new Date('2024-01-20T14:15:00Z')
  },
  {
    customerId: 'ZAqL1q2VOzYEujaODP5GMVcD9Ak2',
    customerName: 'Customer User',
    customerEmail: 'customer@example.com',
    carId: 'car-002',
    carName: 'Toyota Camry',
    carImage: 'https://images.unsplash.com/photo-1549399736-8e8c2b0e7e8a?w=400',
    startDate: '2024-01-10',
    endDate: '2024-01-12',
    totalAmount: 180,
    status: 'completed',
    priority: 'low',
    source: 'website',
    pickupLocation: '321 Hai Ba Trung Street, District 1, Ho Chi Minh City',
    dropoffLocation: '321 Hai Ba Trung Street, District 1, Ho Chi Minh City',
    createdAt: new Date('2024-01-05T09:15:00Z'),
    updatedAt: new Date('2024-01-12T18:30:00Z')
  },
  {
    customerId: 'ZAqL1q2VOzYEujaODP5GMVcD9Ak2',
    customerName: 'Customer User',
    customerEmail: 'customer@example.com',
    carId: 'car-003',
    carName: 'BMW X3',
    carImage: 'https://images.unsplash.com/photo-1549399736-8e8c2b0e7e8a?w=400',
    startDate: '2024-03-01',
    endDate: '2024-03-05',
    totalAmount: 480,
    status: 'in-progress',
    priority: 'medium',
    source: 'website',
    pickupLocation: '789 Dong Khoi Street, District 1, Ho Chi Minh City',
    dropoffLocation: '789 Dong Khoi Street, District 1, Ho Chi Minh City',
    createdAt: new Date('2024-02-25T14:20:00Z'),
    updatedAt: new Date('2024-03-01T08:00:00Z')
  },
  {
    customerId: 'ZAqL1q2VOzYEujaODP5GMVcD9Ak2',
    customerName: 'Customer User',
    customerEmail: 'customer@example.com',
    carId: 'car-004',
    carName: 'Honda CR-V',
    carImage: 'https://images.unsplash.com/photo-1549399736-8e8c2b0e7e8a?w=400',
    startDate: '2024-04-10',
    endDate: '2024-04-15',
    totalAmount: 350,
    status: 'pending',
    priority: 'high',
    source: 'phone',
    pickupLocation: '456 Le Loi Street, District 3, Ho Chi Minh City',
    dropoffLocation: '456 Le Loi Street, District 3, Ho Chi Minh City',
    createdAt: new Date('2024-04-05T09:15:00Z'),
    updatedAt: new Date('2024-04-05T09:15:00Z')
  },
  // Orders for Admin User (EmtS2QvNJPgSmrgNvDHm5n1bwRw1) - Admin can also have personal bookings
  {
    customerId: 'EmtS2QvNJPgSmrgNvDHm5n1bwRw1',
    customerName: 'Admin User',
    customerEmail: 'admin@example.com',
    carId: 'car-005',
    carName: 'Mercedes-Benz C-Class',
    carImage: 'https://images.unsplash.com/photo-1549399736-8e8c2b0e7e8a?w=400',
    startDate: '2024-02-01',
    endDate: '2024-02-03',
    totalAmount: 320,
    status: 'completed',
    priority: 'medium',
    source: 'website',
    pickupLocation: '100 Pasteur Street, District 1, Ho Chi Minh City',
    dropoffLocation: '100 Pasteur Street, District 1, Ho Chi Minh City',
    createdAt: new Date('2024-01-25T11:00:00Z'),
    updatedAt: new Date('2024-02-03T16:30:00Z')
  },
  {
    customerId: 'EmtS2QvNJPgSmrgNvDHm5n1bwRw1',
    customerName: 'Admin User',
    customerEmail: 'admin@example.com',
    carId: 'car-006',
    carName: 'Audi A4',
    carImage: 'https://images.unsplash.com/photo-1549399736-8e8c2b0e7e8a?w=400',
    startDate: '2024-03-15',
    endDate: '2024-03-20',
    totalAmount: 450,
    status: 'confirmed',
    priority: 'low',
    source: 'website',
    pickupLocation: '200 Tran Hung Dao Street, District 5, Ho Chi Minh City',
    dropoffLocation: '200 Tran Hung Dao Street, District 5, Ho Chi Minh City',
    createdAt: new Date('2024-03-10T14:45:00Z'),
    updatedAt: new Date('2024-03-12T09:20:00Z')
  }
];

// Function to seed orders
async function seedOrders() {
  try {
    console.log('Starting to seed orders...');
    
    if (useAdminSDK) {
      // Using Admin SDK - no authentication needed
      for (const order of sampleOrders) {
        const docRef = await db.collection('orders').add(order);
        console.log(`Order added with ID: ${docRef.id}`);
      }
    } else {
      // Using Web SDK - need authentication
      const readline = require('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      const email = await new Promise(resolve => {
        rl.question('Enter admin email: ', resolve);
      });
      
      const password = await new Promise(resolve => {
        rl.question('Enter admin password: ', resolve);
      });
      
      rl.close();
      
      console.log('Authenticating...');
      
      // Sign in with admin credentials
      const { signInWithEmailAndPassword } = require('firebase/auth');
      const { collection, addDoc } = require('firebase/firestore');
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log(`Authenticated as: ${user.email}`);
      
      // Now seed the orders with authenticated context
      for (const order of sampleOrders) {
        const docRef = await addDoc(collection(db, 'orders'), order);
        console.log(`Order added with ID: ${docRef.id}`);
      }
    }
    
    console.log('All orders seeded successfully!');
    console.log(`\n✅ Added ${sampleOrders.length} sample orders to Firestore`);
    console.log('\n📋 Summary:');
    console.log(`   • Customer orders (cust_12345_sample): 3 orders`);
    console.log(`   • Admin orders (admin_67890_sample): 2 orders`);
    process.exit(0);
    
  } catch (error) {
    console.error('Error during seeding:', error);
    console.log('\n💡 Troubleshooting tips:');
    console.log('   1. Check your Firebase configuration in .env.local');
    console.log('   2. Ensure Firestore security rules allow writes');
    console.log('   3. Try using Admin SDK: FIREBASE_ADMIN_SDK=true node seed-data.js');
    console.log('   4. Or temporarily relax security rules (see firestore-dev-rules.txt)');
    process.exit(1);
  }
}

// Run the seeding
seedOrders();