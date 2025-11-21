export interface Ticket {
  id: number;
  type: string;
  category: 'ADULTE' | 'ENFANT' | 'ÉTUDIANT' | 'SENIOR' | 'GROUPE';
  description: string;
  price: number;
  minAge?: number;
  maxAge?: number;
  conditions?: string;
  available: boolean;
}

export const ticketsMock: Ticket[] = [
  {
    id: 1,
    type: 'Billet Adulte',
    category: 'ADULTE',
    description: 'Accès complet au parc pour les adultes de 18 ans et plus',
    price: 45.00,
    minAge: 18,
    conditions: 'Valable pour une journée complète',
    available: true,
  },
  {
    id: 2,
    type: 'Billet Enfant',
    category: 'ENFANT',
    description: 'Accès complet au parc pour les enfants de 4 à 11 ans',
    price: 25.00,
    minAge: 4,
    maxAge: 11,
    conditions: 'Gratuit pour les moins de 4 ans. Présence d\'un adulte obligatoire',
    available: true,
  },
  {
    id: 3,
    type: 'Billet Adolescent',
    category: 'ENFANT',
    description: 'Accès complet au parc pour les adolescents de 12 à 17 ans',
    price: 35.00,
    minAge: 12,
    maxAge: 17,
    conditions: 'Valable pour une journée complète',
    available: true,
  },
  {
    id: 4,
    type: 'Billet Étudiant',
    category: 'ÉTUDIANT',
    description: 'Tarif réduit pour les étudiants (carte étudiante obligatoire)',
    price: 38.00,
    minAge: 18,
    maxAge: 25,
    conditions: 'Présentation de la carte étudiante en cours de validité obligatoire à l\'entrée',
    available: true,
  },
  {
    id: 5,
    type: 'Billet Senior',
    category: 'SENIOR',
    description: 'Tarif réduit pour les personnes de 65 ans et plus',
    price: 38.00,
    minAge: 65,
    conditions: 'Présentation d\'une pièce d\'identité obligatoire',
    available: true,
  },
  {
    id: 6,
    type: 'Billet Groupe (10+)',
    category: 'GROUPE',
    description: 'Tarif de groupe à partir de 10 personnes minimum',
    price: 40.00,
    conditions: 'Minimum 10 personnes. Réservation préalable obligatoire',
    available: true,
  },
  {
    id: 7,
    type: 'Pass VIP',
    category: 'ADULTE',
    description: 'Accès coupe-file + attractions premium + zone VIP',
    price: 89.00,
    minAge: 18,
    conditions: 'Accès prioritaire à toutes les attractions, boissons offertes',
    available: false, 
  },
];
