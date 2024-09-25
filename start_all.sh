#! /bin/bash
echo "[INFO] Preparing Backend infrastructure ................"
cd server/
cat .env.example >> .env
echo -e  >> .env
echo -e FRONTEND_URL=https://$(gh codespace view | awk '/Name/{print $2; exit}')-3000.app.github.dev >> .env
npm i
docker-compose up --build -d
echo "[INFO] Preparing Backend infrastructure done."

echo \n\n\n

echo "[INFO] Preparing Frontend infrastructure ................"
cd ../client/
cat .env.example >> .env
echo -e  >> .env
echo -e VITE_BASE_URL=https://$(gh codespace view | awk '/Name/{print $2; exit}')-6001.app.github.dev >> .env
npm i
docker-compose --profile dev up --build -d
echo "[INFO] Preparing frontend infrastructure done."

echo \n\n\n

 