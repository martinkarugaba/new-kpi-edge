"use client";

import { THEMES } from "../lib/themes";
import { useThemeConfig } from "./active-theme";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ThemeSelector() {
  const { activeTheme, setActiveTheme } = useThemeConfig();

  return (
    <Select value={activeTheme} onValueChange={setActiveTheme}>
      <SelectTrigger
        size="sm"
        className="bg-background text-foreground w-32 border"
      >
        <SelectValue placeholder="Select a theme" />
      </SelectTrigger>
      <SelectContent align="end">
        {THEMES.map(theme => (
          <SelectItem key={theme.name} value={theme.value}>
            {theme.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
