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

        `,
        testCases: [
          { input: "123", expectedOutput: "321" },
          { input: "-123", expectedOutput: "-321" },
          { input: "120", expectedOutput: "21" }
        ]
      },
      {
        title: 'Merge Intervals',
        difficulty: 'Medium',
        tags: ['Array', 'Sorting'],
        timeLimit: 1.0,
        memoryLimit: 256,
        description: `
          <p>Given an array of intervals where <code>intervals[i] = [starti, endi]</code>, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.</p>
          <br />
          <h3>Input Format:</h3>
          <ul>
            <li>The first line contains an integer <code>n</code>, the number of intervals.</li>
            <li>The next <code>n</code> lines each contain two space-separated integers representing the start and end of an interval.</li>
          </ul>
          <h3>Output Format:</h3>
          <p>Print the merged intervals, each on a new line, space-separated.</p>
        `,
        testCases: [
          { input: "4\n1 3\n2 6\n8 10\n15 18", expectedOutput: "1 6\n8 10\n15 18" },
          { input: "2\n1 4\n4 5", expectedOutput: "1 5" }
        ]
      },
      {
        title: 'Climbing Stairs',
        difficulty: 'Easy',
        tags: ['Dynamic Programming', 'Math'],
        timeLimit: 1.0,
        memoryLimit: 256,
        description: `
          <p>You are climbing a staircase. It takes <code>n</code> steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?</p>
          <br />
          <h3>Input Format:</h3>
          <p>The first line contains an integer <code>n</code>.</p>
          <h3>Output Format:</h3>
          <p>Print the number of distinct ways.</p>
        `,
        testCases: [
          { input: "2", expectedOutput: "2" },
          { input: "3", expectedOutput: "3" }
        ]
      },
      {
        title: 'Maximum Subarray',
        difficulty: 'Medium',
        tags: ['Array', 'Dynamic Programming'],
        timeLimit: 1.0,
        memoryLimit: 256,
        description: `
          <p>Given an integer array <code>nums</code>, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.</p>
          <br />
          <h3>Input Format:</h3>
          <ul>
            <li>The first line contains an integer <code>n</code>.</li>
            <li>The second line contains <code>n</code> space-separated integers.</li>
          </ul>
          <h3>Output Format:</h3>
          <p>Print the maximum subarray sum.</p>
        `,
        testCases: [
          { input: "9\n-2 1 -3 4 -1 2 1 -5 4", expectedOutput: "6" },
          { input: "1\n1", expectedOutput: "1" }
        ]
      },
      {
        title: 'Number of Islands',
        difficulty: 'Medium',
        tags: ['Array', 'DFS', 'BFS', 'Matrix'],
        timeLimit: 2.0,
        memoryLimit: 256,
        description: `
          <p>Given an <code>m x n</code> 2D binary grid <code>grid</code> which represents a map of '1's (land) and '0's (water), return the number of islands.</p>
          <p>An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.</p>
          <br />
          <h3>Input Format:</h3>
          <ul>
            <li>The first line contains two integers <code>m</code> and <code>n</code>.</li>
            <li>The next <code>m</code> lines each contain a string of length <code>n</code> consisting of '0' and '1'.</li>
          </ul>
          <h3>Output Format:</h3>
          <p>Print the number of islands.</p>
        `,
        testCases: [
          { input: "4 5\n11110\n11010\n11000\n00000", expectedOutput: "1" },
          { input: "4 5\n11000\n11000\n00100\n00011", expectedOutput: "3" }
        ]
      },
      {
        title: 'Longest Substring Without Repeating Characters',
        difficulty: 'Medium',
        tags: ['String', 'Sliding Window', 'Hash Table'],
        timeLimit: 1.0,
        memoryLimit: 256,
        description: `
          <p>Given a string <code>s</code>, find the length of the longest substring without repeating characters.</p>
          <br />
          <h3>Input Format:</h3>
          <p>The first line contains the string <code>s</code>.</p>
          <h3>Output Format:</h3>
          <p>Print the length of the longest substring.</p>
        `,
        testCases: [
          { input: "abcabcbb", expectedOutput: "3" },
          { input: "bbbbb", expectedOutput: "1" }
        ]
      },
      {
        title: 'Valid Anagram',
        difficulty: 'Easy',
        tags: ['String', 'Sorting', 'Hash Table'],
        timeLimit: 1.0,
        memoryLimit: 256,
        description: `
          <p>Given two strings <code>s</code> and <code>t</code>, return true if <code>t</code> is an anagram of <code>s</code>, and false otherwise.</p>
          <br />
          <h3>Input Format:</h3>
          <ul>
            <li>The first line contains the string <code>s</code>.</li>
            <li>The second line contains the string <code>t</code>.</li>
          </ul>
          <h3>Output Format:</h3>
          <p>Print <code>true</code> if they are anagrams, <code>false</code> otherwise.</p>
        `,
        testCases: [
          { input: "anagram\nnagaram", expectedOutput: "true" },
          { input: "rat\ncar", expectedOutput: "false" }
        ]
      },
      {
        title: 'Product of Array Except Self',
        difficulty: 'Medium',
        tags: ['Array', 'Prefix Sum'],
        timeLimit: 1.0,
        memoryLimit: 256,
        description: `
          <p>Given an integer array <code>nums</code>, return an array <code>answer</code> such that <code>answer[i]</code> is equal to the product of all the elements of <code>nums</code> except <code>nums[i]</code>.</p>
          <p>You must write an algorithm that runs in O(n) time and without using the division operation.</p>
          <br />
          <h3>Input Format:</h3>
          <ul>
            <li>The first line contains an integer <code>n</code>.</li>
            <li>The second line contains <code>n</code> space-separated integers.</li>
          </ul>
          <h3>Output Format:</h3>
          <p>Print the answer array, space-separated.</p>
        `,
        testCases: [
          { input: "4\n1 2 3 4", expectedOutput: "24 12 8 6" },
          { input: "5\n-1 1 0 -3 3", expectedOutput: "0 0 9 0 0" }
        ]
      },
      {
        title: 'Find Minimum in Rotated Sorted Array',
        difficulty: 'Medium',
        tags: ['Array', 'Binary Search'],
        timeLimit: 1.0,
        memoryLimit: 256,
        description: `
          <p>Suppose an array of length <code>n</code> sorted in ascending order is rotated between 1 and n times. Given the sorted rotated array <code>nums</code> of unique elements, return the minimum element of this array.</p>
          <br />
          <h3>Input Format:</h3>
          <ul>
            <li>The first line contains an integer <code>n</code>.</li>
            <li>The second line contains <code>n</code> space-separated integers.</li>
          </ul>
          <h3>Output Format:</h3>
          <p>Print the minimum element.</p>
        `,
        testCases: [
          { input: "5\n3 4 5 1 2", expectedOutput: "1" },
          { input: "7\n4 5 6 7 0 1 2", expectedOutput: "0" }
        ]
      },
      {
        title: 'Trapping Rain Water',
        difficulty: 'Hard',
        tags: ['Array', 'Two Pointers', 'Dynamic Programming', 'Stack'],
        timeLimit: 1.0,
        memoryLimit: 256,
        description: `
          <p>Given <code>n</code> non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.</p>
          <br />
          <h3>Input Format:</h3>
          <ul>
            <li>The first line contains an integer <code>n</code>.</li>
            <li>The second line contains <code>n</code> space-separated integers.</li>
          </ul>
          <h3>Output Format:</h3>
          <p>Print the amount of trapped water.</p>
        `,
        testCases: [
          { input: "12\n0 1 0 2 1 0 1 3 2 1 2 1", expectedOutput: "6" },
          { input: "6\n4 2 0 3 2 5", expectedOutput: "9" }
        ]
      },
      {
        title: 'Group Anagrams',
        difficulty: 'Medium',
        tags: ['Array', 'Hash Table', 'String', 'Sorting'],
        timeLimit: 1.0,
        memoryLimit: 256,
        description: `
          <p>Given an array of strings <code>strs</code>, group the anagrams together. You can return the answer in any order.</p>
          <p>Note: Since output order doesn't matter for this judge, you must print each group on a new line, space-separated. The groups must be sorted lexicographically, and the words within each group must also be sorted lexicographically.</p>
          <br />
          <h3>Input Format:</h3>
          <ul>
            <li>The first line contains an integer <code>n</code>.</li>
            <li>The second line contains <code>n</code> space-separated strings.</li>
          </ul>
          <h3>Output Format:</h3>
          <p>Print each group on a new line.</p>
        `,
        testCases: [
          { input: "6\neat tea tan ate nat bat", expectedOutput: "ate eat tea\nbat\nnat tan" },
          { input: "1\na", expectedOutput: "a" }
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
