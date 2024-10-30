#! /bin/bash

echo "[INFO] Preparing Backend infrastructure ................"
cd ./server/ || { echo "[ERROR] Failed to enter server directory."; exit 1; }

# Check if .env exists; if so, overwrite it
if [ -f .env ]; then
    echo "[INFO] .env file exists. Replacing its content..."
else
    echo "[INFO] .env file does not exist. Creating it..."
fi

# Create or replace the .env file from .env.example
cat .env.example > .env
check_success "Creating or replacing .env from .env.example"

# Add FRONTEND_URL dynamically
echo -n "FRONTEND_URL=https://$(gh codespace view | awk '/Name/{print $2; exit}')-3000.app.github.dev" >> .env
check_success "Appending FRONTEND_URL to .env"

# Install npm packages
npm install
check_success "Installing npm packages"

# Build and run Docker containers
docker-compose up --build -d
check_success "Starting Docker containers"

echo "[INFO] Preparing Backend infrastructure done."
echo -e "\n\n\n"

echo "[INFO] Preparing Frontend infrastructure ................"
cd ../client/ || { echo "[ERROR] Failed to enter client directory."; exit 1; }

# Check if .env exists; if so, overwrite it
if [ -f .env ]; then
    echo "[INFO] .env file exists. Replacing its content..."
else
    echo "[INFO] .env file does not exist. Creating it..."
fi

# Create or replace the .env file from .env.example
cat .env.example > .env
check_success "Creating or replacing .env from .env.example"

# Add VITE_BASE_URL dynamically
echo -n "VITE_BASE_URL=https://$(gh codespace view | awk '/Name/{print $2; exit}')-6001.app.github.dev" >> .env
check_success "Appending VITE_BASE_URL to .env"

# Install npm packages
npm install
check_success "Installing npm packages"

# Build and run Docker containers
docker-compose --profile dev up --build -d
check_success "Starting Docker containers"

echo "[INFO] Preparing Frontend infrastructure done."
echo -e "\n\n\n"