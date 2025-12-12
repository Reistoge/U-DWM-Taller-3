import { Truck, LayoutDashboard, Database } from "lucide-react";
import { Link } from "react-router-dom";

function Sidebar({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}) {
  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 dark:bg-slate-950 text-white transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="p-6 flex items-center gap-3 border-b border-slate-700 dark:border-slate-800">
          <div className="bg-blue-500 p-2 rounded-lg">
            <Truck size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">DataMobile</h1>
            <span className="text-xs text-slate-400">Fleet Manager Pro</span>
          </div>
        </div>

        <nav className="p-4 space-y-2 mt-4">
          <Link className="font-medium" to="/">
            <button className="flex items-center gap-3 w-full p-3 text-slate-400 hover:text-white hover:bg-slate-800 dark:hover:bg-slate-900 rounded-lg transition-colors">
              <LayoutDashboard size={20} />
              Dashboard
            </button>
          </Link>

          <Link className="font-medium" to="/registers">
            <button className="flex items-center gap-3 w-full p-3 text-slate-400 hover:text-white hover:bg-slate-800 dark:hover:bg-slate-900 rounded-lg transition-colors">
              <Database size={20} />
              Registros
            </button>
          </Link>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
