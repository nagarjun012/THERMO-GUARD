/**
 * Generates src/data/allIndiaDistricts.ts — a flat array of all India districts
 * derived from the existing indiaLocations.ts data.
 * Run: node generate-districts.cjs
 */
const fs = require('fs');
const path = require('path');

// Read the existing indiaLocations.ts
const raw = fs.readFileSync('./src/data/indiaLocations.ts', 'utf8');

// Remove TypeScript-specific syntax to make it evaluable as JS
const jsCode = raw
  // Remove export interface blocks (multi-line)
  .replace(/export\s+interface\s+\w+\s*\{[\s\S]*?\}\s*/g, '')
  // Turn "export const INDIA_LOCATIONS: StateUT[] = " into "const INDIA_LOCATIONS = "
  .replace(/export\s+const\s+(\w+)\s*:\s*[\w\[\]]+\s*=\s*/g, 'const $1 = ');

// Evaluate in an isolated context
let INDIA_LOCATIONS;
try {
  const module = { exports: {} };
  const wrapped = `(function() { ${jsCode}; return INDIA_LOCATIONS; })()`;
  INDIA_LOCATIONS = eval(wrapped);
} catch(e) {
  console.error('Eval failed:', e.message);
  // Fallback: use regex to extract the JSON portion
  const match = raw.match(/\[\s*\{\s*"name"/);
  if (!match) { console.error('Cannot extract data.'); process.exit(1); }
  const start = raw.indexOf(match[0]);
  let depth = 0; let end = start;
  for (let i = start; i < raw.length; i++) {
    if (raw[i] === '[') depth++;
    if (raw[i] === ']') { depth--; if (depth === 0) { end = i; break; } }
  }
  INDIA_LOCATIONS = JSON.parse(raw.substring(start, end + 1));
}

if (!Array.isArray(INDIA_LOCATIONS) || INDIA_LOCATIONS.length === 0) {
  console.error('INDIA_LOCATIONS is empty or not an array.');
  process.exit(1);
}

// Flatten to district list
const districts = [];
for (const st of INDIA_LOCATIONS) {
  if (!st.districts) continue;
  for (const d of st.districts) {
    const rawId = `${st.name}-${d.name}`;
    const id = rawId.replace(/[^a-zA-Z0-9\-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    districts.push({
      id,
      district: d.name,
      state: st.name,
      lat: Number(d.lat),
      lon: Number(d.lon),
    });
  }
}

// Write output
const output = `// AUTO-GENERATED — DO NOT EDIT MANUALLY
// Source: src/data/indiaLocations.ts
// Run: node generate-districts.cjs to regenerate

export interface FlatDistrict {
  id: string;
  district: string;
  state: string;
  lat: number;
  lon: number;
}

export const ALL_INDIA_DISTRICTS: FlatDistrict[] = ${JSON.stringify(districts, null, 2)};
`;

const outPath = path.resolve('./src/data/allIndiaDistricts.ts');
fs.writeFileSync(outPath, output, 'utf8');
console.log(`✅ Generated ${outPath}`);
console.log(`   Districts: ${districts.length}`);
console.log(`   States/UTs: ${INDIA_LOCATIONS.length}`);
