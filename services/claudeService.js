
const axios = require('axios');

// Mock function to simulate Claude API integration
// In a real application, you would connect to Claude's API
const generateTale = async (options) => {
  try {
    const { childAge, topic, setting, characters, mood } = options;
    
    console.log('Generating tale with options:', options);
    
    // In a real implementation, you would call Claude API here
    // For now, we'll simulate a response
    
    // Create prompt for Claude
    const prompt = createPrompt(options);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate a mock tale based on the options
    const title = generateMockTitle(topic, mood);
    const content = generateMockContent(childAge, topic, setting, characters, mood);
    
    return {
      title,
      content
    };
  } catch (error) {
    console.error('Tale generation error:', error);
    return null;
  }
};

const testConnection = async () => {
  // In a real implementation, you would test your connection to Claude API
  return { status: 'ok' };
};

// Helper function to create a prompt for Claude
const createPrompt = (options) => {
  const { childAge, topic, setting, characters, mood } = options;
  
  let ageDescription;
  if (childAge === '3-4') {
    ageDescription = 'preschool children (3-4 years old)';
  } else if (childAge === '5-8') {
    ageDescription = 'early elementary children (5-8 years old)';
  } else {
    ageDescription = 'upper elementary children (9-12 years old)';
  }
  
  let prompt = `Create an engaging children's story for ${ageDescription} about ${topic}.`;
  
  if (setting) {
    prompt += ` The story should be set in ${setting}.`;
  }
  
  if (characters) {
    prompt += ` The main characters should include ${characters}.`;
  }
  
  if (mood === 'happy') {
    prompt += ' The story should have a happy and uplifting tone with a positive message.';
  } else if (mood === 'adventurous') {
    prompt += ' The story should be exciting and adventurous with elements of discovery and courage.';
  } else if (mood === 'educational') {
    prompt += ' The story should include educational elements that teach children something valuable.';
  } else if (mood === 'calming') {
    prompt += ' The story should have a calming, peaceful tone perfect for bedtime.';
  }
  
  prompt += ' Include a creative title for the story. The story should be appropriate for children and promote positive values.';
  
  return prompt;
};

// Mock title generator
const generateMockTitle = (topic, mood) => {
  const titlePrefixes = {
    happy: ['The Joyful', 'Happy', 'The Wonderful', 'The Magical'],
    adventurous: ['The Great', 'The Daring', 'The Epic', 'The Incredible'],
    educational: ['Discovering', 'Learning About', 'The Curious', 'The Amazing'],
    calming: ['The Peaceful', 'The Gentle', 'Dreaming of', 'The Quiet']
  };
  
  const prefix = titlePrefixes[mood][Math.floor(Math.random() * titlePrefixes[mood].length)];
  const topicWords = topic.split(' ');
  const mainTopic = topicWords[0].charAt(0).toUpperCase() + topicWords[0].slice(1);
  
  return `${prefix} ${mainTopic}`;
};

// Mock content generator
const generateMockContent = (childAge, topic, setting, characters, mood) => {
  let content = '';
  
  // Intro paragraph based on age
  if (childAge === '3-4') {
    content += `Once upon a time, there was a wonderful world where ${topic} was very special. `;
  } else if (childAge === '5-8') {
    content += `In a land not so far away, there was an amazing place where ${topic} was the most important thing. `;
  } else {
    content += `Long ago, in a realm where imagination and reality blend together, there existed a fascinating story about ${topic}. `;
  }
  
  // Add setting if provided
  if (setting) {
    content += `This story takes place in ${setting}, where everything was magical and exciting. `;
  }
  
  // Add characters if provided
  if (characters) {
    content += `The heroes of our story are ${characters}, who were always ready for new adventures. `;
  } else {
    content += `Our story follows a brave little character who loved exploring and learning new things. `;
  }
  
  // Middle part based on mood
  if (mood === 'happy') {
    content += `\n\nEvery day was filled with joy and laughter. The sun shone brightly, and friends played together happily. They discovered that sharing and being kind made everyone feel good inside. `;
  } else if (mood === 'adventurous') {
    content += `\n\nOne day, a great challenge appeared! It was time for an exciting adventure. With courage in their hearts, they set off to explore unknown territories and face whatever lay ahead. `;
  } else if (mood === 'educational') {
    content += `\n\nThere was so much to learn about ${topic}! Did you know that understanding how things work can be the greatest adventure? Our heroes discovered fascinating facts and important lessons. `;
  } else if (mood === 'calming') {
    content += `\n\nThe gentle breeze whispered through the trees as stars twinkled in the night sky. Everything was peaceful and calm, perfect for thinking about beautiful dreams. `;
  }
  
  // Add a middle section with more detail
  content += `\n\nAs they journeyed through their day, they encountered many interesting things. They learned that ${topic} was even more amazing than they had imagined. Every discovery brought new understanding and happiness. `;
  
  // Conclusion based on age and mood
  if (childAge === '3-4') {
    content += `\n\nAt the end of the day, everyone was happy and safe. They had learned that ${topic} was special because it brought friends together. And they all smiled as they fell asleep, dreaming of tomorrow's adventures.`;
  } else if (childAge === '5-8') {
    content += `\n\nAfter their amazing experiences, they understood something important about ${topic}. It wasn't just about the adventure, but about the friends they made and the lessons they learned along the way. As the sun set, they knew tomorrow would bring new discoveries.`;
  } else {
    content += `\n\nAs their journey came to a close, they reflected on everything they had experienced. The true value of ${topic} wasn't what they had initially thought. It was about growth, understanding, and the connections they had formed. With this new wisdom, they were ready for whatever challenges awaited them next.`;
  }
  
  return content;
};

module.exports = {
  generateTale,
  testConnection
};
