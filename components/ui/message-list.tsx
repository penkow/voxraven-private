import {
  ChatMessage,
  type ChatMessageProps,
  type Message,
} from "@/components/ui/chat-message";
import { TypingIndicator } from "@/components/ui/typing-indicator";
import { LoadingAnimation } from "./LoadingAnumation";
import { Dot } from "lucide-react";

type AdditionalMessageOptions = Omit<ChatMessageProps, keyof Message>;

interface MessageListProps {
  messages: Message[];
  showTimeStamps?: boolean;
  isTyping?: boolean;
  messageOptions?:
    | AdditionalMessageOptions
    | ((message: Message) => AdditionalMessageOptions);
  toolViewCallback?: (toolOutput: string) => void;
  isLoading?: boolean;
}

export function MessageList({
  messages,
  showTimeStamps = true,
  isTyping = false,
  messageOptions,
  toolViewCallback,
  isLoading = false,
}: MessageListProps) {
  return (
    <div className="space-y-4 overflow-visible">
      {messages.map((message, index) => {
        const additionalOptions =
          typeof messageOptions === "function"
            ? messageOptions(message)
            : messageOptions;

        return (
          <ChatMessage
            key={index}
            showTimeStamp={showTimeStamps}
            toolViewCallback={toolViewCallback}
            {...message}
            {...additionalOptions}
          />
        );
      })}
      {isLoading && <TypingIndicator />}
      {/* {isTyping && <TypingIndicator />} */}
    </div>
  );
}
