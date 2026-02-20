import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { google } from '@ai-sdk/google';
import { tools } from './tools';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  console.log('Received messages are:', messages);

  const context = `
    Available Tamil Nadu College Mess Foods:
    
    Breakfast Options:
    - Idli (steamed rice cakes)
    - Dosa (thin crepe with various fillings)
    - Pongal (rice and lentil dish)
    - Upma (semolina porridge)
    - Uttapam (thick savory pancake)
    - Poori with potato curry
    - Chapati with sambar/rasam
    
    Lunch Options:
    - White Rice with Sambar (lentil vegetable stew)
    - Rice with Rasam (tangy lentil soup)
    - Rice with Dal (lentil curry)
    - Rice with Mixed Curry (vegetable-based)
    - Curd Rice with peas and carrots
    - Lemon Rice
    
    Dinner Options:
    - Roti/Chapati with Mixed vegetable curry
    - Rice with Tomato based curry
    - Rice with Coconut curry
    - Tiffin items (Bonda, Vada, Pakora)
    
    Nutritional Focus:
    - High protein: Sambar, Rasam, Dal dishes
    - High fiber: Mixed vegetables, leafy greens
    - Energy: Carbs from rice/roti, healthy fats from coconut
    `;

  //TODO TASK 1 - System
  const systemPrompt = `You are a Hostel Food Diet Manager for a Tamil Nadu college mess. Your role is to:
  1. Ask students how they are feeling physically and emotionally
  2. Understand their dietary preferences and any health concerns
  3. Check if they have digestive issues, low energy, stress, or other health conditions
  4. Recommend well-balanced meal combinations from the available Tamil Nadu mess foods
  5. Suggest nutritious plate combinations with protein, fiber, and carbs
  6. Always be empathetic, supportive, and health-conscious in your recommendations
  
  Context of available foods: ${context}
  
  Always provide practical suggestions from the mess inventory and encourage balanced eating habits. Be friendly and approachable like a caring nutritionist.
  `;

  const result = streamText({
    model: google('gemini-2.5-flash'),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),

    //TODO TASK 2 - Tool Calling
    // tools,            // Uncomment to enable tool calling
    // maxSteps: 5,      // Allow multi-step tool use (model calls tool → gets result → responds)
  });

  return result.toUIMessageStreamResponse();
}
