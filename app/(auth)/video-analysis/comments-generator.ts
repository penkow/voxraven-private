// Helper function to generate more realistic comments for viewer needs
export function generateCommentsForNeed(
  need: string,
  topic: string
): {
  text: string;
  author: string;
  likes: number;
}[] {
  const commentTemplates = [
    `I wish they explained {need} better. Would have saved me hours of frustration.`,
    `Does anyone know where I can find more info about {need}? The video barely touched on it.`,
    `The section on {need} was too brief. I need more details!`,
    `Great video but missing {need}. That would make it perfect.`,
    `As a beginner with {topic}, I really needed more on {need}.`,
    `Can you recommend any resources specifically for {need} related to {topic}?`,
    `The comments section is full of questions about {need}. Maybe do a follow-up video?`,
    `I've watched 10+ videos on {topic} and none properly cover {need}.`,
    `{need} is exactly what I was looking for but it wasn't covered in depth.`,
    `Please make a dedicated video just about {need} for {topic}!`,
  ];

  const usernames = [
    "TechExplorer",
    "CodeMaster",
    "DigitalNomad",
    "LearnDaily",
    "CuriousMind",
    "DevJourney",
    "FutureBuilder",
    "KnowledgeSeeker",
    "CreativeSoul",
    "InspiredLearner",
    "TutorialFan",
    "ProblemSolver",
  ];

  // Generate 2-4 random comments
  const commentCount = 2 + Math.floor(Math.random() * 3);

  return Array.from({ length: commentCount }, (_, i) => {
    const template =
      commentTemplates[Math.floor(Math.random() * commentTemplates.length)];
    const simplifiedNeed = need
      .toLowerCase()
      .replace(`${topic} `, "")
      .replace(/\.$/, "");

    return {
      text: template
        .replace("{need}", simplifiedNeed)
        .replace("{topic}", topic),
      author: `${
        usernames[Math.floor(Math.random() * usernames.length)]
      }${Math.floor(Math.random() * 1000)}`,
      likes: Math.floor(Math.random() * 100) + 1,
    };
  });
}

export type VideoResult = {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  videoUrl: string;
  viewerNeeds: {
    need: string;
    quote: string[];
  }[];
};


export const generateResults = async (topic: string) => {
  // Make a post request to http://localhost:5678/webhook/1678f755-1999-44f9-918f-e33728648565
  console.log("Generating results for topic:", topic);
  const response = await fetch(
    "http://n8n.selfhost.penkow.com/webhook/1678f755-1999-44f9-918f-e33728648565",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: topic }),
    }
  );
  const data = await response.json();
  return data;
};
