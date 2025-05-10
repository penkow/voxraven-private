"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Play,
  Pause,
  RotateCcw,
  Type,
  Save,
  Upload,
  FlipVerticalIcon as Flip,
  Mic,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { toast } from "sonner";

// Define a type for the SpeechRecognition API
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

// Define a global for the SpeechRecognition constructor
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export default function Teleprompter() {
  const [text, setText] = useState<string>(
    "Enter your script here...\n\nThis is a teleprompter application that allows you to scroll text at a controlled speed. It's perfect for recording videos, practicing speeches, or delivering presentations.\n\nYou can adjust the scroll speed, font size, and even mirror the text if needed.\n\nClick the play button to start scrolling."
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(2);
  const [fontSize, setFontSize] = useState<number>(32);
  const [isMirrored, setIsMirrored] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [voiceActivated, setVoiceActivated] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);

  const prompterRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check if speech recognition is supported
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
    }
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if (!speechSupported) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();

    if (recognitionRef.current) {
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        if (!voiceActivated || !isPlaying) return;

        const words = text.split(/\s+/);
        const currentWord = words[currentWordIndex]
          ?.toLowerCase()
          .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");

        if (!currentWord) return;

        const transcript = event.results[event.results.length - 1][0].transcript
          .trim()
          .toLowerCase();
        const spokenWords = transcript.split(/\s+/);

        // Log speech recognition results
        console.log("Speech recognized:", transcript);
        console.log("Words detected:", spokenWords);
        console.log("Current word:", currentWord);
        console.log(
          "Is match:",
          spokenWords.some(
            (word: any) =>
              word ===
              currentWord.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
          )
        );

        // Check if any of the spoken words match the current word
        if (spokenWords.some((word: any) => word === currentWord)) {
          console.log("✅ Match found! Advancing to next word");
          // Advance to next word
          setCurrentWordIndex((prevIndex) => {
            if (prevIndex < words.length - 1) {
              const newIndex = prevIndex + 1;
              // Update progress
              const progress = (newIndex / (words.length - 1)) * 100;
              setProgress(progress);
              return newIndex;
            } else {
              // End of text
              setIsPlaying(false);
              return prevIndex;
            }
          });
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.log("Speech recognition error", event);
        if (voiceActivated) {
          toast.error(
            "There was an issue with voice recognition. Please try again."
          );
        }
      };

      recognitionRef.current.onend = () => {
        // Restart if still active
        if (voiceActivated && isPlaying && recognitionRef.current) {
          recognitionRef.current.start();
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [
    speechSupported,
    voiceActivated,
    isPlaying,
    currentWordIndex,
    text,
    toast,
  ]);

  // Handle voice activation toggle
  useEffect(() => {
    if (!speechSupported) return;

    if (voiceActivated && isPlaying) {
      // Start speech recognition
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          toast.info("Speak the highlighted word to advance to the next one.");
        } catch (error) {
          console.error("Error starting speech recognition:", error);
        }
      }

      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } else if (!voiceActivated && isPlaying) {
      // Stop speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      // Start interval-based advancement
      startIntervalAdvancement();
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error("Error stopping speech recognition:", error);
        }
      }
    };
  }, [voiceActivated, isPlaying, speechSupported, toast]);

  // Split text into words and handle word-by-word highlighting with interval
  useEffect(() => {
    if (!isPlaying || voiceActivated) return;

    startIntervalAdvancement();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, speed, text, voiceActivated]);

  const startIntervalAdvancement = () => {
    const words = text.split(/\s+/);

    // Calculate delay based on speed (faster speed = shorter delay)
    // Speed range is 0.5-10, so we convert it to a delay between 1000ms (slow) and 50ms (fast)
    const getDelay = () => Math.max(50, 1000 - speed * 95);

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setCurrentWordIndex((prevIndex) => {
        if (prevIndex < words.length - 1) {
          const newIndex = prevIndex + 1;
          // Update progress
          const progress = (newIndex / (words.length - 1)) * 100;
          setProgress(progress);
          return newIndex;
        } else {
          // End of text
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setIsPlaying(false);
          return prevIndex;
        }
      });
    }, getDelay());
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const resetScroll = () => {
    setCurrentWordIndex(0);
    setProgress(0);
    setIsPlaying(false);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error("Error stopping speech recognition:", error);
      }
    }
  };

  const handleSpeedChange = (value: number[]) => {
    setSpeed(value[0]);
  };

  const handleFontSizeChange = (value: number[]) => {
    setFontSize(value[0]);
  };

  const saveScript = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "teleprompter-script.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadScript = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setText(event.target.result as string);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="border-b p-4">
        <h1 className="text-2xl font-bold text-center">Teleprompter</h1>
      </header>

      <main className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Editor Panel */}
        <div className="w-full md:w-1/3 p-4 border-r overflow-auto">
          <div className="space-y-4">
            <div>
              <Label htmlFor="script">Script</Label>
              <Textarea
                id="script"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="h-64 font-mono"
                placeholder="Enter your script here..."
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={saveScript} variant="outline" size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <div className="relative">
                <Button variant="outline" size="sm" className="relative">
                  <Upload className="w-4 h-4 mr-2" />
                  Load
                  <Input
                    type="file"
                    accept=".txt"
                    onChange={loadScript}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="speed">Speed</Label>
                <span className="text-sm text-muted-foreground">
                  {speed.toFixed(1)}
                </span>
              </div>
              <Slider
                id="speed"
                value={[speed]}
                onValueChange={handleSpeedChange}
                min={0.5}
                max={10}
                step={0.1}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="fontSize">Font Size</Label>
                <span className="text-sm text-muted-foreground">
                  {fontSize}px
                </span>
              </div>
              <Slider
                id="fontSize"
                value={[fontSize]}
                onValueChange={handleFontSizeChange}
                min={16}
                max={72}
                step={1}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="mirror"
                checked={isMirrored}
                onCheckedChange={setIsMirrored}
              />
              <Label htmlFor="mirror" className="flex items-center">
                <Flip className="w-4 h-4 mr-2" />
                Mirror Text
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="voice"
                checked={voiceActivated}
                onCheckedChange={setVoiceActivated}
                disabled={!speechSupported}
              />
              <Label htmlFor="voice" className="flex items-center">
                <Mic className="w-4 h-4 mr-2" />
                Voice Activation
              </Label>
            </div>

            {!speechSupported && (
              <Alert variant="destructive" className="mt-2">
                <AlertTitle>Voice activation not supported</AlertTitle>
                <AlertDescription>
                  Your browser doesn't support the Speech Recognition API needed
                  for voice activation.
                </AlertDescription>
              </Alert>
            )}

            {voiceActivated && (
              <Alert className="mt-2">
                <AlertTitle>Voice Activation Enabled</AlertTitle>
                <AlertDescription>
                  Speak the highlighted word to advance to the next one. Make
                  sure your microphone is enabled.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        {/* Teleprompter Display */}
        <div className="flex-1 flex flex-col" ref={containerRef}>
          {/* Controls */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex gap-2">
              <Button onClick={togglePlay} variant="outline" size="icon">
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              <Button onClick={resetScroll} variant="outline" size="icon">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>

            <div className="w-full max-w-xs mx-4 bg-muted rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div className="flex items-center">
              <Type className="h-4 w-4 mr-2" />
              <span className="text-sm">{fontSize}px</span>
            </div>
          </div>

          {/* Teleprompter Text */}
          <div
            ref={prompterRef}
            className="flex-1 overflow-y-auto p-8 bg-black"
          >
            <div
              className={`mx-auto max-w-3xl text-center ${
                isMirrored ? "scale-x-[-1]" : ""
              }`}
              style={{
                fontSize: `${fontSize}px`,
                lineHeight: 1.5,
              }}
            >
              {text.split(/\s+/).map((word, index) => (
                <span
                  key={index}
                  className={`inline-block mx-1 ${
                    index === currentWordIndex ? "text-white" : "text-gray-500"
                  }`}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
