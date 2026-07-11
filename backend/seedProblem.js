const mongoose = require('mongoose');
const Problem = require('./models/problem');
const AuthUser = require('./models/authUser');
require('dotenv').config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get the first user (we'll just use them as the creator)
    const user = await AuthUser.findOne();
    if (!user) {
      console.log('No users found. Please register a user first.');
      process.exit(1);
    }

    const description = `
      <p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to <code>target</code>.</p>
      <p>You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.</p>
      <p>You can return the answer in any order.</p>
      <br />
      <h3>Example 1:</h3>
      <pre><strong>Input:</strong> nums = [2,7,11,15], target = 9
<strong>Output:</strong> [0,1]
<strong>Explanation:</strong> Because nums[0] + nums[1] == 9, we return [0, 1].</pre>
    `;

    const starterCode = `function twoSum(nums, target) {
  // Write your code here
  
}
`;

    const testCases = [
      { input: "[2,7,11,15]\n9", expectedOutput: "[0,1]" },
      { input: "[3,2,4]\n6", expectedOutput: "[1,2]" },
      { input: "[3,3]\n6", expectedOutput: "[0,1]" }
    ];

    // Check if Two Sum exists
    let problem = await Problem.findOne({ title: 'Two Sum' });

    if (problem) {
      problem.description = description;
      problem.starterCode = starterCode;
      problem.testCases = testCases;
      // if statement field still exists, mongoose will just ignore it upon save based on new schema
      await problem.save();
      console.log('Updated Two Sum problem');
    } else {
      await Problem.create({
        title: 'Two Sum',
        description,
        starterCode,
        difficulty: 'Easy',
        tags: ['Array', 'Hash Table'],
        timeLimit: 1.0,
        memoryLimit: 256,
        createdBy: user._id,
        testCases
      });
      console.log('Created Two Sum problem');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seed();
