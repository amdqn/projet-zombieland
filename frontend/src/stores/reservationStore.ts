import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface TicketSelection {
  ticketId: number;
  quantity: number;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface CustomerAddress {
  address: string;
  city: string;
  zipCode: string;
  country: string;
}

export interface PaymentInfo {
  cardNumber: string;
  month: string;
  year: string;
  cvv: string;
}

interface ReservationStore {
  // Étape 1: Sélection des billets
  tickets: TicketSelection[];
  total: number;
  
  // Étape 2: Date et heure
  date?: string;
  dateId?: number; // ID de la date dans la base de données
  time?: string;
  
  // Étape 3: Conditions générales
  acceptedTerms: boolean;
  
  // Étape 4: Informations client
  customerInfo?: CustomerInfo;
  
  // Étape 5: Adresse client
  customerAddress?: CustomerAddress;
  
  // Étape 6: Informations de paiement
  paymentInfo?: PaymentInfo;
  
  // Réservations créées (pour affichage dans Step7OrderConfirmed)
  createdReservations?: Array<{
    reservation_number: string;
    price_id: number;
    tickets_count: number;
  }>;
  
  // Actions
  setTickets: (tickets: TicketSelection[], total: number) => void;
  setDate: (date: string | undefined, dateId?: number) => void;
  setTime: (time: string | undefined) => void;
  setAcceptedTerms: (accepted: boolean) => void;
  setCustomerInfo: (info: CustomerInfo | undefined) => void;
  setCustomerAddress: (address: CustomerAddress | undefined) => void;
  setPaymentInfo: (info: PaymentInfo | undefined) => void;
  setCreatedReservations: (reservations: Array<{ reservation_number: string; price_id: number; tickets_count: number }> | undefined) => void;
  reset: () => void;
}

const initialState = {
    tickets: [],
    total: 0,
    acceptedTerms: false,
    customerInfo: undefined,
    customerAddress: undefined,
    paymentInfo: undefined,
    createdReservations: undefined,
};

export const useReservationStore = create<ReservationStore>()(
  persist(
    (set) => ({
      ...initialState,
      
      setTickets: (tickets, total) => set({ tickets, total }),
      setDate: (date, dateId) => set({ date, dateId }),
      setTime: (time) => set({ time }),
      setAcceptedTerms: (acceptedTerms) => set({ acceptedTerms }),
      setCustomerInfo: (customerInfo) => set({ customerInfo }),
      setCustomerAddress: (customerAddress) => set({ customerAddress }),
      setPaymentInfo: (paymentInfo) => set({ paymentInfo }),
      setCreatedReservations: (createdReservations) => set({ createdReservations }),
      reset: () => set(initialState),
    }),
    {
      name: 'reservation-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

