# Build the project
npm run build

# Create a temporary directory
$tempDir = "temp_deploy"
New-Item -ItemType Directory -Path $tempDir -Force

# Copy the dist contents to the temporary directory
Copy-Item -Path "dist/*" -Destination $tempDir -Recurse

# Switch to gh-pages branch
git checkout gh-pages

# Remove all files except .git
Get-ChildItem -Path . -Exclude .git | Remove-Item -Recurse -Force

# Copy the contents from the temporary directory
Copy-Item -Path "$tempDir/*" -Destination . -Recurse

# Remove the temporary directory
Remove-Item -Path $tempDir -Recurse -Force

# Add all files
git add .

# Commit
git commit -m "Deploy to GitHub Pages"

# Push to gh-pages
git push origin gh-pages

# Switch back to main branch
git checkout main
