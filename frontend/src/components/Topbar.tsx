import { Menu } from "lucide-react";

function Topbar({ setSidebarOpen }: { setSidebarOpen: (open: boolean) => void }) {
    return (  <>  <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0">
    <button
      className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-md"
      onClick={() => setSidebarOpen(true)}
    >
      <Menu size={24} />
    </button>
    <div className="flex items-center gap-4 ml-auto">
      <div className="hidden md:block text-right">
        <p className="text-sm font-bold text-slate-700"> </p>
        <p className="text-xs text-slate-500"> </p>
      </div>
      <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold border-2 border-indigo-200">
        DM
      </div>
    </div>
  </header></>);
}

export default Topbar;