const fs = require('fs');
const https = require('https');

const avatars = [
  { name: 'dev1.svg', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul&backgroundColor=7c3aed&top=shortHairShortFlat' },
  { name: 'dev2.svg', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Raghu&backgroundColor=2563eb&top=shortHairSides&accessories=prescription02' },
  { name: 'dev3.svg', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohit&backgroundColor=7c3aed&top=shortHairShortCurly&skinColor=brown' },
  { name: 'dev4.svg', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sagar&backgroundColor=2563eb&top=shortHairTheCaesar&mouth=smile' }
];

avatars.forEach(a => {
  https.get(a.url, res => {
    let raw = '';
    res.on('data', chunk => raw += chunk);
    res.on('end', () => fs.writeFileSync('public/' + a.name, raw));
  }).on('error', err => console.error(err));
});
