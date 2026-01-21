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
    image_url: '/attractions-images/walking-dead-experience.jpg',
    thrill_level: 4,
    duration: 30,
    latitude: 48.8550,
    longitude: 2.3700,
    categoryIndex: 1, // Expériences immersives
  },
  {
    name: 'Zombie Ride',
    description: 'Montagnes russes extrêmes dans un décor post-apocalyptique',
    image_url: '/attractions-images/zombie-ride.jpg',
    thrill_level: 5,
    duration: 5,
    latitude: 48.8700,
    longitude: 2.3350,
    categoryIndex: 0, // Attractions extrêmes
  },
  {
    name: 'Labyrinthe des Infectés',
    description: 'Trouvez la sortie avant que les zombies ne vous rattrapent',
    image_url: '/attractions-images/labyrinthe-infectes.jpg',
    thrill_level: 2,
    duration: 20,
    latitude: 48.8450,
    longitude: 2.3800,
    categoryIndex: 2, // Activités familiales
  },
  {
    name: 'Arena des Morts-Vivants',
    description: 'Grand spectacle avec effets pyrotechniques et cascades',
    image_url: '/attractions-images/arena-morts-vivants.jpg',
    thrill_level: 3,
    duration: 45,
    latitude: 48.8575,
    longitude: 2.3525,
    categoryIndex: 3, // Spectacles
  },
  {
    name: 'Tour de la Chute Libre',
    description: 'Chute libre de 80 mètres dans une tour abandonnée infestée de zombies',
    image_url: '/attractions-images/tour-chute-libre.jpg',
    thrill_level: 5,
    duration: 3,
    latitude: 48.8680,
    longitude: 2.3850,
    categoryIndex: 0, // Attractions extrêmes
  },
  {
    name: 'Bunker VR Experience',
    description: 'Expérience en réalité virtuelle : survivez dans un bunker assiégé',
    image_url: '/attractions-images/bunker-vr.jpg',
    thrill_level: 4,
    duration: 15,
    latitude: 48.8650,
    longitude: 2.3250,
    categoryIndex: 1, // Expériences immersives
  },
  {
    name: 'Train Fantôme',
    description: 'Parcours en petit train à travers une ville ravagée par les zombies',
    image_url: '/attractions-images/train-fantome.jpg',
    thrill_level: 2,
    duration: 10,
    latitude: 48.8500,
    longitude: 2.3350,
    categoryIndex: 2, // Activités familiales
  },
  {
    name: 'Le Manège des Infectés',
    description: 'Carrousel thématique avec créatures zombies animées',
    image_url: '/attractions-images/manege-infectes.jpg',
    thrill_level: 1,
    duration: 5,
    latitude: 48.8480,
    longitude: 2.3250,
    categoryIndex: 2, // Activités familiales
  },
  {
    name: 'Survivor Arena Show',
    description: 'Spectacle interactif où le public vote pour les survivants',
    image_url: '/attractions-images/survivor-arena-show.jpg',
    thrill_level: 2,
    duration: 50,
    latitude: 48.8600,
    longitude: 2.3450,
    categoryIndex: 3, // Spectacles
  },
  {
    name: 'Pendule de la peur',
    description: 'Balancier géant à sensations fortes dans un décor industriel abandonné',
    image_url: '/attractions-images/pendule-peur.jpg',
    thrill_level: 5,
    duration: 4,
    latitude: 48.8700,
    longitude: 2.3750,
    categoryIndex: 0, // Attractions extrêmes
  },
  {
    name: 'Hôpital Hanté',
    description: 'Parcours terrifiant dans un hôpital contaminé avec acteurs zombies',
    image_url: '/attractions-images/hopital-hante.jpg',
    thrill_level: 4,
    duration: 25,
    latitude: 48.8520,
    longitude: 2.3600,
    categoryIndex: 1, // Expériences immersives
  },
  // ===== RESTAURATION =====
  {
    name: 'Le Cerveau Fumant',
    description: 'Restaurant gastronomique thématique proposant des plats raffinés dans une ambiance post-apocalyptique chic',
    image_url: '/restaurants-images/cerveaufumant.jpg',
    thrill_level: null,
    duration: null,
    latitude: 48.8570,
    longitude: 2.3550,
    categoryIndex: 4, // Restauration
  },
  {
    name: 'Burger des Morts',
    description: 'Fast-food proposant burgers, frites et grillades pour reprendre des forces entre deux attractions',
    image_url: '/restaurants-images/burgerdesmorts.jpg',
    thrill_level: null,
    duration: null,
    latitude: 48.8630,
    longitude: 2.3300,
    categoryIndex: 4, // Restauration
  },
  {
    name: 'La Sucrerie Infectée',
    description: 'Stand de confiseries, glaces et desserts thématiques pour les gourmands',
    image_url: '/restaurants-images/sucrerieinfectee.jpg',
    thrill_level: null,
    duration: null,
    latitude: 48.8460,
    longitude: 2.3650,
    categoryIndex: 4, // Restauration
  },
  {
    name: 'Café des Survivants',
    description: 'Café et boulangerie proposant boissons chaudes, viennoiseries et sandwichs pour une pause réconfortante',
    image_url: '/restaurants-images/cafesurvivants.jpg',
    thrill_level: null,
    duration: null,
    latitude: 48.8660,
    longitude: 2.3650,
    categoryIndex: 4, // Restauration
  },
  {
    name: 'Glaces du Bunker',
    description: 'Bar à glaces artisanales avec des parfums originaux et des toppings apocalyptiques',
    image_url: '/restaurants-images/glacebunker.jpg',
    thrill_level: null,
    duration: null,
    latitude: 48.8530,
    longitude: 2.3450,
    categoryIndex: 4, // Restauration
  },
  {
    name: 'Le Truck Contaminé',
    description: 'Food truck ambulant proposant hot-dogs, tacos et snacks à emporter partout dans le parc',
    image_url: '/restaurants-images/truck-contamine.jpg',
    thrill_level: null,
    duration: null,
    latitude: 48.8490,
    longitude: 2.3550,
    categoryIndex: 4, // Restauration
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
  await prisma.pointOfInterest.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();

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
          image_url: attraction.image_url,
          thrill_level: attraction.thrill_level,
          duration: attraction.duration,
          latitude: attraction.latitude,
          longitude: attraction.longitude,
          category_id: categories[attraction.categoryIndex].id,
        },
      }),
    ),
  );

  console.log(`✅ Attractions créées (${attractions.length})`);

  // ===== ACTIVITIES =====
  await prisma.activity.createMany({
    data: [
      {
        name: 'Escape Game Zombie',
        description: '60 minutes pour trouver le remède et sauver l\'humanité',
        image_url: '/activities-images/escape-game.jpg',
        thrill_level: 3,
        duration: 60,
        latitude: 48.8550,
        longitude: 2.3500,
        category_id: categories[1].id, // Expériences immersives
        attraction_id: attractions[0].id, // The Walking Dead Experience
      },
      {
        name: 'Laser Game Zombie',
        description: 'Affrontez les zombies en équipe avec des lasers',
        image_url: '/activities-images/laser-game.jpg',
        thrill_level: 3,
        duration: 30,
        latitude: 48.8670,
        longitude: 2.3800,
        category_id: categories[0].id, // Attractions extrêmes
        attraction_id: null,
      },
      {
        name: 'Atelier Maquillage Zombie',
        description: 'Transformez-vous en zombie avec nos maquilleurs professionnels',
        image_url: '/activities-images/maquillage.jpg',
        thrill_level: 1,
        duration: 20,
        latitude: 48.8510,
        longitude: 2.3280,
        category_id: categories[2].id, // Activités familiales
        attraction_id: null,
      },
      {
        name: 'Spectacle Survie',
        description: 'Show avec cascades et combats contre les zombies',
        image_url: '/activities-images/spectacle.jpg',
        thrill_level: 3,
        duration: 40,
        latitude: 48.8600,
        longitude: 2.3400,
        category_id: categories[3].id, // Spectacles
        attraction_id: null,
      },
      {
        name: 'Tir à l\'Arc Post-Apocalyptique',
        description: 'Entraînez-vous au tir à l\'arc sur des cibles zombies dans un décor post-apocalyptique',
        image_url: '/activities-images/tir-arc.jpg',
        thrill_level: 2,
        duration: 15,
        latitude: 48.8470,
        longitude: 2.3750,
        category_id: categories[2].id, // Activités familiales
        attraction_id: null,
      },
    ],
  });

  console.log('✅ Activités créées (5)');

  // ===== POINTS OF INTEREST =====
  await prisma.pointOfInterest.createMany({
    data: [
      // Toilettes
      {
        name: 'Toilettes Nord',
        type: 'toilets',
        description: 'Sanitaires situés près de la zone des attractions extrêmes',
        icon: 'restroom',
        latitude: 48.8690,
        longitude: 2.3280,
      },
      {
        name: 'Toilettes Sud',
        type: 'toilets',
        description: 'Sanitaires situés près de la zone familiale',
        icon: 'restroom',
        latitude: 48.8440,
        longitude: 2.3320,
      },
      // Boutiques
      {
        name: 'Boutique Survivor',
        type: 'shop',
        description: 'Boutique principale de souvenirs et produits dérivés',
        icon: 'shopping_bag',
        latitude: 48.8580,
        longitude: 2.3380,
      },
      {
        name: 'Armurerie du Parc',
        type: 'shop',
        description: 'Vente d\'accessoires et équipements de survie',
        icon: 'shopping_bag',
        latitude: 48.8610,
        longitude: 2.3720,
      },
      {
        name: 'Galerie des Infectés',
        type: 'shop',
        description: 'Boutique de figurines, vêtements et objets de collection',
        icon: 'shopping_bag',
        latitude: 48.8440,
        longitude: 2.3850,
      },
    ],
  });

  console.log('✅ Points d\'intérêt créés (5 : 2 toilettes, 3 boutiques)');

  // ===== PARK DATES =====
  const dates: Array<{
    jour: Date;
    is_open: boolean;
    open_hour: Date | null;
    close_hour: Date | null;
    notes: string | null;
  }> = [];
  
  // Générer dates de janvier à juin 2026
  let year = 2026;
  let month = 1;
  let day = 1;
  
  while (month <= 6) {
    const daysInMonth = new Date(year, month, 0).getDate();
    
    for (day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month - 1, day);
      
      // Fermé les lundis et mardis
      const dayOfWeek = currentDate.getDay();
      const isOpen = dayOfWeek !== 1 && dayOfWeek !== 2;
      
      let notes: string | null = null;
      let openHour: Date | null = null;
      let closeHour: Date | null = null;
      
      if (isOpen) {
        // Événements spéciaux
        if (month === 1 && day === 1) {
          notes = 'Nouvel An - Ouverture à midi';
          openHour = new Date('1970-01-01T12:00:00');
          closeHour = new Date('1970-01-01T22:00:00');
        } else if (month === 2 && day === 14) {
          notes = 'Saint-Valentin - Soirée spéciale';
          openHour = new Date('1970-01-01T10:00:00');
          closeHour = new Date('1970-01-02T00:00:00');
        } else if (month === 4 && day === 1) {
          notes = 'Poisson d\'avril - Animations surprise';
          openHour = new Date('1970-01-01T10:00:00');
          closeHour = new Date('1970-01-01T22:00:00');
        } else if (month === 5 && day === 1) {
          notes = 'Fête du Travail';
          openHour = new Date('1970-01-01T10:00:00');
          closeHour = new Date('1970-01-01T23:00:00');
        } else {
          // Horaires normaux : 10h-22h
          openHour = new Date('1970-01-01T10:00:00');
          closeHour = new Date('1970-01-01T22:00:00');
        }
      }
      
      dates.push({
        jour: currentDate,
        is_open: isOpen,
        open_hour: openHour,
        close_hour: closeHour,
        notes: notes,
      });
    }
    
    month++;
  }

  await prisma.parkDate.createMany({ data: dates });

  console.log(`✅ Dates d'ouverture créées (${dates.length} jours - janvier à juin 2026)`);

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

  // Créer des réservations avec le nouveau format tickets (JSON)
  await prisma.reservation.create({
    data: {
      reservation_number: `ZL-${Date.now()}-A7F3B`,
      user_id: users[1].id, // jean
      date_id: parkDate1.id,
      tickets: [
        {
          price_id: prices[1].id,
          label: 'Adulte',
          type: 'ADULT',
          quantity: 2,
          unit_price: 45.00,
          subtotal: 90.00,
        },
      ],
      total_amount: 90.00,
      status: 'CONFIRMED',
    },
  });

  await prisma.reservation.create({
    data: {
      reservation_number: `ZL-${Date.now() + 1}-B8G4C`,
      user_id: users[2].id, // marie
      date_id: parkDate2.id,
      tickets: [
        {
          price_id: prices[0].id,
          label: 'Étudiant',
          type: 'STUDENT',
          quantity: 1,
          unit_price: 29.99,
          subtotal: 29.99,
        },
      ],
      total_amount: 29.99,
      status: 'PENDING',
    },
  });

  await prisma.reservation.create({
    data: {
      reservation_number: `ZL-${Date.now() + 2}-C9H5D`,
      user_id: users[1].id, // jean
      date_id: parkDate2.id,
      tickets: [
        {
          price_id: prices[3].id,
          label: 'Pass 2 jours',
          type: 'PASS_2_DAYS',
          quantity: 1,
          unit_price: 79.99,
          subtotal: 79.99,
        },
      ],
      total_amount: 79.99,
      status: 'CONFIRMED',
    },
  });

  await prisma.reservation.create({
    data: {
      reservation_number: `ZL-${Date.now() + 3}-D1J6E`,
      user_id: users[3].id, // paul
      date_id: parkDate1.id,
      tickets: [
        {
          price_id: prices[2].id,
          label: 'Groupe (10+ personnes)',
          type: 'GROUP',
          quantity: 12,
          unit_price: 35.00,
          subtotal: 420.00,
        },
      ],
      total_amount: 420.00,
      status: 'CONFIRMED',
    },
  });

  console.log('✅ Réservations créées (4)');

  // ===== CONVERSATIONS & MESSAGES =====
  console.log('🗨️  Création des conversations et messages...');

  // Conversation 1 : Jean demande des infos sur les horaires
  const conversation1 = await prisma.conversation.create({
    data: {
      user_id: users[1].id, // Jean
      admin_id: users[0].id, // Admin
      status: 'OPEN',
      object: 'Demande d ouverture'
    },
  });

  await prisma.message.createMany({
    data: [
      {
        conversation_id: conversation1.id,
        sender_id: users[1].id, // Jean
        content: 'Bonjour, j\'aimerais savoir si le parc est ouvert le lundi 15 janvier ?',
        is_read: true,
        created_at: new Date('2026-01-10T10:30:00'),
      },
      {
        conversation_id: conversation1.id,
        sender_id: users[0].id, // Admin
        content: 'Bonjour Jean ! Non, le parc est fermé les lundis et mardis. Je vous conseille de venir le mercredi 16 janvier, nous sommes ouverts de 10h à 22h.',
        is_read: true,
        created_at: new Date('2026-01-10T10:45:00'),
      },
      {
        conversation_id: conversation1.id,
        sender_id: users[1].id, // Jean
        content: 'Parfait, merci ! Y a-t-il des réductions pour les groupes ?',
        is_read: true,
        created_at: new Date('2026-01-10T11:00:00'),
      },
      {
        conversation_id: conversation1.id,
        sender_id: users[0].id, // Admin
        content: 'Oui, nous avons un tarif groupe à 35€ pour 10 personnes minimum, et 30€ pour les groupes de 20+. N\'hésitez pas si vous avez d\'autres questions !',
        is_read: false,
        created_at: new Date('2026-01-10T11:15:00'),
      },
    ],
  });

  // Conversation 2 : Marie a perdu un objet
  const conversation2 = await prisma.conversation.create({
    data: {
      user_id: users[2].id, // Marie
      admin_id: users[0].id, // Admin
      status: 'CLOSED',
      object: 'Objet perdu'
    },
  });

  await prisma.message.createMany({
    data: [
      {
        conversation_id: conversation2.id,
        sender_id: users[2].id, // Marie
        content: 'Bonjour, j\'ai perdu mon écharpe lors de ma visite d\'hier dans la zone "The Walking Dead Experience". L\'avez-vous retrouvée ?',
        is_read: true,
        created_at: new Date('2026-01-08T14:20:00'),
      },
      {
        conversation_id: conversation2.id,
        sender_id: users[0].id, // Admin
        content: 'Bonjour Marie, je vérifie auprès de notre service des objets trouvés. Pouvez-vous me décrire votre écharpe ?',
        is_read: true,
        created_at: new Date('2026-01-08T14:35:00'),
      },
      {
        conversation_id: conversation2.id,
        sender_id: users[2].id, // Marie
        content: 'C\'est une écharpe rouge avec des motifs de zombies, assez longue. Je l\'avais achetée dans votre boutique.',
        is_read: true,
        created_at: new Date('2026-01-08T14:40:00'),
      },
      {
        conversation_id: conversation2.id,
        sender_id: users[0].id, // Admin
        content: 'Bonne nouvelle ! Nous avons retrouvé votre écharpe. Vous pouvez venir la récupérer à l\'accueil du parc avec une pièce d\'identité.',
        is_read: true,
        created_at: new Date('2026-01-08T15:00:00'),
      },
      {
        conversation_id: conversation2.id,
        sender_id: users[2].id, // Marie
        content: 'Super ! Merci beaucoup, je passe la récupérer demain.',
        is_read: true,
        created_at: new Date('2026-01-08T15:10:00'),
      },
    ],
  });

  // Conversation 3 : Paul demande une annulation
  const conversation3 = await prisma.conversation.create({
    data: {
      user_id: users[3].id, // Paul
      admin_id: users[0].id, // Admin
      status: 'OPEN',
      object: 'Renseignement sur les prix'
    },
  });

  await prisma.message.createMany({
    data: [
      {
        conversation_id: conversation3.id,
        sender_id: users[3].id, // Paul
        content: 'Bonjour, j\'ai réservé pour un groupe de 12 personnes mais finalement nous ne serons que 8. Puis-je modifier ma réservation ?',
        is_read: true,
        created_at: new Date('2026-01-12T09:00:00'),
      },
      {
        conversation_id: conversation3.id,
        sender_id: users[0].id, // Admin
        content: 'Bonjour Paul, pouvez-vous me communiquer votre numéro de réservation ?',
        is_read: true,
        created_at: new Date('2026-01-12T09:30:00'),
      },
      {
        conversation_id: conversation3.id,
        sender_id: users[3].id, // Paul
        content: 'Oui, c\'est la réservation ZL-1737021600000-D1J6E',
        is_read: false,
        created_at: new Date('2026-01-12T09:45:00'),
      },
    ],
  });

  // Conversation 4 : Jean demande des conseils d'attractions
  const conversation4 = await prisma.conversation.create({
    data: {
      user_id: users[1].id, // Jean (deuxième conversation)
      admin_id: users[0].id, // Admin
      status: 'OPEN',
      object: 'Attractions'
    },
  });

  await prisma.message.createMany({
    data: [
      {
        conversation_id: conversation4.id,
        sender_id: users[1].id, // Jean
        content: 'Salut ! Je viens avec ma famille (2 adultes, 2 enfants de 8 et 10 ans). Quelles attractions nous conseillez-vous ?',
        is_read: true,
        created_at: new Date('2026-01-13T16:00:00'),
      },
      {
        conversation_id: conversation4.id,
        sender_id: users[0].id, // Admin
        content: 'Bonjour Jean ! Pour une famille, je vous recommande le "Labyrinthe des Infectés" (niveau 2), le "Train Fantôme" et "Le Manège des Infectés". Évitez les attractions niveau 4-5 pour les enfants de cet âge.',
        is_read: true,
        created_at: new Date('2026-01-13T16:20:00'),
      },
      {
        conversation_id: conversation4.id,
        sender_id: users[1].id, // Jean
        content: 'Merci ! Et pour nous les parents, on peut faire les attractions extrêmes pendant que les enfants font autre chose ?',
        is_read: true,
        created_at: new Date('2026-01-13T16:25:00'),
      },
      {
        conversation_id: conversation4.id,
        sender_id: users[0].id, // Admin
        content: 'Bien sûr ! Nous avons un service de garderie "Bunker Kids" où vous pouvez laisser vos enfants pendant 1-2h. Ils feront des activités encadrées comme l\'Atelier Maquillage Zombie. Réservation conseillée !',
        is_read: false,
        created_at: new Date('2026-01-13T16:35:00'),
      },
    ],
  });

  // Conversation 5 : Marie demande des infos accessibilité
  const conversation5 = await prisma.conversation.create({
    data: {
      user_id: users[2].id, // Marie (deuxième conversation)
      admin_id: users[0].id, // Admin
      status: 'OPEN',
      object: 'Accessibilité PMR'
    },
  });

  await prisma.message.createMany({
    data: [
      {
        conversation_id: conversation5.id,
        sender_id: users[2].id, // Marie
        content: 'Bonjour, je viens avec une personne en fauteuil roulant. Le parc est-il accessible ?',
        is_read: true,
        created_at: new Date('2026-01-14T11:00:00'),
      },
      {
        conversation_id: conversation5.id,
        sender_id: users[0].id, // Admin
        content: 'Bonjour Marie ! Oui, tout le parc est accessible PMR. Certaines attractions ne sont pas accessibles pour des raisons de sécurité, mais environ 70% le sont. Vous pouvez consulter le plan d\'accessibilité sur notre site.',
        is_read: false,
        created_at: new Date('2026-01-14T11:15:00'),
      },
    ],
  });
  console.log('✅ Conversations créées (5)');
  console.log('✅ Messages créés (16 au total)');

  console.log('');
  console.log('🎉 Seeding terminé avec succès !');
  console.log('');
  console.log('📊 Résumé :');
  console.log('   - 4 utilisateurs (1 admin, 3 clients)');
  console.log('   - 5 catégories');
  console.log('   - 17 attractions avec GPS (dont 6 points de restauration)');
  console.log('   - 5 activités avec GPS');
  console.log('   - 5 points d\'intérêt (2 toilettes, 3 boutiques)');
  console.log('   - 181 dates d\'ouverture (janvier à juin 2026)');
  console.log('   - 5 tarifs (Étudiant, Adulte, Groupe x2, Pass 2J)');
  console.log('   - 4 réservations');
  console.log('');
  console.log('🗺️  Toutes les attractions ont des coordonnées GPS pour la carte interactive !');
  console.log('');
  console.log('🔑 Credentials de test :');
  console.log('   Admin   : admin@zombieland.com / password123');
  console.log('   Client 1: jean@zombieland.com / password123');
  console.log('   Client 2: marie@zombieland.com / password123');
  console.log('   Client 3: paul@zombieland.com / password123');
  console.log('');
  console.log('💬 Conversations :');
  console.log('   - 4 conversations ouvertes (OPEN)');
  console.log('   - 1 conversation fermée (CLOSED)');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
