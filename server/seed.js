import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Property from './models/Property.js';
import Booking from './models/Booking.js';
import connectDB from './config/db.js';

dotenv.config();

const sampleProperties = [
  {
    title: 'Azure Bayfront Luxury Villa with Infinity Pool',
    description: 'Breathtaking beachfront villa featuring panoramic ocean views, private infinity pool, direct beach access, chef kitchen, and open-concept indoor-outdoor living spaces.',
    price: 250,
    location: 'Goa, India',
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['Private Pool', 'Oceanfront', 'High-Speed Wi-Fi', 'Air Conditioning', 'Free Parking', 'Chef Kitchen'],
  },
  {
    title: 'Pine Forest Wooden Chalet & Fireplace',
    description: 'Cozy rustic wooden chalet perched amidst the cedar pines of the Himalayas. Features a stone fireplace, stargazing deck, and heated floors.',
    price: 110,
    location: 'Manali, Himachal Pradesh',
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['Mountain View', 'Indoor Fireplace', 'Heated Rooms', 'Wi-Fi', 'Breakfast Included'],
  },
  {
    title: 'Royal Heritage Haveli & Courtyard',
    description: 'Immerse yourself in Rajasthani royalty in this restored 18th-century boutique haveli featuring handcrafted jharokhas, marble courtyards, and rooftop sunset dining.',
    price: 180,
    location: 'Jaipur, Rajasthan',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['Heritage Architecture', 'Rooftop Restaurant', 'Spa Services', 'Wi-Fi', 'Air Conditioning'],
  },
  {
    title: 'Modern Skyline Penthouse in Bandra',
    description: 'Ultra-modern 3-bedroom penthouse with 360-degree skyline views, modern designer furnishings, smart home automation, and 24/7 building concierge.',
    price: 210,
    location: 'Mumbai, Maharashtra',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['City Skyline View', 'Smart Home', 'Gym Access', 'High-Speed Wi-Fi', 'Dedicated Workspace'],
  },
  {
    title: 'Coffee Plantation Estate Treehouse',
    description: 'Unique eco-friendly treehouse built among lush evergreen coffee and spice estates. Wake up to singing birds, fresh morning mist, and artisanal estate brews.',
    price: 95,
    location: 'Coorg, Karnataka',
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['Estate Tour', 'Balcony View', 'Nature Trails', 'Complimentary Breakfast', 'Free Parking'],
  },
  {
    title: 'Tranquil Backwaters Eco Resort Villa',
    description: 'Serene waterfront villa right along the calming backwaters of Alleppey. Features private boat dock, hammock deck, and authentic Ayurvedic massage options.',
    price: 130,
    location: 'Alleppey, Kerala',
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['Backwater View', 'Boating Dock', 'Ayurveda Spa', 'Air Conditioning', 'Free Wi-Fi'],
  },
];

const seedData = async () => {
  try {
    await connectDB();

    console.log('🧹 Clearing existing data...');
    await Booking.deleteMany();
    await Property.deleteMany();
    await User.deleteMany();

    console.log('👤 Creating default test users...');
    const salt = await bcrypt.genSalt(10);
    const hostPassword = await bcrypt.hash('password123', salt);
    const guestPassword = await bcrypt.hash('password123', salt);

    const hostUser = await User.create({
      name: 'Rohan Sharma (Host)',
      email: 'host@homelyhub.com',
      password: hostPassword,
      role: 'owner',
    });

    const guestUser = await User.create({
      name: 'Aarav Patel (Guest)',
      email: 'guest@homelyhub.com',
      password: guestPassword,
      role: 'guest',
    });

    console.log('🏡 Creating sample properties...');
    const propertiesWithHost = sampleProperties.map((p) => ({
      ...p,
      ownerId: hostUser._id,
    }));

    const createdProperties = await Property.insertMany(propertiesWithHost);

    console.log('📅 Creating initial sample booking...');
    // Create an active booking for Property 1 to test overlap rejection
    const checkIn = new Date();
    checkIn.setDate(checkIn.getDate() + 5); // 5 days from now
    const checkOut = new Date();
    checkOut.setDate(checkOut.getDate() + 9); // 9 days from now

    await Booking.create({
      propertyId: createdProperties[0]._id,
      userId: guestUser._id,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      totalPrice: createdProperties[0].price * 4,
      status: 'confirmed',
    });

    console.log('🎉 Seed Completed Successfully!');
    console.log('----------------------------------------------------');
    console.log('🔑 Test Accounts:');
    console.log('   Host:  email: host@homelyhub.com  | password: password123');
    console.log('   Guest: email: guest@homelyhub.com | password: password123');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed Error:', error);
    process.exit(1);
  }
};

seedData();
