import { scrapeFighter } from './scrape-fighter.ts';

// Hier ist deine Liste! Füge einfach Links hinzu.
const fighterUrls = [
  "https://en.wikipedia.org/wiki/Rico_Verhoeven",
  "https://en.wikipedia.org/wiki/Badr_Hari",
  "https://en.wikipedia.org/wiki/Gökhan_Saki",
  "https://en.wikipedia.org/wiki/Jamal_Ben_Saddik",
  "https://en.wikipedia.org/wiki/Alex_Pereira",
  "https://en.wikipedia.org/wiki/Israel_Adesanya",
  "https://en.wikipedia.org/wiki/Conor_McGregor",
  "https://en.wikipedia.org/wiki/Jon_Jones",
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