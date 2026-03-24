const fs = require('fs');
const urls = [
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Rahul&backgroundColor=7c3aed&top=shortHairShortFlat&facialHairProbability=0",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Jack&backgroundColor=2563eb&top=shortHairSides&accessories=prescription02&accessoriesProbability=100&facialHairProbability=0",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Sam&backgroundColor=7c3aed&top=shortHairShortCurly&skinColor=8d5524&facialHair=beardLight&facialHairProbability=100",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Oliver&backgroundColor=2563eb&top=shortHairTheCaesar&mouth=smile&facialHairProbability=0",
  "https://api.dicebear.com/9.x/notionists/svg?seed=Rahul&backgroundColor=7c3aed",
  "https://api.dicebear.com/7.x/micah/svg?seed=Rahul&backgroundColor=7c3aed",
  "https://api.dicebear.com/9.x/avataaars-neutral/svg?seed=Rahul&backgroundColor=7c3aed"
];

async function check() {
  let out = "";
  for (let u of urls) {
     const res = await fetch(u);
     out += `${res.status} ${u}\n`;
  }
  fs.writeFileSync('out.txt', out);
}
check();
