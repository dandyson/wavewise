import { PrismaClient, Difficulty, TideType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const start = new Date();
  console.log("Seeding surf spots...");
  
  // Create surf spots
  const spots = await Promise.all([
    prisma.surfSpot.create({
      data: {
        name: "Pipeline",
        location: "North Shore, Oahu",
        latitude: 21.6655,
        longitude: -158.0522,
        description: "World-famous wave known for its perfect barrels and dangerous reef break.",
        bestTide: "Mid to high tide",
        bestWind: "Offshore winds from the east",
        difficulty: Difficulty.ADVANCED,
        imageUrl: "https://example.com/pipeline.jpg",
      },
    }),
    prisma.surfSpot.create({
      data: {
        name: "Waikiki Beach",
        location: "Honolulu, Oahu",
        latitude: 21.2767,
        longitude: -157.8367,
        description: "Gentle waves perfect for beginners, with consistent surf year-round.",
        bestTide: "Any tide",
        bestWind: "Light winds",
        difficulty: Difficulty.BEGINNER,
        imageUrl: "https://example.com/waikiki.jpg",
      },
    }),
    prisma.surfSpot.create({
      data: {
        name: "Jaws",
        location: "Maui, Hawaii",
        latitude: 20.9333,
        longitude: -156.3333,
        description: "Famous big wave spot that can reach heights of 60+ feet.",
        bestTide: "Low to mid tide",
        bestWind: "Offshore winds from the north",
        difficulty: Difficulty.ADVANCED,
        imageUrl: "https://example.com/jaws.jpg",
      },
    }),
  ]);

  // Create conditions for each spot
  for (const spot of spots) {
    await prisma.condition.create({
      data: {
        spotId: spot.id,
        timestamp: new Date(),
        waveHeight: 3.5,
        swellPeriod: 12,
        swellDirection: "NW",
        windSpeed: 8,
        windDirection: "E",
        tideHeight: 2.1,
        tideType: TideType.MID,
        surfScore: 75,
      },
    });

    // Create historical conditions (24 hours ago)
    await prisma.condition.create({
      data: {
        spotId: spot.id,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        waveHeight: 4.0,
        swellPeriod: 14,
        swellDirection: "NW",
        windSpeed: 10,
        windDirection: "NE",
        tideHeight: 1.8,
        tideType: TideType.LOW,
        surfScore: 85,
      },
    });
  }
  
  const end = new Date();
  console.log(`Seeding completed: ${end.getTime() - start.getTime()}ms`);
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