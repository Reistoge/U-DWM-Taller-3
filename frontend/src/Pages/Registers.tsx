import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchDashboardData,
  type Vehicle,
} from "../features/orders/ordersSlice";
import type { RootState, AppDispatch } from "../store";
import { Activity, MapPin, Fuel, X, ChevronRight } from "lucide-react";
import Sidebar from "../components/Sidebar";
import SearchComponent from "../components/SearchComponent";
import Topbar from "../components/Topbar";

const DetailView = ({ item, onClose }: any) => {
  if (!item) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden animate-slide-up sm:animate-fade-in">
        <div className="bg-slate-900 dark:bg-slate-950 p-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-white">{item.modelo}</h2>
            <p className="text-slate-400">ID: {item.id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white bg-white/10 p-2 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6 text-slate-800 dark:text-slate-100">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Estado</span>
              <span
                className={`font-bold px-2 py-1 rounded text-xs ${
                  item.estado === "En Ruta"
                    ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                    : item.estado === "Mantenimiento"
                      ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
                      : item.estado === "Incidencia"
                        ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                        : "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                }`}
              >
                {item.estado}
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
                Combustible
              </span>
              <div className="flex items-center gap-2">
                <Fuel size={16} className="text-orange-500" />
                <span className="font-bold text-slate-700 dark:text-slate-200">
                  {item.combustible}%
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-600 pb-2">
              Métricas en Tiempo Real
            </h3>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <Activity size={16} /> Temperatura Motor
              </span>
              <span
                className={`font-mono font-bold ${
                  item.temp > 100 ? "text-red-500" : "text-slate-700 dark:text-slate-200"
                }`}
              >
                {item.temp}°C
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <MapPin size={16} /> Kilometraje Total
              </span>
              <span className="font-mono font-bold text-slate-700 dark:text-slate-200">
                {item.km.toLocaleString()} km
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-600 dark:text-slate-400">Kilometraje Semanal</span>
              <span className="font-mono font-bold text-slate-700 dark:text-slate-200">
                {item.weeklyKm?.toLocaleString() || 0} km
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-600 dark:text-slate-400">Semana de inicio</span>
              <span className="font-mono font-bold text-slate-700 dark:text-slate-200">
                {item.weekStart ? new Date(item.weekStart).toLocaleDateString() : "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-600 dark:text-slate-400">Conductor Asignado</span>
              <span className="font-medium text-slate-800 dark:text-slate-100">{item.chofer}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function Registers() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Vehicle>();
  const [filterText, setFilterText] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");

  const dispatch = useDispatch<AppDispatch>();
  const orders = useSelector((state: RootState) => state.orders.vehicles);
  const historyData = useSelector(
    (state: RootState) => state.orders.historyData
  );
  const radarData = useSelector((state: RootState) => state.orders.radarData);
  const loading = useSelector((state: RootState) => state.orders.loading);
  const error = useSelector((state: RootState) => state.orders.error);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  const filteredData = useMemo(() => {
    return orders.filter((item) => {
      const matchesText =
        item.modelo.toLowerCase().includes(filterText.toLowerCase()) ||
        item.id.toLowerCase().includes(filterText.toLowerCase());
      const matchesStatus =
        statusFilter === "Todos" || item.estado === statusFilter;
      return matchesText && matchesStatus;
    });
  }, [orders, filterText, statusFilter]);

  return (
    <div className="flex bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans min-h-screen transition-colors">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className="flex-1 flex flex-col overflow-y-auto min-h-screen">
        <Topbar setSidebarOpen={setSidebarOpen} />
        <div className="p-4 lg:p-8 space-y-6">
          <SearchComponent
            filterText={filterText}
            setFilterText={setFilterText}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
          
          {/* Table/List Container */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors">
            {/* Table header */}
            <div className="bg-slate-50 dark:bg-slate-900 px-6 py-3 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-800 dark:text-slate-100">Detalle de Unidades</h3>
            </div>
            {/* Table rows */}
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredData.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-slate-900 dark:text-slate-100 font-medium">
                        {item.modelo}
                      </div>
                      <div className="text-slate-500 dark:text-slate-400 text-sm">
                        ID: {item.id}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          item.estado === "En Ruta"
                            ? "bg-green-100 text-green-700"
                            : item.estado === "Mantenimiento"
                              ? "bg-yellow-100 text-yellow-700"
                              : item.estado === "Incidencia"
                                ? "bg-red-100 text-red-700"
                                : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {item.estado}
                      </span>
                      <ChevronRight
                        size={16}
                        className="text-slate-300 group-hover:text-blue-500"
                      />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Fuel size={16} className="text-orange-500" />
                      <span className="text-slate-700 dark:text-slate-200 font-bold">
                        {item.combustible}%
                      </span>
                    </div>
                    <div className="text-slate-400 dark:text-slate-500 text-sm">
                      Última Act.: {item.lastUpdate}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <DetailView
        item={selectedItem}
        onClose={() => setSelectedItem(undefined)}
      />
    </div>
  );
}

export default Registers;
