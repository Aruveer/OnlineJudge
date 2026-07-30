const mongoose = require('mongoose');
const Problem = require('./models/problem');
const AuthUser = require('./models/authUser');
require('dotenv').config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const email = 'admin@gmail.com';
    let user = await AuthUser.findOne({ email });

    if (!user) {
      user = await AuthUser.create({
        firstName: 'System',
        lastName: 'Admin',
        email,
        password: 'admin123',
        role: 'admin'
      });
      console.log('Admin user created.');
    } else {
      console.log('Admin user already exists.');
    }

    const problems = [
      {
        title: 'Two Sum',
        difficulty: 'Easy',
        tags: ['Array', 'Hash Table'],
        timeLimit: 1.0,
        memoryLimit: 256,
        description: `
          <p>Given an array of integers <code>nums</code> and an integer <code>target</code>, find the indices of the two numbers such that they add up to <code>target</code>.</p>
          <p>You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.</p>
          <br />
          <h3>Input Format:</h3>
          <ul>
            <li>The first line contains an integer <code>n</code>, the size of the array.</li>
            <li>The second line contains <code>n</code> space-separated integers representing the array <code>nums</code>.</li>
            <li>The third line contains the integer <code>target</code>.</li>
          </ul>
          <h3>Output Format:</h3>
          <p>Print two space-separated integers representing the indices.</p>
          <br />
          <h3>Example 1:</h3>
          <pre><strong>Input:</strong>\n4\n2 7 11 15\n9\n<strong>Output:</strong>\n0 1</pre>
        `,
        testCases: [
          { input: "4\n2 7 11 15\n9", expectedOutput: "0 1" },
          { input: "3\n3 2 4\n6", expectedOutput: "1 2" }
        ]
      },
      {
        title: 'Reverse String',
        difficulty: 'Easy',
        tags: ['String', 'Two Pointers'],
        timeLimit: 1.0,
        memoryLimit: 256,
        description: `
          <p>Write a program that reverses a string.</p>
          <br />
          <h3>Input Format:</h3>
          <p>The first line contains a single string <code>s</code>.</p>
          <h3>Output Format:</h3>
          <p>Print the reversed string.</p>
          <br />
          <h3>Example 1:</h3>
          <pre><strong>Input:</strong>\nhello\n<strong>Output:</strong>\nolleh</pre>
        `,
        testCases: [
          { input: "hello", expectedOutput: "olleh" },
          { input: "Hannah", expectedOutput: "hannaH" }
        ]
      },
      {
        title: 'Palindrome Number',
        difficulty: 'Easy',
        tags: ['Math'],
        timeLimit: 1.0,
        memoryLimit: 256,
        description: `
          <p>Given an integer <code>x</code>, determine if <code>x</code> is a palindrome.</p>
          <br />
          <h3>Input Format:</h3>
          <p>The first line contains the integer <code>x</code>.</p>
          <h3>Output Format:</h3>
          <p>Print <code>true</code> if it is a palindrome, otherwise print <code>false</code>.</p>
          <br />
          <h3>Example 1:</h3>
          <pre><strong>Input:</strong>\n121\n<strong>Output:</strong>\ntrue</pre>
        `,
        testCases: [
          { input: "121", expectedOutput: "true" },
          { input: "-121", expectedOutput: "false" },
          { input: "10", expectedOutput: "false" }
        ]
      },
      {
        title: 'Valid Parentheses',
        difficulty: 'Easy',
        tags: ['String', 'Stack'],
        timeLimit: 1.0,
        memoryLimit: 256,
        description: `
          <p>Given a string <code>s</code> containing just the characters <code>'('</code>, <code>')'</code>, <code>'{'</code>, <code>'}'</code>, <code>'['</code> and <code>']'</code>, determine if the input string is valid.</p>
          <br />
          <h3>Input Format:</h3>
          <p>The first line contains the string <code>s</code>.</p>
          <h3>Output Format:</h3>
          <p>Print <code>true</code> if valid, otherwise print <code>false</code>.</p>
          <br />
          <h3>Example 1:</h3>
          <pre><strong>Input:</strong>\n()[]{}\n<strong>Output:</strong>\ntrue</pre>
        `,
        testCases: [
          { input: "()", expectedOutput: "true" },
          { input: "()[]{}", expectedOutput: "true" },
          { input: "(]", expectedOutput: "false" }
        ]
      },
      {
        title: 'Maximum Subarray',
        difficulty: 'Medium',
        tags: ['Array', 'Dynamic Programming'],
        timeLimit: 1.0,
        memoryLimit: 256,
        description: `
          <p>Given an integer array <code>nums</code>, find the subarray with the largest sum, and return its sum.</p>
          <br />
          <h3>Input Format:</h3>
          <ul>
            <li>The first line contains an integer <code>n</code>.</li>
            <li>The second line contains <code>n</code> space-separated integers.</li>
          </ul>
          <h3>Output Format:</h3>
          <p>Print a single integer representing the maximum sum.</p>
          <br />
          <h3>Example 1:</h3>
          <pre><strong>Input:</strong>\n9\n-2 1 -3 4 -1 2 1 -5 4\n<strong>Output:</strong>\n6</pre>
        `,
        testCases: [
          { input: "9\n-2 1 -3 4 -1 2 1 -5 4", expectedOutput: "6" },
          { input: "1\n1", expectedOutput: "1" }
        ]
      },
      {
        title: 'Contains Duplicate',
        difficulty: 'Easy',
        tags: ['Array', 'Hash Table'],
        timeLimit: 1.0,
        memoryLimit: 256,
        description: `
          <p>Given an integer array <code>nums</code>, determine if any value appears at least twice in the array.</p>
          <br />
          <h3>Input Format:</h3>
          <ul>
            <li>The first line contains an integer <code>n</code>.</li>
            <li>The second line contains <code>n</code> space-separated integers.</li>
          </ul>
          <h3>Output Format:</h3>
          <p>Print <code>true</code> if a duplicate exists, otherwise print <code>false</code>.</p>
          <br />
          <h3>Example 1:</h3>
          <pre><strong>Input:</strong>\n4\n1 2 3 1\n<strong>Output:</strong>\ntrue</pre>
        `,
        testCases: [
          { input: "4\n1 2 3 1", expectedOutput: "true" },
          { input: "4\n1 2 3 4", expectedOutput: "false" }
        ]
      },
      {
        title: 'Fizz Buzz',
        difficulty: 'Easy',
        tags: ['Math', 'String'],
        timeLimit: 1.0,
        memoryLimit: 256,
        description: `
          <p>Given an integer <code>n</code>, print the FizzBuzz sequence from 1 to <code>n</code> space-separated.</p>
          <br />
          <h3>Input Format:</h3>
          <p>The first line contains a single integer <code>n</code>.</p>
          <h3>Output Format:</h3>
          <p>Print the <code>n</code> space-separated answers.</p>
          <br />
          <h3>Example 1:</h3>
          <pre><strong>Input:</strong>\n3\n<strong>Output:</strong>\n1 2 Fizz</pre>
        `,
        testCases: [
          { input: "3", expectedOutput: "1 2 Fizz" },
          { input: "5", expectedOutput: "1 2 Fizz 4 Buzz" }
        ]
      },
      {
        title: 'Single Number',
        difficulty: 'Easy',
        tags: ['Array', 'Bit Manipulation'],
        timeLimit: 1.0,
        memoryLimit: 256,
        description: `
          <p>Given a non-empty array of integers <code>nums</code>, every element appears twice except for one. Find that single one.</p>
          <br />
          <h3>Input Format:</h3>
          <ul>
            <li>The first line contains an integer <code>n</code>.</li>
            <li>The second line contains <code>n</code> space-separated integers.</li>
          </ul>
          <h3>Output Format:</h3>
          <p>Print the single unique integer.</p>
          <br />
          <h3>Example 1:</h3>
          <pre><strong>Input:</strong>\n3\n2 2 1\n<strong>Output:</strong>\n1</pre>
        `,
        testCases: [
          { input: "3\n2 2 1", expectedOutput: "1" },
          { input: "5\n4 1 2 1 2", expectedOutput: "4" }
        ]
      },
      {
        title: 'Missing Number',
        difficulty: 'Easy',
        tags: ['Array', 'Math'],
        timeLimit: 1.0,
        memoryLimit: 256,
        description: `
          <p>Given an array <code>nums</code> containing <code>n</code> distinct numbers in the range <code>[0, n]</code>, return the only number in the range that is missing from the array.</p>
          <br />
          <h3>Input Format:</h3>
          <ul>
            <li>The first line contains an integer <code>n</code>.</li>
            <li>The second line contains <code>n</code> space-separated integers.</li>
          </ul>
          <h3>Output Format:</h3>
          <p>Print the missing integer.</p>
          <br />
          <h3>Example 1:</h3>
          <pre><strong>Input:</strong>\n3\n3 0 1\n<strong>Output:</strong>\n2</pre>
        `,
        testCases: [
          { input: "3\n3 0 1", expectedOutput: "2" },
          { input: "2\n0 1", expectedOutput: "2" }
        ]
      },
      {
        title: 'Reverse Integer',
        difficulty: 'Medium',
        tags: ['Math'],
        timeLimit: 1.0,
        memoryLimit: 256,
        description: `
          <p>Given a signed 32-bit integer <code>x</code>, print <code>x</code> with its digits reversed. If reversing <code>x</code> causes the value to go outside the signed 32-bit integer range, then print <code>0</code>.</p>
          <br />
          <h3>Input Format:</h3>
          <p>The first line contains the integer <code>x</code>.</p>
          <h3>Output Format:</h3>
          <p>Print the reversed integer.</p>
          <br />
          <h3>Example 1:</h3>
          <pre><strong>Input:</strong>\n123\n<strong>Output:</strong>\n321</pre>
        `,
        testCases: [
          { input: "123", expectedOutput: "321" },
          { input: "-123", expectedOutput: "-321" },
          { input: "120", expectedOutput: "21" }
        ]
      }
    ];

    await Problem.deleteMany({});
    console.log('Cleared existing problems');

    for (const prob of problems) {
      prob.createdBy = user._id;
      await Problem.create(prob);
    }
    
    console.log('Successfully seeded 10 Competitive-Programming-style problems!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seed();
