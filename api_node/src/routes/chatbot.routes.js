import { Router } from 'express';
import OpenAI from 'openai';
import { OPENAI_API_KEY } from '../config.js';

const router = Router();
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// Step 2: Create a Thread
async function createThread() {
  const thread = await openai.beta.threads.create();
  return thread.id;
}

// Step 3: Add a Message to a Thread
async function addMessageToThread(threadId, content) {
  const message = await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: content
  });
  return message;
}

// Step 4: Run the Assistant
async function runAssistant(threadId, assistantId) {
  return new Promise((resolve, reject) => {
    let responseText = '';

    const run = openai.beta.threads.runs.stream(threadId, {
      assistant_id: assistantId
    })
    .on('textCreated', (text) => process.stdout.write('\nassistant > '))
    .on('textDelta', (textDelta, snapshot) => {
      process.stdout.write(textDelta.value);
      responseText += textDelta.value;
    })
    .on('toolCallCreated', (toolCall) => process.stdout.write(`\nassistant > ${toolCall.type}\n\n`))
    .on('toolCallDelta', (toolCallDelta, snapshot) => {
      if (toolCallDelta.type === 'code_interpreter') {
        if (toolCallDelta.code_interpreter.input) {
          process.stdout.write(toolCallDelta.code_interpreter.input);
        }
        if (toolCallDelta.code_interpreter.outputs) {
          process.stdout.write("\noutput >\n");
          toolCallDelta.code_interpreter.outputs.forEach(output => {
            if (output.type === "logs") {
              process.stdout.write(`\n${output.logs}\n`);
            }
          });
        }
      }
    })
    .on('end', () => resolve(responseText))
    .on('error', (error) => reject(error));
  });
}

let threadId = null; // Variable para almacenar el ID del thread

router.post('/executeAssistant', async (req, res) => {
  try {
    const { question } = req.body;
    const assistant = ""; // ID del asistente

    if (!threadId) {
      threadId = await createThread();
    }

    await addMessageToThread(threadId, question);
    const responseText = await runAssistant(threadId, assistant);
    res.status(200).send(responseText);
  } catch (error) {
    res.status(500).send(`Error executing assistant: ${error.message}`);
  }
});

export default router; // Exporta como default
