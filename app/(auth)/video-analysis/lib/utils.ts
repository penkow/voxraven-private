export function extractVideoId(youtubeUrl: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = youtubeUrl.match(regex);
  return match ? match[1] : null;
}

export function getYoutubeThumbnail(youtubeUrl: string): string {
  const videoId = extractVideoId(youtubeUrl);
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

export function generateMockVideos() {
  const mockVideos = [
    {
      id: "1",
      title: "Complete Guide to Modern Web Development 2024",
      videoUrl: "https://youtube.com/watch?v=dQw4w9WgXcQ",
      description: "Learn everything you need to know about modern web development, including React, Next.js, TypeScript, and more.",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      viewerNeeds: [
        {
          need: "Better explanation of TypeScript generics",
          quotes: ["Could you explain generics more clearly?", "The TypeScript section was too fast"]
        },
        {
          need: "More real-world examples",
          quotes: ["Would love to see more practical examples", "Theory is good but need more real cases"]
        }
      ]
    },
    {
      id: "2",
      title: "AI and Machine Learning Fundamentals",
      videoUrl: "https://youtube.com/watch?v=ABC123xyz",
      description: "A comprehensive introduction to AI and machine learning concepts, perfect for beginners.",
      thumbnail: "https://img.youtube.com/vi/ABC123xyz/maxresdefault.jpg",
      viewerNeeds: [
        {
          need: "Simpler math explanations",
          quotes: ["The math was too advanced", "Need more basic explanations"]
        }
      ]
    },
    {
      id: "3",
      title: "Building Scalable Systems Architecture",
      videoUrl: "https://youtube.com/watch?v=XYZ789abc",
      description: "Learn how to design and build scalable systems that can handle millions of users.",
      thumbnail: "https://img.youtube.com/vi/XYZ789abc/maxresdefault.jpg",
      viewerNeeds: []
    },
    {
      id: "4",
      title: "DevOps Best Practices 2024",
      videoUrl: "https://youtube.com/watch?v=DEF456uvw",
      description: "Master DevOps practices including CI/CD, containerization, and cloud deployment.",
      thumbnail: "https://img.youtube.com/vi/DEF456uvw/maxresdefault.jpg",
      viewerNeeds: [
        {
          need: "More Kubernetes examples",
          quotes: ["Need more K8s practical examples", "Could you show more real cluster setups?"]
        }
      ]
    },
    {
      id: "5",
      title: "Mobile App Development with React Native",
      videoUrl: "https://youtube.com/watch?v=GHI789jkl",
      description: "Build cross-platform mobile apps using React Native and TypeScript.",
      thumbnail: "https://img.youtube.com/vi/GHI789jkl/maxresdefault.jpg",
      viewerNeeds: []
    },
    {
      id: "6",
      title: "Data Science for Beginners",
      videoUrl: "https://youtube.com/watch?v=MNO456pqr",
      description: "Start your journey in data science with Python, pandas, and numpy.",
      thumbnail: "https://img.youtube.com/vi/MNO456pqr/maxresdefault.jpg",
      viewerNeeds: [
        {
          need: "More visualization examples",
          quotes: ["Could use more matplotlib tutorials", "Need more plotting examples"]
        }
      ]
    },
    {
      id: "7",
      title: "Cybersecurity Essentials",
      videoUrl: "https://youtube.com/watch?v=STU789vwx",
      description: "Learn fundamental cybersecurity concepts and best practices.",
      thumbnail: "https://img.youtube.com/vi/STU789vwx/maxresdefault.jpg",
      viewerNeeds: []
    },
    {
      id: "8",
      title: "Cloud Computing with AWS",
      videoUrl: "https://youtube.com/watch?v=YZA123bcd",
      description: "Master AWS services and cloud architecture patterns.",
      thumbnail: "https://img.youtube.com/vi/YZA123bcd/maxresdefault.jpg",
      viewerNeeds: [
        {
          need: "Cost optimization tips",
          quotes: ["Need more info about saving money on AWS", "Could you explain AWS pricing better?"]
        }
      ]
    },
    {
      id: "9",
      title: "Blockchain Development Tutorial",
      videoUrl: "https://youtube.com/watch?v=BCD789efg",
      description: "Build decentralized applications with Ethereum and Solidity.",
      thumbnail: "https://img.youtube.com/vi/BCD789efg/maxresdefault.jpg",
      viewerNeeds: []
    },
    {
      id: "10",
      title: "UI/UX Design Principles",
      videoUrl: "https://youtube.com/watch?v=EFG123hij",
      description: "Learn modern UI/UX design principles and tools.",
      thumbnail: "https://img.youtube.com/vi/EFG123hij/maxresdefault.jpg",
      viewerNeeds: [
        {
          need: "More Figma tutorials",
          quotes: ["Would love to see more Figma examples", "Need more practical design exercises"]
        }
      ]
    }
  ];

  return mockVideos;
}

