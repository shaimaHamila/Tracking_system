#! /bin/bash
echo "[INFO] Preparing Backend infrastructure ................"
cd ./server/
cat .env.example >> .env
echo -e  >> .env
echo -e FRONTEND_URL=$(gp url 3000) >> .env
npm i
docker-compose up --build -d

echo "[INFO] Preparing Backend infrastructure done."

echo \n\n\n

echo "[INFO] Preparing Frontend infrastructure ................"
cd ./client/

cat .env.example >> .env
echo -e  >> .env
echo -e VITE_BASE_URL=$(gp url 6001) >> .env
npm i
docker-compose --profile dev up --build -d
echo "[INFO] Preparing Backend infrastructure done."

echo \n\n\n