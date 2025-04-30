"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SheetSelectorProps {
  sheets: string[];
  selectedSheet: string;
  onSheetSelect: (sheetName: string) => void;
  isLoading?: boolean;
}

export function SheetSelector({
  sheets,
  selectedSheet,
  onSheetSelect,
  isLoading = false,
}: SheetSelectorProps) {
  if (sheets.length <= 1) return null;

  return (
    <div className="flex items-center gap-2">
      <Select
        value={selectedSheet}
        onValueChange={onSheetSelect}
        disabled={isLoading}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select a sheet" />
        </SelectTrigger>
        <SelectContent>
          {sheets.map((sheet) => (
            <SelectItem key={sheet} value={sheet}>
              {sheet}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {!selectedSheet && (
        <p className="text-sm text-muted-foreground">
          Please select a sheet to import
        </p>
      )}
    </div>
  );
}
