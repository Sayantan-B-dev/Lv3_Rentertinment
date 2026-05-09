const fs = require('fs');

const files = [
  'lib/services/artistService.ts', 
  'lib/services/importService.ts', 
  'lib/services/searchService.ts', 
  'app/api/inquiries/route.ts', 
  'app/api/inquiries/[id]/route.ts', 
  'app/api/admin/dashboard/route.ts'
];

files.forEach(f => {
  let md = fs.readFileSync(f, 'utf8');
  md = md.replace('import connectToDatabase from "@/lib/db/connect";', 'import { connectToDatabase } from "@/lib/db/connect";');
  fs.writeFileSync(f, md);
});

console.log("Fixed DB imports to named imports");
