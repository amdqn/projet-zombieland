#!/bin/bash
# Couleurs pour les messages
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Nettoyage de l'environnement Docker ===${NC}"

# Arrêter et supprimer tous les containers, réseaux, images et volumes
echo -e "${GREEN}Arrêt des containers existants...${NC}"
docker compose down -v --remove-orphans

echo -e "${GREEN}Nettoyage complet effectué${NC}"
echo ""

echo -e "${BLUE}=== Génération de l'API (local) ===${NC}"
cd backend
npm run generate:api
cd ..

echo -e "${BLUE}=== Démarrage de l'environnement Docker ===${NC}"

# Démarrer les containers Docker Compose
echo -e "${GREEN}Lancement de Docker Compose...${NC}"
docker compose up -d

# Attendre que les containers soient prêts
echo -e "${GREEN}Attente du démarrage des containers...${NC}"
sleep 10

# Vérifier que le container zombieland-api est en cours d'exécution
if ! docker ps | grep -q "zombieland-api"; then
    echo -e "${RED}Erreur: Le container zombieland-api n'est pas en cours d'exécution${NC}"
    exit 1
fi

# Attendre que npm install soit terminé dans le container
echo -e "${GREEN}Attente de la fin de l'installation des dépendances...${NC}"
until docker exec zombieland-api test -d node_modules/.bin 2>/dev/null; do
    echo -e "${GREEN}Installation en cours...${NC}"
    sleep 5
done

echo -e "${BLUE}=== Génération du client Prisma ===${NC}"
# ⬆️ DÉPLACÉ APRÈS migrate deploy pour que le schema soit à jour
docker exec zombieland-api npx prisma generate

echo -e "${BLUE}=== Déploiement des migrations ===${NC}"
docker exec zombieland-api npx prisma migrate deploy

echo -e "${BLUE}=== Exécution du seed ===${NC}"
docker exec zombieland-api npx prisma db seed

echo -e "${GREEN}=== Setup terminé avec succès! ===${NC}"