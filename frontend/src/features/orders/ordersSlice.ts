import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AppDispatch } from '../../store';

export type Order = {
    id: string
    modelo: string
    estado: string
    combustible: number,
    temp: number,
    km: number,
    chofer: string
    tipo: string
    lastUpdate: string
};

export type HistoryEntry = {
    name: string;
    km: number;
    costo: number;
};

export type RadarEntry = {
    subject: string;
    A: number;
    fullMark: number;
};

interface OrdersState {
    orders: Order[];
    historyData: HistoryEntry[];
    radarData: RadarEntry[];
    loading: boolean;
    error: string | null;
}

const initialState: OrdersState = {
    orders: [],
    historyData: [],
    radarData: [],
    loading: false,
    error: null,
};

const MOCK_ORDERS: Order[] = [
    { id: 'V-001', modelo: 'Volvo FH16', estado: 'En Ruta', combustible: 78, temp: 85, km: 125000, chofer: 'Juan Pérez', tipo: 'Carga Pesada', lastUpdate: '10:05 AM' },
    { id: 'V-002', modelo: 'Scania R450', estado: 'Mantenimiento', combustible: 12, temp: 20, km: 340000, chofer: 'N/A', tipo: 'Carga Pesada', lastUpdate: '08:00 AM' },
    { id: 'V-003', modelo: 'Mercedes Actros', estado: 'En Ruta', combustible: 45, temp: 88, km: 98000, chofer: 'Ana Gómez', tipo: 'Refrigerado', lastUpdate: '10:15 AM' },
    { id: 'V-004', modelo: 'Iveco Stralis', estado: 'Disponible', combustible: 100, temp: 25, km: 12000, chofer: 'Carlos Ruiz', tipo: 'Reparto Urbano', lastUpdate: '09:30 AM' },
    { id: 'V-005', modelo: 'Volvo FH16', estado: 'En Ruta', combustible: 30, temp: 92, km: 210000, chofer: 'Luisa Mora', tipo: 'Carga Pesada', lastUpdate: '10:10 AM' },
    { id: 'V-006', modelo: 'Ford F-Max', estado: 'Incidencia', combustible: 60, temp: 105, km: 150000, chofer: 'Pedro Dias', tipo: 'Refrigerado', lastUpdate: '10:00 AM' },
];

const MOCK_HISTORY: HistoryEntry[] = [
    { name: 'Lun', km: 4000, costo: 2400 },
    { name: 'Mar', km: 3000, costo: 1398 },
    { name: 'Mie', km: 2000, costo: 9800 },
    { name: 'Jue', km: 2780, costo: 3908 },
    { name: 'Vie', km: 1890, costo: 4800 },
    { name: 'Sab', km: 2390, costo: 3800 },
    { name: 'Dom', km: 3490, costo: 4300 },
];

const MOCK_RADAR: RadarEntry[] = [
    { subject: 'Velocidad', A: 120, fullMark: 150 },
    { subject: 'Consumo', A: 98, fullMark: 150 },
    { subject: 'Carga', A: 86, fullMark: 150 },
    { subject: 'Tiempo', A: 99, fullMark: 150 },
    { subject: 'Seguridad', A: 85, fullMark: 150 },
    { subject: 'Mantenimiento', A: 65, fullMark: 150 },
];

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        setOrders(state, action: PayloadAction<Order[]>) { state.orders = action.payload; },
        setHistoryData(state, action: PayloadAction<HistoryEntry[]>) { state.historyData = action.payload; },
        setRadarData(state, action: PayloadAction<RadarEntry[]>) { state.radarData = action.payload; },
        setLoading(state, action: PayloadAction<boolean>) { state.loading = action.payload; },
        setError(state, action: PayloadAction<string | null>) { state.error = action.payload; },
    },
});

export const { setOrders, setHistoryData, setRadarData, setLoading, setError } = ordersSlice.actions;

// Thunk to load dashboard data from backend, fallback to mock data
export const fetchDashboardData = () => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/fleet/dashboard`);

        if (!res.ok) {
            console.log(res);
            throw new Error('Network error')
        };
        const data = await res.json();
        dispatch(setOrders(data.orders));
        dispatch(setHistoryData(data.historyData));
        dispatch(setRadarData(data.radarData));
        dispatch(setError(null));
    } catch (err) {
        // fallback to mock data
        dispatch(setOrders(MOCK_ORDERS));
        dispatch(setHistoryData(MOCK_HISTORY));
        dispatch(setRadarData(MOCK_RADAR));
        dispatch(setError('Using mock data due to error'));
    } finally {
        dispatch(setLoading(false));
    }
};

export default ordersSlice.reducer;