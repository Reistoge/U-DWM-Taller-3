import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchDashboardData, type Order } from "../features/orders/ordersSlice";
import type { RootState, AppDispatch } from "../store";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Truck, MapPin, Fuel, AlertTriangle } from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import SearchComponent from "../components/SearchComponent";
 

const CHART_COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
    <div>
      <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">
        {title}
      </p>
      <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
      {trend && (
        <span
          className={`text-xs ${trend > 0 ? "text-green-500" : "text-red-500"}`}
        >
          {trend > 0 ? "+" : ""}
          {trend}% vs ayer
        </span>
      )}
    </div>
    <div className={`p-3 rounded-full bg-opacity-10 ${color.bg} ${color.text}`}>
      <Icon size={24} />
    </div>
  </div>
);

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Order>();
  const [filterText, setFilterText] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");

  const dispatch = useDispatch<AppDispatch>();
  const orders = useSelector((state: RootState) => state.orders.orders);
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

  const statusData = useMemo(() => {
    const counts = filteredData.reduce(
      (acc, curr) => {
        acc[curr.estado] = (acc[curr.estado] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
    return Object.keys(counts).map((key) => ({
      name: key,
      value: counts[key],
    }));
  }, [filteredData]);

  const fuelData = filteredData.map((d) => ({
    name: d.id.slice(-6),
    combustible: d.combustible,
    temp: d.temp,
  }));

  const totalKm = filteredData.reduce((acc, curr) => acc + curr.km, 0);
  const totalKmFormatted = totalKm > 1000000 
    ? (totalKm / 1000000).toFixed(1) + 'M' 
    : totalKm > 1000 
    ? (totalKm / 1000).toFixed(1) + 'K' 
    : totalKm.toString();

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className="flex-1 flex flex-col overflow-hidden">
      <Topbar setSidebarOpen={setSidebarOpen} />
        {loading && <div className="p-4">Cargando datos...</div>}
        {error && <div className="p-4 text-red-500">{error}</div>}
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-8">
          {/* Header & Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                Panel de Control
              </h2>
              <p className="text-slate-500">
                Vista general de la flota en tiempo real
              </p>
            </div>

            {/* <div className="flex flex-col sm:flex-row gap-3 bg-white p-2 rounded-lg shadow-sm border border-slate-200">
              <div className="relative">
                <Search
                  className="absolute left-3 top-2.5 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Buscar unidad..."
                  className="pl-10 pr-4 py-2 bg-slate-50 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-48"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                />
              </div>
              <select
                className="px-4 py-2 bg-slate-50 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 border-none cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="Todos">Todos los estados</option>
                <option value="En Ruta">En Ruta</option>
                <option value="Disponible">Disponible</option>
                <option value="Mantenimiento">Mantenimiento</option>
              </select>
            </div> */}

            <SearchComponent
                filterText={filterText}
                setFilterText={setFilterText}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
            />
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Flota Activa"
              value={filteredData.filter((d) => d.estado === "En Ruta").length}
              icon={Truck}
              color={{ bg: "bg-blue-500", text: "text-blue-600" }}
              trend={5}
            />
            <StatCard
              title="Combustible Prom."
              value={`${Math.round(
                filteredData.reduce((acc, curr) => acc + curr.combustible, 0) /
                  (filteredData.length || 1)
              )}%`}
              icon={Fuel}
              color={{ bg: "bg-orange-500", text: "text-orange-600" }}
              trend={-2}
            />
            <StatCard
              title="Alertas Activas"
              value={filteredData.filter((d) => d.temp > 90).length}
              icon={AlertTriangle}
              color={{ bg: "bg-red-500", text: "text-red-600" }}
            />
            <StatCard
              title="Km Totales"
              value={totalKmFormatted}
              icon={MapPin}
              color={{ bg: "bg-green-500", text: "text-green-600" }}
              trend={12}
            />
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico 1: Estado de Flota (Pie) */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-700 mb-4">
                Distribución de Estados
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Gráfico 2: Combustible y Temperatura (Barra Compuesta/Mixta) */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-700 mb-4">
                Combustible vs Temperatura Motor
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={fuelData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: "8px" }} />
                    <Legend />
                    <Bar
                      dataKey="combustible"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                      name="Combustible (%)"
                    />
                    <Bar
                      dataKey="temp"
                      fill="#f97316"
                      radius={[4, 4, 0, 0]}
                      name="Temp (°C)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Gráfico 3: Área Chart (Historial) */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 lg:col-span-2">
              <h3 className="font-bold text-slate-700 mb-4">
                Rendimiento Semanal (Km Recorridos)
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historyData}>
                    <defs>
                      <linearGradient id="colorKm" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#8884d8"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#8884d8"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="km"
                      stroke="#8884d8"
                      fillOpacity={1}
                      fill="url(#colorKm)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Gráfico 4: Radar Chart (Performance General) */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-700 mb-4">
                Eficiencia Operativa
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    data={radarData}
                  >
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 150]} />
                    <Radar
                      name="Flota A"
                      dataKey="A"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Data Table */}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
