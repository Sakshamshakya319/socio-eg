#!/bin/bash

# Script to prepare a backend-only repository for Render deployment

echo "=== PREPARING BACKEND-ONLY REPOSITORY FOR RENDER ==="

# Get the target directory
read -p "Enter the path for the new repository: " TARGET_DIR

if [ -z "$TARGET_DIR" ]; then
  echo "No target directory specified. Using default: ../socio-backend-deploy"
  TARGET_DIR="../socio-backend-deploy"
fi

# Create the target directory if it doesn't exist
mkdir -p "$TARGET_DIR"

# Copy all backend files to the target directory
echo "Copying backend files to $TARGET_DIR..."
cp -r ./* "$TARGET_DIR"
cp -r .env "$TARGET_DIR" 2>/dev/null || echo "No .env file found"
cp -r .gitignore "$TARGET_DIR" 2>/dev/null || echo "No .gitignore file found"

# Initialize git in the target directory
echo "Initializing git repository in $TARGET_DIR..."
cd "$TARGET_DIR" || exit
git init

# Create a .gitignore file if it doesn't exist
if [ ! -f .gitignore ]; then
  echo "Creating .gitignore file..."
  cat > .gitignore << EOL
# Logs
logs
*.log
npm-debug.log*

# Dependency directories
node_modules/

# Environment variables
.env

# Build directory
build/

# Credentials
*.key
*.pem
*.json
EOL
fi

# Add all files to git
git add .
git commit -m "Initial commit for backend deployment"

echo "=== BACKEND-ONLY REPOSITORY PREPARED ==="
echo "Your backend-only repository is ready at: $TARGET_DIR"
echo ""
echo "Next steps:"
echo "1. Create a new repository on GitHub/GitLab"
echo "2. Add your remote repository:"
echo "   git remote add origin YOUR_REPOSITORY_URL"
echo "3. Push your code:"
echo "   git push -u origin main"
echo "4. Connect this repository to Render"
echo ""
echo "For more details, see render_deploy_guide.md"