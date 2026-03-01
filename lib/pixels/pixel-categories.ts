export type Category = {
  id: number;
  name: string;
  slug: string | null;
  icon: string | null;
  color: string | null;
};

export const STATIC_CATEGORIES: Category[] = [
  {
    id: 1,
    name: "Pixel Art",
    slug: "pixel-art",
    icon: "Image",
    color: "#8B5CF6",
  },
  {
    id: 2,
    name: "Krajobrazy",
    slug: "krajobrazy",
    icon: "Mountain",
    color: "#10B981",
  },
  {
    id: 3,
    name: "Abstrakcja",
    slug: "abstrakcja",
    icon: "Brush",
    color: "#EC4899",
  },
  { id: 4, name: "Postacie", slug: "postacie", icon: "User", color: "#F59E0B" },
  {
    id: 5,
    name: "Retro / Vaporwave",
    slug: "retro-vaporwave",
    icon: "Clock",
    color: "#60A5FA",
  },
  {
    id: 6,
    name: "Natura / Zwierzęta",
    slug: "natura-zwierzeta",
    icon: "PawPrint",
    color: "#4ADE80",
  },
  {
    id: 7,
    name: "Cyberpunk / Sci-Fi",
    slug: "cyberpunk-sci-fi",
    icon: "CircuitBoard",
    color: "#EF4444",
  },
  {
    id: 8,
    name: "Minimalizm",
    slug: "minimalizm",
    icon: "Square",
    color: "#6B7280",
  },
  {
    id: 9,
    name: "Fantasy / Magia",
    slug: "fantasy",
    icon: "Wand2",
    color: "#A78BFA",
  },
  {
    id: 10,
    name: "Memy / Humor",
    slug: "memy-humor",
    icon: "Laugh",
    color: "#FBBF24",
  },
];
