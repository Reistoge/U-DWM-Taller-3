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

const DetailView = ({ item, onClose }: any) => {
  console.log({ ...item });
  if (!item) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-sm">
      <div className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden animate-slide-up sm:animate-fade-in">
        <div className="bg-slate-900 p-6 flex justify-between items-start">
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

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-xs text-slate-500 block mb-1">Estado</span>
              <span
                className={`font-bold px-2 py-1 rounded text-xs ${
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
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-xs text-slate-500 block mb-1">
                Combustible
              </span>
              <div className="flex items-center gap-2">
                <Fuel size={16} className="text-orange-500" />
                <span className="font-bold text-slate-700">
                  {item.combustible}%
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-slate-800 border-b pb-2">
              Métricas en Tiempo Real
            </h3>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-600 flex items-center gap-2">
                <Activity size={16} /> Temperatura Motor
              </span>
              <span
                className={`font-mono font-bold ${
                  item.temp > 100 ? "text-red-500" : "text-slate-700"
                }`}
              >
                {item.temp}°C
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-600 flex items-center gap-2">
                <MapPin size={16} /> Kilometraje Total
              </span>
              <span className="font-mono font-bold text-slate-700">
                {item.km.toLocaleString()} km
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-600">Kilometraje Semanal</span>
              <span className="font-mono font-bold text-slate-700">
                {item.weeklyKm?.toLocaleString() || 0} km
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-600">Semana de inicio</span>
              <span className="font-mono font-bold text-slate-700">
              {item.weekStart ? new Date(item.weekStart).toLocaleDateString() : "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-600">Conductor Asignado</span>
              <span className="font-medium text-slate-800">{item.chofer}</span>
            </div>
          </div>

          {/* <div className="mt-4 pt-4 border-t text-center">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow transition-colors">
              Ver Historial Completo
            </button>
          </div> */}
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
    <div className="flex bg-slate-50 text-slate-800 font-sans min-h-screen">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className="flex-1 flex flex-col overflow-y-auto min-h-screen">
        <SearchComponent
          filterText={filterText}
          setFilterText={setFilterText}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
        {loading && <div className="p-4">Cargando datos...</div>}
        {error && <div className="p-4 text-red-500">{error}</div>}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">Detalle de Unidades</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold">
                <tr>
                  <th className="px-6 py-3">ID Unidad</th>
                  <th className="px-6 py-3">Modelo</th>
                  <th className="px-6 py-3">Estado</th>
                  <th className="px-6 py-3 text-center">Combustible</th>
                  <th className="px-6 py-3">Última Act.</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="hover:bg-blue-50/50 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {item.id}
                    </td>
                    <td className="px-6 py-4">{item.modelo}</td>
                    <td className="px-6 py-4">
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
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 justify-center">
                        <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${item.combustible < 20 ? "bg-red-500" : "bg-blue-500"}`}
                            style={{ width: `${item.combustible}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-slate-500">
                          {item.combustible}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {item.lastUpdate}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ChevronRight
                        size={16}
                        className="text-slate-300 group-hover:text-blue-500"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredData.length === 0 && (
              <div className="p-8 text-center text-slate-500">
                No se encontraron resultados para los filtros actuales.
              </div>
            )}
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
