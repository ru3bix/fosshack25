"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { BrainIcon, Clipboard, Check } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { useEffect, useRef, useState } from "react";
import { getAIResponse } from "@/lib/ai";
import { generateManimCode } from "@/lib/manim-generator";

type ChatItem = {
  user: { question: string };
  ai: { answer: string };
  isCode: boolean;
};

const AiButton = () => {
  const [chat, setChat] = useState<ChatItem[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const isUserScrolling = useRef(false);

  useEffect(() => {
    const storedChat = localStorage.getItem("ai-chat");
    if (storedChat) {
      setChat(JSON.parse(storedChat));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("ai-chat", JSON.stringify(chat));
  }, [chat]);

  useEffect(() => {
    const handleScroll = () => {
      if (chatRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = chatRef.current;
        isUserScrolling.current = scrollHeight - scrollTop > clientHeight + 50;
      }
    };

    chatRef.current?.addEventListener("scroll", handleScroll);
    return () => chatRef.current?.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatRef.current;
      const isNearBottom = scrollHeight - scrollTop <= clientHeight + 50;

      if (isNearBottom) {
        chatRef.current.scrollTo({ top: scrollHeight, behavior: "smooth" });
      }
    }
  }, [chat]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatItem = { user: { question: input }, ai: { answer: "" }, isCode: false };
    setChat((prevChat) => [...prevChat, userMessage]);
    setInput("");

    try {
      setIsTyping(true);
      const systemPrompt = `Only write manim (python library) code. if someone ask other thing tell them you're here only for manim animation codes. also when you write manim code use this format for your reference.also animate text which shows required info for the animations
      
      %%manim -qm CircleToSquare

      class CircleToSquare(Scene):
          def construct(self):
              blue_circle = Circle(color=BLUE, fill_opacity=0.5)
              green_square = Square(color=GREEN, fill_opacity=0.8)
              self.play(Create(blue_circle))
              self.wait()
              
              self.play(Transform(blue_circle, green_square))
              self.wait() 


      \n\nUser: ${input}`;
      const aiResponse = await getAIResponse(systemPrompt);
      const cleanedResponse = aiResponse.replace(/<\/?[a-z][^>]*>/g, "").trim();
      const extractedManimCode = generateManimCode(cleanedResponse);
      const finalResponse = extractedManimCode.startsWith("Error") ? cleanedResponse : extractedManimCode;
      const isCodeResponse = finalResponse.includes("\n");

      let i = 0;
      const typeOutResponse = () => {
        setChat((prevChat) => {
          const updatedChat = [...prevChat];
          updatedChat[updatedChat.length - 1].ai.answer = finalResponse.slice(0, i);
          updatedChat[updatedChat.length - 1].isCode = isCodeResponse;
          return updatedChat;
        });

        if (i < finalResponse.length) {
          i++;
          setTimeout(typeOutResponse, 25);
        } else {
          setIsTyping(false);
        }
      };

      typeOutResponse();
    } catch (error) {
      setChat((prevChat) => {
        const updatedChat = [...prevChat];
        updatedChat[updatedChat.length - 1].ai.answer = "Error getting AI response.";
        return updatedChat;
      });
      setIsTyping(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <Sheet>
      <SheetTrigger>
        <Button id="ai-btn" variant="ghost" size="sm" className="w-fit mt-1 py-1 text-xs text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-800">
          <BrainIcon size={15} className="mr-1" />
          Write with AI
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-gray-900 border-gray-800 text-white">
        <SheetHeader>
          <SheetTitle className="text-white flex items-center">
            <BrainIcon className="mr-2" /> Animate with AI
          </SheetTitle>
          <SheetDescription>
            This AI is specifically designed for Manim animations.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col w-full h-full justify-end pb-20 relative">
          <div ref={chatRef} className="h-full w-full flex flex-col space-y-4 overflow-auto">
            {chat.map((v, index) => (
              <div key={index} className="flex flex-col w-full">
                <div className="self-end px-4 py-2 bg-gray-700 rounded-lg">{v.user.question}</div>
                {v.isCode ? (
                  <div className="relative self-start w-full bg-gray-800 rounded-lg p-4 mt-2">
                    <pre className="overflow-x-auto text-sm text-gray-300 whitespace-pre-wrap">{v.ai.answer}</pre>
                    <Button
                      onClick={() => copyToClipboard(v.ai.answer, index)}
                      size="sm"
                      className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 p-1"
                    >
                      {copiedIndex === index ? <Check size={16} /> : <Clipboard size={16} />}
                    </Button>
                  </div>
                ) : (
                  <div className="self-start px-4 py-2 bg-gray-800 rounded-lg whitespace-pre-wrap mt-2">{v.ai.answer}</div>
                )}
              </div>
            ))}
          </div>

          <div className="flex mt-4 space-x-2">
            <Textarea
              placeholder="Ask AI"
              className="bg-gray-800 border-gray-700 placeholder:text-gray-400 flex-1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && !isTyping) { e.preventDefault(); handleSendMessage(); } }}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AiButton;