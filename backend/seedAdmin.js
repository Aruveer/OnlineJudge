const mongoose = require('mongoose');
const AuthUser = require('./models/authUser');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const email = 'admin@gmail.com';
    let admin = await AuthUser.findOne({ email });

    if (admin) {
      console.log('Admin user already exists.');
    } else {
      admin = await AuthUser.create({
        firstName: '',
        lastName: 'Admin',
        email,
        password: 'admin123',
        role: 'admin'
      });
      console.log('Successfully created admin user!');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
};

seedAdmin();
