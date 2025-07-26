const fs = require("fs");
const path = require("path");

// Categories that need icons
const categories = [
  "ai-chat",
  "ai-image",
  "ai-video",
  "ai-code",
  "ai-business",
  "ai-education",
  "ai-health",
];

// SVG templates for each category
const svgTemplates = {
  "ai-chat": `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="64" height="64" rx="12" fill="#3B82F6"/>
    <path d="M16 24C16 19.5817 19.5817 16 24 16H40C44.4183 16 48 19.5817 48 24V32C48 36.4183 44.4183 40 40 40H32L24 48V40H24C19.5817 40 16 36.4183 16 32V24Z" fill="white"/>
    <circle cx="28" cy="28" r="2" fill="#3B82F6"/>
    <circle cx="36" cy="28" r="2" fill="#3B82F6"/>
  </svg>`,

  "ai-image": `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="64" height="64" rx="12" fill="#10B981"/>
    <rect x="16" y="16" width="32" height="24" rx="4" fill="white"/>
    <circle cx="24" cy="24" r="3" fill="#10B981"/>
    <path d="M16 36L24 28L32 36L40 28L48 36V40H16V36Z" fill="#10B981"/>
  </svg>`,

  "ai-video": `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="64" height="64" rx="12" fill="#EF4444"/>
    <rect x="16" y="20" width="32" height="24" rx="4" fill="white"/>
    <path d="M28 28L36 32L28 36V28Z" fill="#EF4444"/>
  </svg>`,

  "ai-code": `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="64" height="64" rx="12" fill="#8B5CF6"/>
    <path d="M20 20L28 32L20 44M44 20L36 32L44 44" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M32 16L28 48" stroke="white" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  "ai-business": `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="64" height="64" rx="12" fill="#F59E0B"/>
    <path d="M20 24H44V40H20V24Z" fill="white"/>
    <path d="M24 20H40V24H24V20Z" fill="white"/>
    <rect x="28" y="28" width="8" height="8" fill="#F59E0B"/>
  </svg>`,

  "ai-education": `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="64" height="64" rx="12" fill="#06B6D4"/>
    <path d="M32 16L48 24V32C48 40.8366 40.8366 48 32 48C23.1634 48 16 40.8366 16 32V24L32 16Z" fill="white"/>
    <path d="M32 24L40 28V32C40 36.4183 36.4183 40 32 40C27.5817 40 24 36.4183 24 32V28L32 24Z" fill="#06B6D4"/>
  </svg>`,

  "ai-health": `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="64" height="64" rx="12" fill="#EC4899"/>
    <path d="M32 16L36 24H44L38 30L40 38L32 34L24 38L26 30L20 24H28L32 16Z" fill="white"/>
  </svg>`,
};

const categoryIconsDir = path.join(__dirname, "..", "public", "category-icons");

// Create directory if it doesn't exist
if (!fs.existsSync(categoryIconsDir)) {
  fs.mkdirSync(categoryIconsDir, { recursive: true });
}

console.log("Creating category icons...");

categories.forEach((category) => {
  const svgPath = path.join(categoryIconsDir, `${category}.svg`);
  const pngPath = path.join(categoryIconsDir, `${category}.png`);

  // Create SVG file
  if (svgTemplates[category]) {
    fs.writeFileSync(svgPath, svgTemplates[category]);
    console.log(`✅ Created ${category}.svg`);
  }

  // Note: PNG creation would require additional libraries like sharp or canvas
  // For now, we'll just create SVG files and let the browser handle them
});

console.log("Category icons created successfully!");
console.log(
  "Note: PNG files would need to be created manually or with additional libraries."
);
