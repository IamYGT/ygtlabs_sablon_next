"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme as useNextTheme } from "next-themes";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export { useTheme } from "next-themes";

export function ThemeToggle() {
    const { theme, setTheme } = useNextTheme();
    const { open: _open } = useSidebar();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="relative">
                <Sun className="h-4 w-4" />
            </Button>
        );
    }

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="relative transition-all duration-300 hover:scale-110 hover:bg-accent"
            title={theme === "dark" ? "Açık temaya geç" : "Koyu temaya geç"}
        >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Tema değiştir</span>
        </Button>
    );
}