#!/bin/bash

# Script to update all HTML files with responsive CSS and JS links

# Find all HTML files
HTML_FILES=$(find /home/ubuntu/sangeet-distribution -name "*.html")

# Loop through each file
for file in $HTML_FILES; do
  echo "Processing $file"
  
  # Check if responsive.css is already included
  if ! grep -q "responsive.css" "$file"; then
    # Add responsive.css after stailisa.css
    sed -i 's|<link rel="stylesheet" href="[^"]*stailisa.css">|&\n    <link rel="stylesheet" href="css/responsive.css">|' "$file"
    sed -i 's|<link rel="stylesheet" href="[^"]*stailisa.css">|&\n    <link rel="stylesheet" href="../css/responsive.css">|' "$file"
  fi
  
  # Check if viewport meta tag is properly set
  if ! grep -q 'meta name="viewport"' "$file"; then
    # Add viewport meta tag
    sed -i '/<head>/a \    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">' "$file"
  else
    # Update existing viewport meta tag
    sed -i 's|<meta name="viewport" content="[^"]*">|<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">|' "$file"
  fi
  
  # Check if responsive.js is already included
  if ! grep -q "responsive.js" "$file"; then
    # Add responsive.js before closing body tag
    sed -i 's|</body>|    <script src="js/responsive.js"></script>\n</body>|' "$file"
    sed -i 's|</body>|    <script src="../js/responsive.js"></script>\n</body>|' "$file"
  fi
done

echo "All HTML files updated with responsive CSS and JS"
