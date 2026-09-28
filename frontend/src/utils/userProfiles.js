/**
 * Real Human User Personas for MovieLens RL Recommendation Platform.
 * Maps user IDs to authentic names, roles, favorite genres, avatars, and bios.
 */

export const REAL_USERS = [
  {
    user_id: 1,
    name: "Tharun Devanboina",
    shortName: "Tharun",
    role: "Lead ML Researcher",
    favoriteGenre: "Action & Sci-Fi",
    avatarBg: "bg-blue-600",
    initials: "TD",
    bio: "Passionate about Reinforcement Learning, multi-step sequential decision processes, and cinematic sci-fi franchises."
  },
  {
    user_id: 2,
    name: "Alex Morgan",
    shortName: "Alex",
    role: "Film Critic & Cinephile",
    favoriteGenre: "Drama & Classic Cinema",
    avatarBg: "bg-purple-600",
    initials: "AM",
    bio: "Focuses on deep narrative complexity, classic masterpieces from the 70s-90s, and high-engagement character studies."
  },
  {
    user_id: 3,
    name: "Sarah Connor",
    shortName: "Sarah",
    role: "Sci-Fi Enthusiast",
    favoriteGenre: "Action & Thriller",
    avatarBg: "bg-emerald-600",
    initials: "SC",
    bio: "Loves cyberpunk thrillers, fast-paced action sequences, and dystopian technological themes."
  },
  {
    user_id: 4,
    name: "David Miller",
    shortName: "David",
    role: "Data Systems Architect",
    favoriteGenre: "Crime & Film-Noir",
    avatarBg: "bg-amber-600",
    initials: "DM",
    bio: "Drawn to psychological mysteries, neo-noir detective narratives, and suspenseful plot twists."
  },
  {
    user_id: 5,
    name: "Elena Rostova",
    shortName: "Elena",
    role: "Visual Arts Designer",
    favoriteGenre: "Animation & Fantasy",
    avatarBg: "bg-rose-600",
    initials: "ER",
    bio: "Appreciates stunning visual cinematography, high-fantasy world-building, and animated storytelling."
  },
  {
    user_id: 6,
    name: "Marcus Chen",
    shortName: "Marcus",
    role: "AI Ethics Reviewer",
    favoriteGenre: "Adventure & Documentary",
    avatarBg: "bg-cyan-600",
    initials: "MC",
    bio: "Explores wide genre diversity to evaluate exploration entropy and fairness in neural recommender policies."
  },
  {
    user_id: 7,
    name: "Priya Sharma",
    shortName: "Priya",
    role: "Cognitive Scientist",
    favoriteGenre: "Drama & Romance",
    avatarBg: "bg-indigo-600",
    initials: "PS",
    bio: "Studies long-term user satiation curves, cognitive fatigue, and dynamic satisfaction modeling."
  },
  {
    user_id: 8,
    name: "Sophia Taylor",
    shortName: "Sophia",
    role: "Product Strategist",
    favoriteGenre: "Comedy & Animation",
    avatarBg: "bg-teal-600",
    initials: "ST",
    bio: "Interested in high-retention discovery workflows, upbeat humor, and family-friendly cinematic experiences."
  },
  {
    user_id: 9,
    name: "James Wilson",
    shortName: "James",
    role: "Senior Algorithmic Trader",
    favoriteGenre: "Thriller & Mystery",
    avatarBg: "bg-violet-600",
    initials: "JW",
    bio: "Enjoys high-stakes psychological thrillers and complex nonlinear storytelling."
  },
  {
    user_id: 10,
    name: "Emily Watson",
    shortName: "Emily",
    role: "Biomedical Researcher",
    favoriteGenre: "Documentary & Biography",
    avatarBg: "bg-fuchsia-600",
    initials: "EW",
    bio: "Passionate about scientific discoveries, historical documentaries, and thought-provoking cinema."
  },
  {
    user_id: 11,
    name: "Michael Scott",
    shortName: "Michael",
    role: "Creative Director",
    favoriteGenre: "Comedy & Romance",
    avatarBg: "bg-orange-600",
    initials: "MS",
    bio: "Loves classic sitcom energy, feel-good romantic comedies, and witty screenplays."
  },
  {
    user_id: 12,
    name: "Rachel Green",
    shortName: "Rachel",
    role: "Fashion & Media Stylist",
    favoriteGenre: "Drama & Romance",
    avatarBg: "bg-pink-600",
    initials: "RG",
    bio: "Drawn to stylish period dramas, romantic escapism, and acclaimed independent cinema."
  },
  {
    user_id: 13,
    name: "Liam Neeson",
    shortName: "Liam",
    role: "Action Cinema Producer",
    favoriteGenre: "Action & Crime",
    avatarBg: "bg-slate-700",
    initials: "LN",
    bio: "Dedicated fan of high-octane suspense, investigative crime, and blockbuster franchises."
  },
  {
    user_id: 14,
    name: "Daniel Craig",
    shortName: "Daniel",
    role: "Espionage Fiction Author",
    favoriteGenre: "Thriller & Action",
    avatarBg: "bg-blue-800",
    initials: "DC",
    bio: "Analyzes international espionage thrillers, intricate heist movies, and covert operations narratives."
  },
  {
    user_id: 15,
    name: "Olivia Wilde",
    shortName: "Olivia",
    role: "Indie Film Director",
    favoriteGenre: "Sci-Fi & Drama",
    avatarBg: "bg-emerald-700",
    initials: "OW",
    bio: "Explores visionary psychological sci-fi concepts, existential cinema, and auteur visual styles."
  },
  {
    user_id: 16,
    name: "Lucas Silva",
    shortName: "Lucas",
    role: "Gaming & VFX Artist",
    favoriteGenre: "Animation & Adventure",
    avatarBg: "bg-red-600",
    initials: "LS",
    bio: "Enthusiast for ground-breaking CGI, animated epics, and video game inspired visual effects."
  }
];

export function getUserProfile(userId) {
  const numId = Number(userId);
  const found = REAL_USERS.find(u => u.user_id === numId);
  if (found) return found;

  // Generate a realistic fallback for any user ID
  const names = [
    "James Wilson", "Emily Watson", "Michael Scott", "Rachel Green", 
    "Liam Neeson", "Daniel Craig", "Olivia Wilde", "Lucas Silva",
    "Emma Johnson", "Noah Williams", "Ava Brown", "Ethan Davis"
  ];
  const name = names[(numId - 1) % names.length] || `User ${numId}`;
  const parts = name.split(' ');
  const initials = parts.map(p => p[0]).join('');

  return {
    user_id: numId,
    name: name,
    shortName: parts[0],
    role: "Registered Viewer",
    favoriteGenre: "Diverse Cinema",
    avatarBg: "bg-blue-600",
    initials: initials || "U",
    bio: `Active MovieLens participant with personalized dynamic taste profile and sequential interaction history.`
  };
}
