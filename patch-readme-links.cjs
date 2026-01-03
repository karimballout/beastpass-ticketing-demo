const fs = require("fs");

const p = "README.md";
let s = fs.readFileSync(p, "utf8");

const block = `## Live links
- **GitHub (source):** https://github.com/karimballout/beastpass-ticketing-demo
- **Web demo (React):** https://2e943849-f0f7-4a3d-8b79-bc3d9b8caa3d-00-26hp68dcdm788.sisko.replit.dev:5173
- **Storybook (UI components):** https://2e943849-f0f7-4a3d-8b79-bc3d9b8caa3d-00-26hp68dcdm788.sisko.replit.dev:6007

> Note: Replit demo links may sleep when inactive — I can wake them up quickly or screen-share.
`;

if (s.includes("## Live links")) {
  console.log("README already has Live links.");
  process.exit(0);
}

const lines = s.split("\n");
const idx = lines.findIndex((l) => l.startsWith("# "));
if (idx === -1) {
  console.error("Could not find README title (# ...).");
  process.exit(1);
}

lines.splice(idx + 1, 0, "", block, "");
fs.writeFileSync(p, lines.join("\n"));
console.log("Pinned links added to README.");
