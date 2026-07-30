const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Helper to interact with Groq
const callGroq = async (messages, model = 'llama-3.3-70b-versatile') => {
  const completion = await groq.chat.completions.create({
    messages,
    model,
    temperature: 0.7,
  });
  return completion.choices[0]?.message?.content || '';
};

exports.chat = async (req, res) => {
  try {
    const { problemTitle, problemStatement, message, history = [] } = req.body;
    
    const systemPrompt = `You are a helpful AI Coding Assistant for a competitive programming platform called SolveIt. 
The user is currently working on the problem: "${problemTitle}".
Problem Description:
${problemStatement}

Your goal is to provide conceptual help, algorithm explanations, or clarify the problem. 
DO NOT write out the full code solution for the user. Guide them to the answer.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: message }
    ];

    const reply = await callGroq(messages);
    res.json({ reply });
  } catch (error) {
    console.error('Groq Chat Error:', error);
    res.status(500).json({ error: 'AI Service Error', message: error.message });
  }
};

exports.hint = async (req, res) => {
  try {
    const { problemTitle, problemStatement, code, language, errorMessage, testcaseResult, history, hintNumber } = req.body;
    
    const systemPrompt = `You are an AI Hint Generator for a competitive programming platform.
The user is working on "${problemTitle}".
Problem:
${problemStatement}

User's Code (${language}):
${code}

Submission Result:
Error: ${errorMessage || 'None'}
Testcase Result: ${testcaseResult || 'None'}

CRITICAL INSTRUCTIONS:
1. ONLY GENERATE A HINT. NEVER PROVIDE THE FULL SOLUTION OR CODE FIXES.
2. The user is asking for Hint #${hintNumber || 1}. 
3. If this is Hint 1, give a very high-level nudge about the concept or the edge case they missed.
4. If this is Hint 2 or higher, give progressively more detailed guidance, but still DO NOT write the code for them.
5. Focus exclusively on why the current approach failed.`;

    const formattedHistory = (history || []).map(msg => ({ role: msg.role, content: msg.content }));
    const messages = [
      { role: 'system', content: systemPrompt },
      ...formattedHistory
    ];
    // If history doesn't already have the latest user prompt, add a default one
    if (messages.length === 1) {
      messages.push({ role: 'user', content: `Please give me hint #${hintNumber || 1}` });
    }
    const hint = await callGroq(messages);
    
    res.json({ hint });
  } catch (error) {
    console.error('Groq Hint Error:', error);
    res.status(500).json({ error: 'AI Service Error', message: error.message });
  }
};

exports.review = async (req, res) => {
  try {
    const { problemTitle, problemStatement, code, language } = req.body;
    
    const systemPrompt = `You are an AI Code Reviewer for a competitive programming platform.
The user successfully solved "${problemTitle}".
Problem:
${problemStatement}

Accepted Code (${language}):
${code}

Provide a brief code quality review.

First, determine the overall rating for this code. Choose exactly ONE of these three options:
1. EFFICIENT (if the code is optimal in time and space)
2. CAN_IMPROVE (if there are minor optimizations or better practices)
3. POTENTIAL_BOTTLENECK (if the approach will fail on larger constraints)

Your entire response MUST be formatted strictly like this, with NO OTHER TEXT:

RATING: [YOUR CHOSEN RATING HERE]
[YOUR CHOSEN RATING HERE]: [Your detailed explanation of the review here]

Note: If the language is C++, do NOT criticize the use of \`#include <iostream>\` or \`using namespace std;\` as they are part of the required boilerplate.`;

    const messages = [{ role: 'user', content: systemPrompt }];
    const reviewText = await callGroq(messages);
    
    res.json({ review: reviewText });
  } catch (error) {
    console.error('Groq Review Error:', error);
    res.status(500).json({ error: 'AI Service Error', message: error.message });
  }
};
