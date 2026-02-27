import { prisma } from "@/lib/prisma";

async function main() {
  const categories = [
    {
      name: "Pixel Art",
      slug: "pixel-art",
      icon: "Image",
      color: "#8B5CF6",
      description: "Klasyczne pikselowe grafiki i retro",
      order: 10,
    },
    {
      name: "Krajobrazy",
      slug: "krajobrazy",
      icon: "Mountain",
      color: "#10B981",
      description: "Góry, lasy, pola, morza i zachody słońca",
      order: 20,
    },
    {
      name: "Abstrakcja",
      slug: "abstrakcja",
      icon: "Brush",
      color: "#EC4899",
      description: "Kolory, kształty, emocje bez konkretów",
      order: 30,
    },
    {
      name: "Postacie",
      slug: "postacie",
      icon: "User",
      color: "#F59E0B",
      description: "Ludzie, postacie, portrety, avatary",
      order: 40,
    },
    {
      name: "Retro / Vaporwave",
      slug: "retro-vaporwave",
      icon: "Clock",
      color: "#60A5FA",
      description: "Estetyka lat 80/90, glitch, neon",
      order: 50,
    },
    {
      name: "Natura / Zwierzęta",
      slug: "natura-zwierzeta",
      icon: "PawPrint",
      color: "#4ADE80",
      description: "Zwierzęta, rośliny, makro, wildlife",
      order: 60,
    },
    {
      name: "Cyberpunk / Sci-Fi",
      slug: "cyberpunk-sci-fi",
      icon: "CircuitBoard",
      color: "#EF4444",
      description: "Neonowe miasta, roboty, dystopie",
      order: 70,
    },
    {
      name: "Minimalizm",
      slug: "minimalizm",
      icon: "Square",
      color: "#6B7280",
      description: "Proste formy, dużo przestrzeni, flat",
      order: 80,
    },
    {
      name: "Fantasy / Magia",
      slug: "fantasy",
      icon: "Wand2",
      color: "#A78BFA",
      description: "Smoki, zamki, magia, RPG, ilustracje",
      order: 90,
    },
    {
      name: "Memy / Humor",
      slug: "memy-humor",
      icon: "Laugh",
      color: "#FBBF24",
      description: "Zabawne piksele, żarty, ironiczne grafiki",
      order: 100,
    },
  ];

  console.log("Rozpoczynam upsert kategorii...");

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug! },
      update: cat,
      create: cat,
    });
    console.log(`→ ${cat.name} (${cat.slug})`);
  }

  console.log("\nGotowe! Dodano / zaktualizowano wszystkie kategorie.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
