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
    <div className="flex flex-col gap-2">
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
            {sheets.map(sheet => (
              <SelectItem key={sheet} value={sheet}>
                {sheet}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isLoading && selectedSheet && (
          <div className="text-muted-foreground animate-pulse text-sm">
            Processing...
          </div>
        )}
      </div>

      {!selectedSheet && !isLoading && (
        <p className="text-muted-foreground text-sm">
          Please select a sheet to import
        </p>
      )}

      {selectedSheet && isLoading && (
        <div className="bg-muted/30 text-muted-foreground rounded-md p-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="bg-primary h-3 w-3 animate-pulse rounded-full"></div>
            <span>Processing sheet data, please wait...</span>
          </div>
        </div>
      )}
    </div>
  );
}
