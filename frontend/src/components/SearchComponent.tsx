import { Search } from "lucide-react";

function SearchComponent({
  filterText,
  setFilterText,
  statusFilter,
  setStatusFilter,
}: {
  filterText: string;
  setFilterText: (open: string) => void;
  statusFilter: string;
  setStatusFilter: (open: string) => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 bg-white p-2 rounded-lg shadow-sm border border-slate-200 dark:bg-slate-900 dark:border-slate-700 transition">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 text-slate-400 dark:text-slate-500" size={18} />
        <input
          type="text"
          placeholder="Buscar unidad..."
          className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-48"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>
      <select
        className="px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 border-none cursor-pointer"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="Todos">Todos los estados</option>
        <option value="En Ruta">En Ruta</option>
        <option value="Disponible">Disponible</option>
        <option value="Mantenimiento">Mantenimiento</option>
      </select>
    </div>
  );
    
}

export default SearchComponent;
