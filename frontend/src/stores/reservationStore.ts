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
  time?: string;
  
  // Étape 3: Conditions générales
  acceptedTerms: boolean;
  
  // Étape 4: Informations client
  customerInfo?: CustomerInfo;
  
  // Étape 5: Adresse client
  customerAddress?: CustomerAddress;
  
  // Étape 6: Informations de paiement
  paymentInfo?: PaymentInfo;
  
  // Actions
  setTickets: (tickets: TicketSelection[], total: number) => void;
  setDate: (date: string | undefined) => void;
  setTime: (time: string | undefined) => void;
  setAcceptedTerms: (accepted: boolean) => void;
  setCustomerInfo: (info: CustomerInfo | undefined) => void;
  setCustomerAddress: (address: CustomerAddress | undefined) => void;
  setPaymentInfo: (info: PaymentInfo | undefined) => void;
  reset: () => void;
}

const initialState = {
  tickets: [],
  total: 0,
  acceptedTerms: false,
};

export const useReservationStore = create<ReservationStore>()(
  persist(
    (set) => ({
      ...initialState,
      
      setTickets: (tickets, total) => set({ tickets, total }),
      setDate: (date) => set({ date }),
      setTime: (time) => set({ time }),
      setAcceptedTerms: (acceptedTerms) => set({ acceptedTerms }),
      setCustomerInfo: (customerInfo) => set({ customerInfo }),
      setCustomerAddress: (customerAddress) => set({ customerAddress }),
      setPaymentInfo: (paymentInfo) => set({ paymentInfo }),
      reset: () => set(initialState),
    }),
    {
      name: 'reservation-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

