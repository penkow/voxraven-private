// "use client";

// import type React from "react";

// import { useState, useRef, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { MessageCircle, X, Send } from "lucide-react";
// import MarkdownRenderer from "@/components/ui/markdown-renderer";

// interface Message {
//   id: number;
//   text: string;
//   isUser: boolean;
// }


// export default function ChatWidget({
//   isOpen,
//   onClose,
//   currentChatVideo,
// }: ChatWidgetProps) {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [inputValue, setInputValue] = useState("");
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   const askVideo = async (question: string) => {
//     const response = await fetch(`http://localhost:3000/askVideo`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         question: question,
//         videoUrl: currentChatVideo?.url,
//       }),
//     });
//     const data = await response.json();
//     return data;
//   };

//   // Auto-scroll to bottom when messages change
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   useEffect(() => {
//     if (currentChatVideo) {
//       setMessages([
//         {
//           id: 1,
//           text: "You are chatting with the video: " + currentChatVideo?.title,
//           isUser: false,
//         },
//       ]);
//     }
//   }, [currentChatVideo]);

//   const handleSendMessage = async () => {
//     if (inputValue.trim() === "") return;

//     // Add user message
//     const newMessage: Message = {
//       id: messages.length + 1,
//       text: inputValue,
//       isUser: true,
//     };
//     setMessages([...messages, newMessage]);
//     setInputValue("");

//     const response = await askVideo(inputValue);
//     console.log(response);
//     const responseMessage: Message = {
//       id: messages.length + 2,
//       text: response.answer,
//       isUser: false,
//     };
//     setMessages((prev) => [...prev, responseMessage]);

//     // // Simulate response after a short delay
//     // setTimeout(() => {
//     //   const responseMessage: Message = {
//     //     id: messages.length + 2,
//     //     text: `Thanks for your message: "${inputValue}"`,
//     //     isUser: false,
//     //   };
//     //   setMessages((prev) => [...prev, responseMessage]);
//     // }, 1000);
//   };

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter") {
//       handleSendMessage();
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <Card className="fixed bottom-4 right-4 w-[400px]  h-[600px] shadow-lg z-50 flex flex-col animate-in slide-in-from-bottom-10 duration-300">
//       <CardHeader className="p-3 border-b flex flex-row items-center justify-between space-y-0">
//         <div className="flex items-center gap-2">
//           <MessageCircle className="h-5 w-5 text-primary" />
//           <CardTitle className="text-lg">Chat</CardTitle>
//         </div>
//         <Button
//           variant="ghost"
//           size="icon"
//           onClick={onClose}
//           className="h-8 w-8"
//         >
//           <X className="h-4 w-4" />
//         </Button>
//       </CardHeader>
//       <CardContent className="flex-1 overflow-y-auto p-3 space-y-4">
//         {messages.map((message) => (
//           <div
//             key={message.id}
//             className={`flex ${
//               message.isUser ? "justify-end" : "justify-start"
//             }`}
//           >
//             <div
//               className={`max-w-[80%] rounded-lg px-3 py-2 ${
//                 message.isUser
//                   ? "bg-primary text-primary-foreground"
//                   : "bg-muted"
//               }`}
//             >
//               <MarkdownRenderer>{message.text}</MarkdownRenderer>
//             </div>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </CardContent>
//       <CardFooter className="p-3 pt-0">
//         <div className="flex w-full gap-2">
//           <Input
//             placeholder="Type your message..."
//             value={inputValue}
//             onChange={(e) => setInputValue(e.target.value)}
//             onKeyDown={handleKeyDown}
//             className="flex-1"
//           />
//           <Button
//             size="icon"
//             onClick={handleSendMessage}
//             disabled={!inputValue.trim()}
//           >
//             <Send className="h-4 w-4" />
//           </Button>
//         </div>
//       </CardFooter>
//     </Card>
//   );
// }
