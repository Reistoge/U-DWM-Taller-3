import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchDashboardData, type Vehicle } from "../features/orders/ordersSlice";
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
  <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between transition-colors">
    <div>
      <p className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold tracking-wider">
        {title}
      </p>
      <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">{value}</h3>
      {trend && (
        <p className={`text-xs mt-1 ${trend > 0 ? "text-green-500" : "text-red-500"}`}>
          {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
        </p>
      )}
    </div>
    <div className={`p-3 rounded-full bg-opacity-10 ${color.bg} ${color.text}`}>
      <Icon size={24} />
    </div>
  </div>
);

function Dashboard() {
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
  const totalKmFormatted =
    totalKm > 1000000
      ? (totalKm / 1000000).toFixed(1) + "M"
      : totalKm > 1000
        ? (totalKm / 1000).toFixed(1) + "K"
        : totalKm.toString();

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans overflow-hidden transition-colors">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Topbar setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6">
          {/* Search */}
          <SearchComponent
            filterText={filterText}
            setFilterText={setFilterText}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />

          {/* Stats Grid */}
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

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
                Historial Semanal
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

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
                Estado de Flota
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

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
                Métricas de Rendimiento
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

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
                Combustible y Temperatura
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

          {/* Data Table */}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
