#!/bin/bash

echo "📦 Import des données..."

mongoimport \
  --db "${MONGO_INITDB_DATABASE}" \
  --username "${MONGO_INITDB_ROOT_USERNAME}" \
  --password "${MONGO_INITDB_ROOT_PASSWORD}" \
  --authenticationDatabase admin \
  --collection champions \
  --file /static/champions.json \
  --jsonArray \
  --drop

mongoimport \
  --db "${MONGO_INITDB_DATABASE}" \
  --username "${MONGO_INITDB_ROOT_USERNAME}" \
  --password "${MONGO_INITDB_ROOT_PASSWORD}" \
  --authenticationDatabase admin \
  --collection classes \
  --file /static/classes.csv \
  --type csv \
  --headerline \
  --drop

mongoimport \
  --db "${MONGO_INITDB_DATABASE}" \
  --username "${MONGO_INITDB_ROOT_USERNAME}" \
  --password "${MONGO_INITDB_ROOT_PASSWORD}" \
  --authenticationDatabase admin \
  --collection types \
  --file /static/types.csv \
  --type csv \
  --headerline \
  --drop

  mongoimport \
  --db "${MONGO_INITDB_DATABASE}" \
  --username "${MONGO_INITDB_ROOT_USERNAME}" \
  --password "${MONGO_INITDB_ROOT_PASSWORD}" \
  --authenticationDatabase admin \
  --collection regions \
  --file /static/regions.csv \
  --type csv \
  --headerline \
  --drop

echo "✅ Import terminé !"