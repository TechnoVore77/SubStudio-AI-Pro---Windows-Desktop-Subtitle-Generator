export interface SampleVideo {
  id: string;
  title: string;
  category: string;
  duration: number; // in seconds
  src: string;
  thumbnailUrl: string;
  description: string;
  defaultSubtitles: {
    startMs: number;
    endMs: number;
    text: string;
    speaker: string;
  }[];
}

export const SAMPLE_VIDEOS: SampleVideo[] = [
  {
    id: "sample_tech_demo",
    title: "AI & Future of Computing Demo",
    category: "Tech Keynote",
    duration: 5,
    src: "/samples/demo.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
    description: "Product demonstration showcasing creative AI video subtitle generation.",
    defaultSubtitles: [
      { startMs: 300, endMs: 2400, text: "Welcome to next-generation AI subtitle generation.", speaker: "Presenter" },
      { startMs: 2500, endMs: 4800, text: "Accurate timestamps generated with millisecond precision.", speaker: "Presenter" },
    ]
  },
  {
    id: "sample_nature_doc",
    title: "Ocean Wildlife & Ecosystems",
    category: "Documentary",
    duration: 10,
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    description: "Narrated wildlife clip describing marine biodiversity.",
    defaultSubtitles: [
      { startMs: 600, endMs: 4200, text: "Beneath the surface lies a vibrant underwater world filled with marine life.", speaker: "Narrator" },
      { startMs: 4500, endMs: 8800, text: "Protecting coral reefs is essential to preserving the balance of coastal ecosystems.", speaker: "Narrator" },
    ]
  },
  {
    id: "sample_interview",
    title: "Podcast: Creative Workflow Tips",
    category: "Podcast / Talk",
    duration: 12,
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=600&q=80",
    description: "Dual-speaker podcast conversation discussing video editing techniques.",
    defaultSubtitles: [
      { startMs: 800, endMs: 3500, text: "What is your secret for editing videos twice as fast?", speaker: "Host" },
      { startMs: 3800, endMs: 7900, text: "Automating captions saves me hours of manual typing every single week.", speaker: "Guest" },
      { startMs: 8200, endMs: 11500, text: "That is why AI subtitle generators have become an essential PC desktop tool.", speaker: "Host" },
    ]
  },
  {
    id: "sample_tutorial",
    title: "Quick PC Video Editing Guide",
    category: "Tutorial",
    duration: 15,
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80",
    description: "Educational video tutorial demonstrating software navigation.",
    defaultSubtitles: [
      { startMs: 500, endMs: 4100, text: "Step one: Import your video file directly into the SubStudio editor canvas.", speaker: "Instructor" },
      { startMs: 4400, endMs: 8900, text: "Step two: Click 'Scan Video with Gemini AI' to generate precise timestamped captions.", speaker: "Instructor" },
      { startMs: 9200, endMs: 14200, text: "Step three: Fine-tune subtitle styling or click 'Export as SRT' for your video editor.", speaker: "Instructor" },
    ]
  }
];
