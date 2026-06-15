# GUIDE ÉTAPE PAR ÉTAPE (Pour Débutants)

## 🔴 ÉTAPE 1: Nouveau Gmail (5 min)
1. Va sur gmail.com
2. Crée: myroomtn.business@gmail.com
3. Note le mot de passe quelque part : Aminoub1##

## 🔴 ÉTAPE 2: Nouveau GitHub (10 min)
1. Va sur github.com
2. Crée un compte avec ton nouveau Gmail
3. Crée un NOUVEAU repo privé: "myroom"
4. NE mets PAS d'ancien code dedans

## 🔴 ÉTAPE 3: Nouveau Supabase (15 min)
1. Va sur supabase.com
2. Connecte-toi avec ton nouveau Gmail
3. Crée un NOUVEAU projet
4. Nom: "myroom"
5. Mot de passe de base: bfxtQJPjRcsuCqMR
6. Région: Europe (Francfort)
7. Attends que ça charge (2-3 min)

## 🔴 ÉTAPE 4: Base de données (10 min)
1. Dans Supabase, clique "SQL Editor" (à gauche)
2. Ouvre le fichier "supabase-schema.sql" de ce dossier
3. Copie TOUT le texte
4. Colle dans l'éditeur SQL
5. Clique "Run"
6. Tu verras "Success" en vert

## 🔴 ÉTAPE 5: Récupérer les clés (5 min)
1. Dans Supabase, clique "Project Settings" (icône engrenage)
2. Clique "API" dans le menu
3. Copie "Project URL" → c'est VITE_SUPABASE_URL  :  https://ynhiwjekrghcvzwfctbq.supabase.co/rest/v1/
4. Copie "anon public" → c'est VITE_SUPABASE_ANON_KEY  : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluaGl3amVrcmdoY3Z6d2ZjdGJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2MjE0MjIsImV4cCI6MjA5NDE5NzQyMn0.ua-h7zY0H36V99y1YnOrSg2QPQ2xxVescyWBEIdYSj4 
5. Garde-les dans un fichier texte sur ton PC

## 🔴 ÉTAPE 6: Fichier .env (5 min)
1. Dans ce dossier "myroom", trouve ".env.example"
2. Fais une copie
3. Renomme la copie en ".env" (avec le point au début)
4. Ouvre-le avec Notepad
5. Remplace les valeurs par tes vraies clés Supabase
6. Sauvegarde

## 🔴 ÉTAPE 7: Installer et tester (10 min)
1. Ouvre ce dossier "myroom" dans VS Code
2. Ouvre Terminal (Terminal → New Terminal)
3. Tape: npm install
4. Attends que ça finisse (2-3 min)
5. Tape: npm run dev
6. Ovre ton navigateur sur: http://localhost:5173
7. Tu dois voir ton site!

## 🔴 ÉTAPE 8: Pousser sur GitHub (10 min)
Dans le Terminal:
```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/TON-USERNAME/myroom.git
git push -u origin main
```

## 🔴 ÉTAPE 9: Déployer sur Vercel (15 min)
1. Va sur vercel.com
2. Connecte-toi avec ton nouveau GitHub
3. Clique "Add New Project"
4. Choisis "myroom"
5. Dans "Environment Variables", ajoute:
   - VITE_SUPABASE_URL = ton URL
   - VITE_SUPABASE_ANON_KEY = ta clé
6. Clique "Deploy"
7. Attends 2-3 minutes
8. Ton site est en ligne!

## 🟡 ÉTAPE 10: Domaine (optionnel, 30 min)
1. Va sur ati.tn
2. Cherche "myroom.tn"
3. Si dispo, achète-le (~40 TND)
4. Dans Vercel: Settings → Domains → Add
5. Suis les instructions DNS

## 🟡 ÉTAPE 11: Réseaux sociaux (30 min)
1. Crée page Facebook: "MyRoom.tn"
2. Crée compte Instagram: "myroom.tn"
3. Poste 3-4 photos de logements
4. Mets le lien de ton site en bio

## 🟢 ÉTAPE 12: Premières annonces (1 heure)
1. Va sur Facebook, cherche "logement étudiant Tunis"
2. Copie 10 annonces intéressantes
3. Crée un compte sur ton site
4. Poste les 10 annonces
5. Partage ton lien dans 10 groupes Facebook

## ✅ TU ES PRÊT!

Si tu bloques sur une étape, dis-moi:
- "Je suis bloqué à l'étape X"
- "Je vois ce message d'erreur: [copie-colle]"
- "Je ne comprends pas [mot]"

Je t'aiderai immédiatement.
