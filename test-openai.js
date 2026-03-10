// Test OpenAI API
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testOpenAI() {
  try {
    console.log('Testing OpenAI API...');
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: "Hello, can you respond with 'OpenAI is working!'?"
        }
      ],
      max_tokens: 10,
    });

    console.log('OpenAI Response:', response.choices[0].message.content);
    console.log('✅ OpenAI API is working!');
  } catch (error) {
    console.error('❌ OpenAI API Error:', error.message);
    if (error.status) {
      console.error('Status Code:', error.status);
    }
  }
}

testOpenAI();
