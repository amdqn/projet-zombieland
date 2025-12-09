import 'dotenv/config';
import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// ===== SEED DATA =====
const userData: Array<{ email: string; pseudo: string; role: Role }> = [
  {
    email: 'admin@zombieland.com',
    pseudo: 'AdminZombie',
    role: 'ADMIN',
  },
  {
    email: 'jean@zombieland.com',
    pseudo: 'JeanZ',
    role: 'CLIENT',
  },
  {
    email: 'marie@zombieland.com',
    pseudo: 'MarieZombie',
    role: 'CLIENT',
  },
  {
    email: 'paul@zombieland.com',
    pseudo: 'PaulSurvivor',
    role: 'CLIENT',
  },
];

const categoryData = [
  {
    name: 'Attractions extrêmes',
    description: 'Sensations fortes garanties pour les amateurs d\'adrénaline',
  },
  {
    name: 'Expériences immersives',
    description: 'Plongez au cœur de l\'apocalypse zombie',
  },
  {
    name: 'Activités familiales',
    description: 'Des attractions pour toute la famille',
  },
  {
    name: 'Spectacles',
    description: 'Shows et animations en live',
  },
  {
    name: 'Restauration',
    description: 'Restaurants et points de vente thématiques',
  },
];

const attractionData = [
  {
    name: 'The Walking Dead Experience',
    description: 'Parcours immersif au cœur de l\'apocalypse zombie avec effets spéciaux et acteurs',
    categoryIndex: 1, // Expériences immersives
  },
  {
    name: 'Zombie Apocalypse Ride',
    description: 'Montagnes russes extrêmes dans un décor post-apocalyptique',
    categoryIndex: 0, // Attractions extrêmes
  },
  {
    name: 'Labyrinthe des Infectés',
    description: 'Trouvez la sortie avant que les zombies ne vous rattrapent',
    categoryIndex: 2, // Activités familiales
  },
  {
    name: 'Arena des Morts-Vivants',
    description: 'Grand spectacle avec effets pyrotechniques et cascades',
    categoryIndex: 3, // Spectacles
  },
  {
    name: 'Tour de la Chute Libre',
    description: 'Chute libre de 80 mètres dans une tour abandonnée infestée de zombies',
    categoryIndex: 0, // Attractions extrêmes
  },
  {
    name: 'Bunker VR Experience',
    description: 'Expérience en réalité virtuelle : survivez dans un bunker assiégé',
    categoryIndex: 1, // Expériences immersives
  },
  {
    name: 'Train Fantôme Apocalypse',
    description: 'Parcours en petit train à travers une ville ravagée par les zombies',
    categoryIndex: 2, // Activités familiales
  },
  {
    name: 'Le Manège des Infectés',
    description: 'Carrousel thématique avec créatures zombies animées',
    categoryIndex: 2, // Activités familiales
  },
  {
    name: 'Survivor Arena Show',
    description: 'Spectacle interactif où le public vote pour les survivants',
    categoryIndex: 3, // Spectacles
  },
  {
    name: 'Pendule de l\'Apocalypse',
    description: 'Balancier géant à sensations fortes dans un décor industriel abandonné',
    categoryIndex: 0, // Attractions extrêmes
  },
  {
    name: 'Hôpital Hanté',
    description: 'Parcours terrifiant dans un hôpital contaminé avec acteurs zombies',
    categoryIndex: 1, // Expériences immersives
  },
];

