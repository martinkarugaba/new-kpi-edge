import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value?: string | null;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  className?: string;
  disabled?: boolean;
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = 'Select an option',
  emptyMessage = 'No options found.',
  className,
  disabled = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  // Make sure value is a string and not null/undefined for comparison
  const safeValue = value || '';

  // Get the display label for the current value
  // First try to find by exact value match
  let selectedOption = options.find(option => option.value === safeValue);

  // If not found and the safeValue is not empty, also try to find by label match (for cases where the label was stored instead of value)
  if (
    !selectedOption &&
    safeValue &&
    safeValue !== 'none' &&
    safeValue !== ''
  ) {
    selectedOption = options.find(option => option.label === safeValue);
  }

  // Use the selected option's label if there is one, otherwise use placeholder
  let displayLabel = placeholder;
  if (selectedOption && safeValue !== 'none' && safeValue !== '') {
    displayLabel = selectedOption.label;
  } else if (safeValue && safeValue !== 'none' && safeValue !== '') {
    // If we have a value but no matching option, display the value itself
    displayLabel = safeValue;
  }

  // Debug logging
  console.log('ComboBox rendering with:', {
    value,
    safeValue,
    selectedOptionLabel: selectedOption?.label,
    displayLabel,
    isNone: safeValue === 'none',
  });

  return (
    <Popover open={open && !disabled} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between', className)}
          disabled={disabled}
        >
          {safeValue === 'none' ? placeholder : displayLabel}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder={placeholder} className="h-9" />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {options.map(option => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={currentValue => {
                    const selectedOption = options.find(
                      opt => opt.label === currentValue
                    );
                    if (selectedOption) {
                      onValueChange?.(
                        selectedOption.value === safeValue
                          ? ''
                          : selectedOption.value
                      );
                    }
                    setOpen(false);
                  }}
                  disabled={option.disabled}
                >
                  {option.label}
                  <Check
                    className={cn(
                      'ml-auto h-4 w-4',
                      safeValue === option.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
