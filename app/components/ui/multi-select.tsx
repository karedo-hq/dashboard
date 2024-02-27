import * as React from 'react';

import { CheckIcon, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Badge } from './badge';
import { Button } from './button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from './command';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Typography } from './typography';

type Option = {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
};

type MultiSelectProps = {
  selected: string[];
  onValueChange: (newValue: string[]) => void;
  className?: string;
  placeholder?: string;
  options: Option[];
};

export function MultiSelect({
  selected,
  onValueChange,
  options,
  placeholder,
  className,
}: MultiSelectProps) {
  const selectedValues = new Set(selected);

  const handleSelect = (value: string) => {
    const updatedSelectedValues = new Set(selectedValues);
    if (updatedSelectedValues.has(value)) {
      updatedSelectedValues.delete(value);
    } else {
      updatedSelectedValues.add(value);
    }
    onValueChange(Array.from(updatedSelectedValues));
  };

  const handleClearFilters = () => {
    onValueChange([]);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            'flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950 dark:placeholder:text-gray-400 dark:focus:ring-gray-300 [&>span]:line-clamp-1',
            className,
          )}
        >
          {selectedValues.size > 0 ? (
            <div className="space-x-1">
              {options
                .filter((option) => selectedValues.has(option.value))
                .map((option) => (
                  <Badge key={option.value} variant="slate" className="rounded-sm px-1 font-normal">
                    {option.label}
                  </Badge>
                ))}
            </div>
          ) : (
            <Typography variant="paragraph" color="slate-500" className="font-normal">
              {placeholder || 'Select options...'}
            </Typography>
          )}

          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem key={option.value} onSelect={() => handleSelect(option.value)}>
                    <div
                      className={cn(
                        'border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible',
                      )}
                    >
                      <CheckIcon className={cn('h-4 w-4')} />
                    </div>
                    {option.icon && <option.icon className="text-muted-foreground mr-2 h-4 w-4" />}
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem onSelect={handleClearFilters} className="justify-center text-center">
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

MultiSelect.displayName = 'MultiSelect';