async function main() {
  console.log('🌱 Début du seeding...');

  // Nettoyage de la base (dans l'ordre des dépendances)
  await prisma.reservation.deleteMany();
  await prisma.attractionImage.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.attraction.deleteMany();
  await prisma.category.deleteMany();
  await prisma.parkDate.deleteMany();
  await prisma.price.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Base de données nettoyée');

  // ===== USERS =====
  const hashedPassword = await bcrypt.hash('password123', 10);

  const users = await Promise.all(
    userData.map((user) =>
      prisma.user.create({
        data: {
          ...user,
          password: hashedPassword,
        },
      }),
    ),
  );

  console.log(`✅ Utilisateurs créés (${users.length})`);

  // ===== CATEGORIES =====
  const categories = await Promise.all(
    categoryData.map((category) =>
      prisma.category.create({
        data: category,
      }),
    ),
  );

  console.log(`✅ Catégories créées (${categories.length})`);

  // ===== ATTRACTIONS =====
  const attractions = await Promise.all(
    attractionData.map((attraction) =>
      prisma.attraction.create({
        data: {
          name: attraction.name,
          description: attraction.description,
          category_id: categories[attraction.categoryIndex].id,
        },
      }),
    ),
  );

  console.log(`✅ Attractions créées (${attractions.length})`);

  // ===== ATTRACTION IMAGES =====
  await prisma.attractionImage.createMany({
    data: [
      {
        attraction_id: attractions[0].id, // The Walking Dead Experience
        url: 'https://cdn.zombieland.com/images/walking-dead-1.jpg',
        alt_text: 'Vue extérieure de l\'attraction The Walking Dead Experience',
      },
      {
        attraction_id: attractions[0].id,
        url: 'https://cdn.zombieland.com/images/walking-dead-2.jpg',
        alt_text: 'Intérieur sombre avec zombies',
      },
      {
        attraction_id: attractions[1].id, // Zombie Apocalypse Ride
        url: 'https://cdn.zombieland.com/images/ride-1.jpg',
        alt_text: 'Montagnes russes Zombie Apocalypse',
      },
      {
        attraction_id: attractions[2].id, // Labyrinthe des Infectés
        url: 'https://cdn.zombieland.com/images/maze-1.jpg',
        alt_text: 'Entrée du labyrinthe des infectés',
      },
      {
        attraction_id: attractions[3].id, // Arena des Morts-Vivants
        url: 'https://cdn.zombieland.com/images/arena-1.jpg',
        alt_text: 'Arena des Morts-Vivants - vue du spectacle',
      },
      {
        attraction_id: attractions[4].id, // Tour de la Chute Libre
        url: 'https://cdn.zombieland.com/images/free-fall-tower.jpg',
        alt_text: 'Tour de la Chute Libre de 80 mètres',
      },
      {
        attraction_id: attractions[5].id, // Bunker VR Experience
        url: 'https://cdn.zombieland.com/images/vr-bunker.jpg',
        alt_text: 'Salle VR du bunker avec équipements',
      },
      {
        attraction_id: attractions[6].id, // Train Fantôme Apocalypse
        url: 'https://cdn.zombieland.com/images/ghost-train.jpg',
        alt_text: 'Train fantôme traversant la ville abandonnée',
      },
      {
        attraction_id: attractions[7].id, // Le Manège des Infectés
        url: 'https://cdn.zombieland.com/images/carousel.jpg',
        alt_text: 'Carrousel thématique zombies',
      },
      {
        attraction_id: attractions[8].id, // Survivor Arena Show
        url: 'https://cdn.zombieland.com/images/survivor-show.jpg',
        alt_text: 'Spectacle Survivor Arena avec public',
      },
      {
        attraction_id: attractions[9].id, // Pendule de l'Apocalypse
        url: 'https://cdn.zombieland.com/images/pendulum.jpg',
        alt_text: 'Balancier géant en action',
      },
      {
        attraction_id: attractions[10].id, // Hôpital Hanté
        url: 'https://cdn.zombieland.com/images/hospital.jpg',
        alt_text: 'Entrée sombre de l\'hôpital hanté',
      },
    ],
  });

  console.log('✅ Images d\'attractions créées (11)');

  // ===== ACTIVITIES =====
  await prisma.activity.createMany({
    data: [
      {
        name: 'Escape Game Zombie',
        description: '60 minutes pour trouver le remède et sauver l\'humanité',
        category_id: categories[1].id, // Expériences immersives
        attraction_id: attractions[0].id, // The Walking Dead Experience
      },
      {
        name: 'Laser Game Zombie',
        description: 'Affrontez les zombies en équipe avec des lasers',
        category_id: categories[0].id, // Attractions extrêmes
        attraction_id: null,
      },
      {
        name: 'Atelier Maquillage Zombie',
        description: 'Transformez-vous en zombie avec nos maquilleurs professionnels',
        category_id: categories[2].id, // Activités familiales
        attraction_id: null,
      },
      {
        name: 'Spectacle Survie',
        description: 'Show avec cascades et combats contre les zombies',
        category_id: categories[3].id, // Spectacles
        attraction_id: null,
      },
      {
        name: 'Restaurant Le Bunker',
        description: 'Restaurant thématique dans un bunker post-apocalyptique',
        category_id: categories[4].id, // Restauration
        attraction_id: null,
      },
    ],
  });

  console.log('✅ Activités créées (5)');

  // ===== PARK DATES =====
  const dates: Array<{
    jour: Date;
    is_open: boolean;
    notes: string | null;
  }> = [];
  const startDate = new Date('2025-12-01');
  
  for (let i = 0; i < 31; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    
    // Fermé les lundis et mardis
    const dayOfWeek = currentDate.getDay();
    const isOpen = dayOfWeek !== 1 && dayOfWeek !== 2;
    
    let notes: string | null = null;
    if (currentDate.getDate() === 25) {
      notes = 'Horaires étendus pour Noël (9h-23h)';
    } else if (currentDate.getDate() === 31) {
      notes = 'Soirée spéciale Nouvel An (10h-2h)';
    }
    
    dates.push({
      jour: currentDate,
      is_open: isOpen,
      notes: notes,
    });
  }

  await prisma.parkDate.createMany({ data: dates });

  console.log('✅ Dates d\'ouverture créées (31 jours - décembre 2025)');

  // ===== PRICES =====
  const prices = await Promise.all([
    prisma.price.create({
      data: {
        label: 'Tarif Étudiant',
        type: 'ETUDIANT',
        amount: 29.99,
        duration_days: 1,
      },
    }),
    prisma.price.create({
      data: {
        label: 'Tarif Adulte',
        type: 'ADULTE',
        amount: 45.00,
        duration_days: 1,
      },
    }),
    prisma.price.create({
      data: {
        label: 'Tarif Groupe (10+ personnes)',
        type: 'GROUPE',
        amount: 35.00,
        duration_days: 1,
      },
    }),
    prisma.price.create({
      data: {
        label: 'Pass 2 jours',
        type: 'PASS_2J',
        amount: 79.99,
        duration_days: 2,
      },
    }),
    prisma.price.create({
      data: {
        label: 'Tarif Groupe Premium (20+ personnes)',
        type: 'GROUPE',
        amount: 30.00,
        duration_days: 1,
      },
    }),
  ]);

  console.log(`✅ Tarifs créés (${prices.length})`);

  // ===== RESERVATIONS =====
  const parkDate1 = await prisma.parkDate.findFirst({
    where: { is_open: true },
    orderBy: { jour: 'asc' },
  });

  if (!parkDate1) {
    throw new Error('Aucune date de parc ouverte trouvée');
  }

  const parkDate2 = await prisma.parkDate.findFirst({
    where: { 
      is_open: true,
      jour: { gt: parkDate1.jour }
    },
    orderBy: { jour: 'asc' },
  });

  if (!parkDate2) {
    throw new Error('Pas assez de dates de parc ouvertes trouvées');
  }

  await prisma.reservation.createMany({
    data: [
      {
        reservation_number: `ZL-${Date.now()}-A7F3B`,
        user_id: users[1].id, // jean
        date_id: parkDate1.id,
        price_id: prices[1].id, // Tarif Adulte
        tickets_count: 2,
        total_amount: 90.00, // 2 x 45.00
        status: 'CONFIRMED',
      },
      {
        reservation_number: `ZL-${Date.now() + 1}-B8G4C`,
        user_id: users[2].id, // marie
        date_id: parkDate2.id,
        price_id: prices[0].id, // Tarif Étudiant
        tickets_count: 1,
        total_amount: 29.99,
        status: 'PENDING',
      },
      {
        reservation_number: `ZL-${Date.now() + 2}-C9H5D`,
        user_id: users[1].id, // jean
        date_id: parkDate2.id,
        price_id: prices[3].id, // Pass 2 jours
        tickets_count: 1,
        total_amount: 79.99,
        status: 'CONFIRMED',
      },
      {
        reservation_number: `ZL-${Date.now() + 3}-D1J6E`,
        user_id: users[3].id, // paul
        date_id: parkDate1.id,
        price_id: prices[2].id, // Tarif Groupe (10+ personnes)
        tickets_count: 12,
        total_amount: 420.00, // 12 x 35.00
        status: 'CONFIRMED',
      },
    ],
  });

  console.log('✅ Réservations créées (4)');

  console.log('');
  console.log('🎉 Seeding terminé avec succès !');
  console.log('');
  console.log('📊 Résumé :');
  console.log('   - 4 utilisateurs (1 admin, 3 clients)');
  console.log('   - 5 catégories');
  console.log('   - 11 attractions');
  console.log('   - 11 images d\'attractions');
  console.log('   - 5 activités');
  console.log('   - 31 dates d\'ouverture (décembre 2025)');
  console.log('   - 5 tarifs (Étudiant, Adulte, Groupe x2, Pass 2J)');
  console.log('   - 4 réservations');
  console.log('');
  console.log('🔑 Credentials de test :');
  console.log('   Admin   : admin@zombieland.com / password123');
  console.log('   Client 1: jean@zombieland.com / password123');
  console.log('   Client 2: marie@zombieland.com / password123');
  console.log('   Client 3: paul@zombieland.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
