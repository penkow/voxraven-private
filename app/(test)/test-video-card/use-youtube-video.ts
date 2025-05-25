import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

type UseYoutubeVideoProps = {
  videoId: string;
};

export function useYoutubeVideo({ videoId }: UseYoutubeVideoProps) {
  const description = `Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.`;

  const summary = `Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.`;

  const commentsAnalysis = `Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.`;

  const painPoints = `Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.`;

  const targetAudience = `Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.`;

  const views = 123124;
  const likes = 775419;
  const commentsCount = 42424242;
  const transcript = predefined;

  return {
    description,
    summary,
    views,
    likes,
    commentsCount,
    commentsAnalysis,
    painPoints,
    targetAudience,
    transcript,
  };
}
const predefined = [
  {
    id: 1,
    speaker: "John",
    text: "Good morning everyone. Thank you for joining today's meeting about the new product launch.",
    startTime: 0,
    endTime: 5.2,
  },
  {
    id: 2,
    speaker: "Sarah",
    text: "Thanks John. I'd like to start by discussing our marketing strategy for the first quarter.",
    startTime: 5.3,
    endTime: 9.8,
  },
  {
    id: 3,
    speaker: "John",
    text: "That sounds great. We've been working on some new social media campaigns that I think will be very effective.",
    startTime: 10.0,
    endTime: 15.5,
  },
  {
    id: 4,
    speaker: "Michael",
    text: "I have some data from our previous campaigns that might be helpful. Can I share my screen?",
    startTime: 15.6,
    endTime: 19.2,
  },
  {
    id: 5,
    speaker: "Sarah",
    text: "Of course, go ahead Michael. I'm particularly interested in seeing how our last video campaign performed.",
    startTime: 19.3,
    endTime: 24.1,
  },
  {
    id: 6,
    speaker: "Michael",
    text: "As you can see from these numbers, our engagement rate increased by 45% when we focused on customer testimonials.",
    startTime: 24.2,
    endTime: 30.5,
  },
  {
    id: 7,
    speaker: "John",
    text: "That's impressive. I think we should definitely incorporate more testimonials in our upcoming launch.",
    startTime: 30.6,
    endTime: 35.0,
  },
  {
    id: 8,
    speaker: "Sarah",
    text: "I agree. Let's plan to collect some testimonials from our beta testers before the official launch date.",
    startTime: 35.1,
    endTime: 40.2,
  },
  {
    id: 9,
    speaker: "Michael",
    text: "I can coordinate with the product team to identify our most enthusiastic beta users for testimonials.",
    startTime: 40.3,
    endTime: 45.8,
  },
  {
    id: 10,
    speaker: "John",
    text: "Perfect. Let's reconvene next week to review the testimonials and finalize our marketing materials.",
    startTime: 45.9,
    endTime: 50.0,
  },
];
