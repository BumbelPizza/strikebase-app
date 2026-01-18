import { scrapeFighter } from './scrape-fighter';

// Hier ist deine Liste! Füge einfach Links hinzu.
const fighterUrls = [
  "https://en.wikipedia.org/wiki/Category:Glory_kickboxers",
  "https://en.wikipedia.org/wiki/Category:K-1_kickboxers",
  "https://en.wikipedia.org/wiki/Category:Dutch_kickboxers",
  "https://en.wikipedia.org/wiki/Category:ONE_Championship_kickboxers",
  "https://en.wikipedia.org/wiki/Category:Kunlun_Fight_kickboxers",
  "https://en.wikipedia.org/wiki/Category:SUPERKOMBAT_kickboxers",
  "https://en.wikipedia.org/wiki/Category:It%27s_Showtime_(kickboxing)_kickboxers",
  "https://en.wikipedia.org/wiki/Category:Enfusion_kickboxers",
  // ... hier kannst du 100 Links reinpacken
];

async function runBulkImport() {
  console.log("🚀 Starting Bulk Import...");

  for (const url of fighterUrls) {
    // Wir warten auf jeden Fighter, damit Wikipedia uns nicht blockt (nett sein!)
    await scrapeFighter(url);

    // Kurze Pause von 1 Sekunde zwischen den Anfragen (Anti-Bot-Schutz umgehen)
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log("\n🏁 Bulk Import Finished!");
}

runBulkImport();