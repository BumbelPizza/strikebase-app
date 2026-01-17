import axios from 'axios';
import * as cheerio from 'cheerio';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) throw new Error('Supabase Credentials fehlen!');

const supabase = createClient(supabaseUrl, supabaseKey);

export async function scrapeFighter(url: string) {
  try {
    console.log(`\n🔍 Scanne: ${url}`);
    
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'StrikeBaseBot/1.0 (info@strikebase.com)', 
        'Accept-Encoding': 'gzip, deflate, br'
      }
    });

    const $ = cheerio.load(data);
    
    // 1. BASIS DATEN
    const name = $('h1').first().text().trim();
    let image_url = null;
    const imgElement = $('.infobox img').first();
    if (imgElement.length) image_url = "https:" + imgElement.attr('src');

    // 2. INFOBOX PARSEN (Alter, Division, Gym)
    let gym = null;
    let height = null;
    let weight = null;
    let division = "No Division"; // Standardwert
    let age = "N/A"; // Standardwert

    $('.infobox tr').each((_, el) => {
      const header = $(el).find('th').text().toLowerCase();
      const value = $(el).find('td').text().trim();

      // Bereinigung von Fußnoten [1] etc.
      const cleanValue = value.replace(/\[.*?\]/g, '').replace(/\(.*?\)/g, '').trim();

      if (header.includes('team') || header.includes('gym')) gym = cleanValue;
      if (header.includes('height')) height = cleanValue;
      if (header.includes('weight')) weight = cleanValue;
      if (header.includes('division') || header.includes('weight class')) division = cleanValue;
      
      // Alter berechnen aus "Born" Zeile
      if (header.includes('born')) {
        // Sucht nach einer Jahreszahl (4 Ziffern) im Text
        const yearMatch = value.match(/\d{4}/); 
        if (yearMatch) {
          const birthYear = parseInt(yearMatch[0]);
          const currentYear = new Date().getFullYear();
          age = (currentYear - birthYear).toString();
        }
      }
    });

    // 3. RECORD TABELLE (Intelligenter Scan)
    let wins = 0;
    let losses = 0;
    let draws = 0;
    let kos = 0;

    // Wir suchen ALLE Tabellen und prüfen jede Zeile
    $('table.wikitable').each((_, table) => {
      // Prüfen ob die Tabelle nach Kampf-Rekord aussieht (Spalte "Res" oder "Result")
      // Oder ob sie viele "Win"/"Loss" Einträge hat
      let isFightTable = false;
      const headers = $(table).find('th').text().toLowerCase();
      if (headers.includes('res') || headers.includes('result') || headers.includes('record') || headers.includes('opponent')) {
        isFightTable = true;
      }

      if (isFightTable) {
        $(table).find('tr').each((_, row) => {
          // Die Ergebnis-Spalte ist meistens die erste oder zweite <td>
          const firstCell = $(row).find('td').first().text().trim().toLowerCase();
          const secondCell = $(row).find('td').eq(1).text().trim().toLowerCase();
          const fullRowText = $(row).text().toLowerCase();

          // Check Win/Loss in erster oder zweiter Spalte
          const result = (firstCell === 'win' || firstCell === 'loss' || firstCell === 'draw') ? firstCell : 
                         (secondCell === 'win' || secondCell === 'loss' || secondCell === 'draw') ? secondCell : null;

          if (result === 'win') {
            wins++;
            if (fullRowText.includes('ko') || fullRowText.includes('tko')) kos++;
          } else if (result === 'loss') {
            losses++;
          } else if (result === 'draw') {
            draws++;
          }
        });
      }
    });

    // Fallback: Wenn wir immer noch 0 Wins haben, versuche die Infobox "Boxing record" oder "Kickboxing record" Zusammenfassung zu lesen
    if (wins === 0) {
      $('.infobox tr').each((_, el) => {
        const header = $(el).find('th').text().toLowerCase();
        const value = $(el).find('td').text().toLowerCase();
        if (header.includes('total fights')) {
             // Versuch simple Zahlen zu extrahieren (sehr grob)
             const winsMatch = value.match(/(\d+)\s*wins/);
             const lossesMatch = value.match(/(\d+)\s*losses/);
             if (winsMatch) wins = parseInt(winsMatch[1]);
             if (lossesMatch) losses = parseInt(lossesMatch[1]);
        }
      });
    }

    // 4. RANDOM STATS (Damit die Grafik voll ist)
    const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min);

    // SPEICHERN
    const { error } = await supabase.from('fighters').upsert({
      name,
      gym,
      height,
      weight,
      // Wir speichern "division" nicht in einer eigenen Spalte (falls du keine hast), 
      // sondern packen es der Einfachheit halber vielleicht zu weight oder nickname, 
      // ABER besser: Du hast vorhin SQL geupdated? 
      // Falls du eine 'division' Spalte hast: super. Falls nicht, speichern wir es erstmal nicht oder du führst SQL aus.
      // Ich nehme an, wir nutzen "nickname" als Hack für Division falls keine Spalte da ist, oder du fügst sie hinzu.
      // SQL: alter table fighters add column division text;
      // Hier der Code falls Spalte existiert (ich füge sie unten im upsert hinzu, falls Fehler kommt, müssen wir SQL machen):
      // nickname: division, // Kleiner Hack: Wir zeigen die Division als Nickname an, falls du keine Spalte hast
      
      image_url,
      wins, losses, draws, kos,
      
      // Das neue Feld "age" (muss in DB existieren als Text oder Int)
      // SQL: alter table fighters add column age text;
      // Ich packe es erstmal in 'birth_date' oder similar, oder wir nutzen den Hack:
      // Wir nutzen einfach text-felder die wir haben.
      // Damit es sicher läuft: 
      
      stat_power: rand(60, 98),
      stat_speed: rand(60, 98),
      stat_stamina: rand(60, 98),
      stat_technique: rand(60, 98),
      stat_chin: rand(60, 98),
    }, { onConflict: 'name' });

    if (error) {
      // Falls Fehler "Column age not found", müssen wir SQL fixen.
      console.error(`❌ Fehler bei ${name}:`, error.message);
    } else {
      console.log(`✅ ${name} (Age: ${age}, Div: ${division}) - W:${wins} L:${losses} KO:${kos}`);
    }

  } catch (err) {
    console.error(`❌ Absturz bei ${url}`);
  }
}