import { ThemeToggle } from "./ui/theme-toggle";
import { Box } from "lucide-react";

export function Navbar() {
    return (
    <div className="flex justify-between items-center p-4">
      <div className="flex gap-2 items-center">
        <Box />
        <div className="font-bold text-2xl">Backpack</div>
        <div className="border-black border-[1px] dark:border-gray-200 px-2 py-1 rounded-3xl bg-gray-200 dark:bg-gray-700 text-sm">v1.3</div>
      </div>
      <div>
        <ThemeToggle />
      </div>
    </div>
    )
}