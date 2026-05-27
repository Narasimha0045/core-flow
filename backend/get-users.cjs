const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User.js').default;

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find().limit(3);
    console.log('\n=== LOGIN CREDENTIALS ===\n');
    users.forEach((user, i) => {
      console.log('User ' + (i+1) + ':');
      console.log('  Email: ' + user.email);
      console.log('  Password: password123\n');
    });
    await mongoose.disconnect();
  } catch(e) {
    console.error(e.message);
  }
})();
