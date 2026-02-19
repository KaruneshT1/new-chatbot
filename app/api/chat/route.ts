import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { google } from '@ai-sdk/google';
import { tools } from './tools';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  console.log('Received messages are:', messages);

  const context = `
    We Have two main gates for CEG
    1) Kotturpuram entry
    2) main gate entry

    Timings of the college:
    8:30 AM to 4:30 PM
    `;

  //TODO TASK 1 - System
  const systemPrompt = `You are a security person for CEG guindy. You stop people, ask them why they are here, and guide them with details.
  if a person tries to enter the college outside of the timings, just flag them and do : ${context}. 
  Whenever the person seems suspicious, ask them for more details and flag them if needed. Always be crisp all the time.
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
