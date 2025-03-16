interface ToolMessage {
  content: string; // The error message
  id: string; // Unique identifier for the error
  name: string; // Name of the tool that encountered the error
  status: string; // Status of the tool call (e.g., "error")
  tool_call_id: string; // Unique identifier for the tool call
  type: string;
  artifact?: any;
}

interface AIMessageChunk {
  content: string;
  type: string;
  id: string;
  tool_calls: any[]; // Adjust the type if you have a specific structure for tool calls
  invalid_tool_calls: any[]; // Adjust the type if you have a specific structure for invalid tool calls
  tool_call_chunks: any[]; // Adjust the type if you have a specific structure for tool calls
}

interface ReceivedChunk {
  lc: number;
  type: string;
  id: Array<string>;
  kwargs: ToolMessage | AIMessageChunk;
}

export const parse_chunk = (chunk: ReceivedChunk) => {
  const chunk_type = chunk.id;
  let output = "";

  if (chunk_type.includes("AIMessageChunk")) {
    const chunk_kwargs = chunk.kwargs as AIMessageChunk;
    const content = chunk_kwargs.content;
    const tool_calls = chunk_kwargs.tool_calls;
    const tool_call_chunks = chunk_kwargs.tool_call_chunks;

    if (tool_calls.length > 0) {
      const tool_name = tool_calls[0].name;
      const call_id = tool_calls[0].id;

      if (call_id) {
        output = `\n<ToolCall>${JSON.stringify({
          call_id,
          tool_name,
        })}</ToolCall>\n`;
      }
    } else {
      output = content ? content : "";
    }
  }

  if (chunk_type.includes("ToolMessage")) {
    const chunk_kwargs = chunk.kwargs as ToolMessage;
    const tool_name = chunk_kwargs.name;
    const call_id = chunk_kwargs.tool_call_id;
    const tool_output = chunk_kwargs.content;

    output = `\n<ToolFinish>${JSON.stringify({
      call_id,
      tool_name,
      tool_output,
    })}</ToolFinish>\n`;
  }

  return output;
};

export const handleChunkParts = (chunk: string) => {
  const parts = chunk.split("\n").filter(Boolean);
  let parsedParts: string[] = [];

  // Process each part
  for (const part of parts) {
    try {
      const partContent = JSON.parse(part)["part"];
      const chunkData = JSON.parse(partContent);
      const parsedChunk = parse_chunk(chunkData);
      parsedParts.push(parsedChunk);
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  }

  return parsedParts.join("");
};
