import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'seated' | 'completed';

export interface Reservation {
    id: string;
    name: string;
    phone: string;
    date: string;
    time: string;
    guests: number;
    status: ReservationStatus;
    createdAt: string;
}

interface ReservationStore {
    reservations: Reservation[];
    addReservation: (reservation: Omit<Reservation, 'id' | 'status' | 'createdAt'>) => void;
    updateStatus: (id: string, status: ReservationStatus) => void;
    deleteReservation: (id: string) => void;
}

export const useReservationStore = create<ReservationStore>()(
    persist(
        (set) => ({
            reservations: [],
            addReservation: (data) => set((state) => ({
                reservations: [
                    {
                        ...data,
                        id: uuidv4(),
                        status: 'pending',
                        createdAt: new Date().toISOString(),
                    },
                    ...state.reservations
                ]
            })),
            updateStatus: (id, status) => set((state) => ({
                reservations: state.reservations.map(r =>
                    r.id === id ? { ...r, status } : r
                )
            })),
            deleteReservation: (id) => set((state) => ({
                reservations: state.reservations.filter(r => r.id !== id)
            })),
        }),
        {
            name: 'tedsai-reservations-v2', // Changed name to reset any corrupt previous state
        }
    )
);
