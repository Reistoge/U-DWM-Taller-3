import { Menu } from "lucide-react";
import ThemeButton from "./ThemeButton.component";

function Topbar({
  setSidebarOpen,
}: {
  setSidebarOpen: (open: boolean) => void;
}) {
  return (
    <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 lg:px-8 shrink-0 transition-colors">
      <button
        className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={24} />
      </button>
      <div className="flex items-center gap-4 ml-auto">
        <div className="hidden md:block text-right">
          <p className="text-sm font-bold text-slate-700 dark:text-slate-200"> </p>
          <p className="text-xs text-slate-500 dark:text-slate-400"> </p>
        </div>
        <ThemeButton />
        {/* <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold border-2 border-indigo-200 dark:border-indigo-700">
          DM
        </div> */}
      </div>
    </header>
  );
}

export default Topbar;
