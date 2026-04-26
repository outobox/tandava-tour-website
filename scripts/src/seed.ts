import {
  db,
  packagesTable,
  vehiclesTable,
  galleryImagesTable,
  reviewsTable,
  settingsTable,
  instagramPostsTable,
} from "@workspace/db";

async function seed() {
  console.log("Seeding Tandava Tour Company database...");

  // Settings (single row)
  const [existingSettings] = await db.select().from(settingsTable).limit(1);
  if (!existingSettings) {
    await db.insert(settingsTable).values({
      companyName: "TANDAVA TOUR COMPANY",
      tagline: "Pack Your Bags, We'll Do the Rest!",
      phonePrimary: "+91 7012393250",
      phoneSecondary: "+91 9526041005",
      whatsappNumber: "917012393250",
      email: "tandavatours@gmail.com",
      location: "Thiruvananthapuram, Kerala",
      instagramUrl: "https://www.instagram.com/tandava_tour_company/",
      facebookUrl: "",
      youtubeUrl: "",
      aboutText:
        "Tandava Tour Company is Kerala's premier travel and transportation partner — proudly headquartered in Thiruvananthapuram. Inspired by the cosmic dance of Shiva, we design unforgettable journeys through God's Own Country: backwaters, hill stations, beaches, temples and wildlife. Our fleet is meticulously maintained, our drivers are seasoned locals, and every itinerary is custom-crafted around your family. Pack your bags. We'll do the rest.",
    });
    console.log("  ✓ Settings created");
  } else {
    console.log("  · Settings already exist");
  }

  // Packages
  const [pkgCountRow] = await db.select().from(packagesTable).limit(1);
  if (!pkgCountRow) {
    await db.insert(packagesTable).values([
      {
        title: "Backwater Bliss — Alleppey Houseboat Escape",
        destination: "Alleppey (Alappuzha)",
        duration: "2 Days / 1 Night",
        startingPrice: 12500,
        description:
          "Drift through the emerald backwaters of Kerala on a private deluxe houseboat. Wake up to misty palm-fringed canals, dine on freshly-caught karimeen and watch the sun melt into the lagoon — a journey that has earned Alleppey the title of the Venice of the East.",
        includedServices: [
          "Private deluxe houseboat",
          "All meals onboard",
          "Welcome drinks & snacks",
          "Pickup & drop from Cochin",
          "Experienced crew",
        ],
        highlights: [
          "Sunset cruise through the Vembanad lagoon",
          "Traditional Kerala lunch on the deck",
          "Village walk in Kuttanad",
        ],
        imageUrl: "/generated/pkg-alleppey.png",
        active: true,
        sortOrder: 1,
      },
      {
        title: "Munnar Mist — Tea Country Retreat",
        destination: "Munnar",
        duration: "3 Days / 2 Nights",
        startingPrice: 18900,
        description:
          "Wind through endless emerald tea estates and wake up above the clouds. Visit the Tata Tea Museum, trek to Echo Point and watch the sun rise over the Anamudi peak — Kerala's highest. Cool air, hand-rolled tea, and silence that hums.",
        includedServices: [
          "3-star hill resort stay",
          "All breakfasts & dinners",
          "Premium AC SUV with driver",
          "All sightseeing as per itinerary",
          "Tea factory & museum entry",
        ],
        highlights: [
          "Tata Tea Museum visit",
          "Mattupetty Dam boating",
          "Eravikulam National Park (Nilgiri Tahr)",
          "Top Station viewpoint",
        ],
        imageUrl: "/generated/pkg-munnar.png",
        active: true,
        sortOrder: 2,
      },
      {
        title: "Wayanad Wilderness — Forest, Falls & Caves",
        destination: "Wayanad",
        duration: "3 Days / 2 Nights",
        startingPrice: 17500,
        description:
          "Step off the beaten track into Wayanad's whispering jungles. Trek to the prehistoric Edakkal caves, swim under thundering Soochipara falls and spot wild elephants in Muthanga sanctuary. A package built for travellers who like their luxury rough at the edges.",
        includedServices: [
          "Boutique forest resort stay",
          "All meals included",
          "Premium AC vehicle with driver",
          "All entry tickets & guides",
          "Jeep safari at Muthanga",
        ],
        highlights: [
          "Edakkal Caves trek",
          "Soochipara waterfalls swim",
          "Muthanga wildlife jeep safari",
          "Banasura Sagar Dam",
        ],
        imageUrl: "/generated/pkg-wayanad.png",
        active: true,
        sortOrder: 3,
      },
      {
        title: "Varkala & Kovalam — Cliffs, Sand and Sea",
        destination: "Varkala + Kovalam",
        duration: "4 Days / 3 Nights",
        startingPrice: 21500,
        description:
          "Trade the city for the sea. Spend mornings on the dramatic red cliffs of Varkala and evenings under lighthouse lit Kovalam beaches. Ayurvedic massages, palm-wine sundowners and the slow rhythm of the Arabian Sea — a coastal escape with soul.",
        includedServices: [
          "Beachfront boutique hotels",
          "Daily breakfast & one Ayurvedic session",
          "Premium AC vehicle with driver",
          "All transfers & sightseeing",
        ],
        highlights: [
          "Varkala cliff walk at sunset",
          "Janardhana Swamy Temple",
          "Kovalam lighthouse climb",
          "Optional dolphin-spotting cruise",
        ],
        imageUrl: "/generated/pkg-varkala.png",
        active: true,
        sortOrder: 4,
      },
    ]);
    console.log("  ✓ Packages seeded (4)");
  } else {
    console.log("  · Packages already seeded");
  }

  // Vehicles
  const [vehCountRow] = await db.select().from(vehiclesTable).limit(1);
  if (!vehCountRow) {
    await db.insert(vehiclesTable).values([
      {
        name: "Toyota Innova Crysta",
        vehicleType: "Premium SUV",
        seatingCapacity: 7,
        airConditioned: true,
        musicSystem: true,
        imageUrl: "/generated/veh-innova.png",
        description:
          "Spacious, smooth and family-favourite. Our flagship Innova Crysta fleet is hand-picked for long Kerala drives — leather interiors, chilled AC, and a power-packed music system tuned for hill-station highways.",
        features: [
          "7 captain seats",
          "Dual-zone climate control",
          "Premium music system",
          "Charging ports for every row",
          "Trained local driver",
        ],
        active: true,
        sortOrder: 1,
      },
      {
        name: "Force Tempo Traveller",
        vehicleType: "Group Van",
        seatingCapacity: 12,
        airConditioned: true,
        musicSystem: true,
        imageUrl: "/generated/veh-tempo.png",
        description:
          "Made for tribes, college groups and big families. Our 12-seater Tempo Travellers come with reclining seats, panoramic windows and a thumping music system — perfect for long Kerala road trips that turn into singalongs.",
        features: [
          "12 reclining pushback seats",
          "Roof carrier for luggage",
          "Aux + Bluetooth audio",
          "Reading lights & charging ports",
          "Dual AC vents",
        ],
        active: true,
        sortOrder: 2,
      },
      {
        name: "Toyota Etios / Suzuki Dzire",
        vehicleType: "Sedan",
        seatingCapacity: 4,
        airConditioned: true,
        musicSystem: true,
        imageUrl: "/generated/veh-sedan.png",
        description:
          "Couples and small families travel best in our well-kept sedans — fuel-efficient, quiet on the highway, and easy on tight Kerala backroads. Includes a full boot for luggage and a clean chilled cabin.",
        features: [
          "4-passenger comfort",
          "Spacious boot",
          "Chilled cabin AC",
          "Bluetooth audio",
          "Verified driver-partner",
        ],
        active: true,
        sortOrder: 3,
      },
      {
        name: "21-Seater Mini Coach",
        vehicleType: "Mini Coach",
        seatingCapacity: 21,
        airConditioned: true,
        musicSystem: true,
        imageUrl: "/generated/veh-bus.png",
        description:
          "For weddings, corporate retreats and large pilgrimages. Our 21-seater air-conditioned mini coaches keep the entire group together — overhead luggage space, tinted windows and a sound system loud enough to celebrate.",
        features: [
          "21 reclining seats",
          "Overhead luggage racks",
          "PA + music system",
          "Tinted glass windows",
          "Two AC zones",
        ],
        active: true,
        sortOrder: 4,
      },
    ]);
    console.log("  ✓ Vehicles seeded (4)");
  } else {
    console.log("  · Vehicles already seeded");
  }

  // Gallery
  const [galRow] = await db.select().from(galleryImagesTable).limit(1);
  if (!galRow) {
    const galleryItems = [
      { title: "Alleppey Backwaters at Dusk", caption: "Vembanad lagoon glowing gold" },
      { title: "Munnar Tea Estates", caption: "Endless emerald hills" },
      { title: "Varkala Cliffs", caption: "Sunset over the Arabian Sea" },
      { title: "Wayanad Forests", caption: "The wild green heart of Kerala" },
      { title: "Houseboat Living", caption: "Slow mornings on the water" },
      { title: "Temple Lamps", caption: "An evening of festival lights" },
      { title: "Kathakali Performance", caption: "The classical dance of Kerala" },
      { title: "Coastal Highway", caption: "Palm-lined drives" },
    ];
    await db.insert(galleryImagesTable).values(
      galleryItems.map((item, i) => ({
        title: item.title,
        caption: item.caption,
        imageUrl: `/generated/gallery-${i + 1}.png`,
        sortOrder: i,
      })),
    );
    console.log("  ✓ Gallery seeded (8)");
  } else {
    console.log("  · Gallery already seeded");
  }

  // Reviews
  const [revRow] = await db.select().from(reviewsTable).limit(1);
  if (!revRow) {
    await db.insert(reviewsTable).values([
      {
        authorName: "Priya Menon",
        rating: 5,
        comment:
          "We booked the Munnar package for my parents' 40th anniversary — absolutely flawless. The Innova was spotless, the driver was kind and patient, and the resort upgrade was a beautiful surprise. Tandava treated us like family.",
        location: "Bangalore",
        avatarUrl: null,
      },
      {
        authorName: "Arjun Krishnan",
        rating: 5,
        comment:
          "Took our college group of 11 in the Tempo Traveller all the way to Wayanad. Great music system, comfortable seats, and the driver knew every shortcut and viewpoint. Will book again next trip.",
        location: "Kochi",
        avatarUrl: null,
      },
      {
        authorName: "Sandra Williams",
        rating: 5,
        comment:
          "As a solo traveller from the UK I was nervous booking ahead — Tandava made it effortless. The Alleppey houseboat was magical, the food was incredible and I felt completely safe the entire trip. Highly recommended.",
        location: "London, UK",
        avatarUrl: null,
      },
      {
        authorName: "Rahul & Anjali Pillai",
        rating: 5,
        comment:
          "Our honeymoon Varkala-Kovalam package was the best decision we made. Beachfront stays, Ayurvedic massage, sunsets on the cliff — exactly the slow Kerala honeymoon we dreamed of.",
        location: "Mumbai",
        avatarUrl: null,
      },
      {
        authorName: "Mathew George",
        rating: 5,
        comment:
          "Booked transportation for our 50-person company offsite. Two coaches, on time, clean, with cold water and music ready. Tandava handled the chaos so we didn't have to. Five stars.",
        location: "Trivandrum",
        avatarUrl: null,
      },
      {
        authorName: "Lakshmi Iyer",
        rating: 5,
        comment:
          "We've used many Kerala tour operators over the years. Tandava is a different league — the attention to detail, the communication on WhatsApp, the genuinely well-maintained vehicles. Worth every rupee.",
        location: "Chennai",
        avatarUrl: null,
      },
    ]);
    console.log("  ✓ Reviews seeded (6)");
  } else {
    console.log("  · Reviews already seeded");
  }

  // Instagram posts
  const [igRow] = await db.select().from(instagramPostsTable).limit(1);
  if (!igRow) {
    const FALLBACK = "https://www.instagram.com/tandava_tour_company/";
    await db.insert(instagramPostsTable).values([
      {
        title: "Sunset over Alleppey",
        caption: "Golden hour on the Vembanad backwaters. Our guests, our houseboat, our favourite hour.",
        imageUrl: "/generated/gallery-1.png",
        postUrl: FALLBACK,
        displayOrder: 1,
        isActive: true,
      },
      {
        title: "Mornings in Munnar",
        caption: "Above the clouds, between the tea estates. A 6:30am moment from last week's tour.",
        imageUrl: "/generated/gallery-2.png",
        postUrl: FALLBACK,
        displayOrder: 2,
        isActive: true,
      },
      {
        title: "Festival of Lamps",
        caption: "Temple lamps lit for the season. Kerala's evenings glow like nowhere else.",
        imageUrl: "/generated/gallery-6.png",
        postUrl: FALLBACK,
        displayOrder: 3,
        isActive: true,
      },
      {
        title: "The Coastal Drive",
        caption: "Palm-lined highways towards Varkala — one of our most-loved transfers.",
        imageUrl: "/generated/gallery-8.png",
        postUrl: FALLBACK,
        displayOrder: 4,
        isActive: true,
      },
    ]);
    console.log("  ✓ Instagram posts seeded (4)");
  } else {
    console.log("  · Instagram posts already seeded");
  }

  console.log("Seeding complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
