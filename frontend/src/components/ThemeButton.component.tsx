import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../features/themeSlice";
import type { RootState } from "../store";
import { Moon, Sun } from "lucide-react";

function ThemeButton({ style }: { style?: string }) {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme.mode);
  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className={`p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors ${style}`}
    >
      {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
}

export default ThemeButton;
