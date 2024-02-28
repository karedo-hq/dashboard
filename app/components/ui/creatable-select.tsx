import { cn } from '@/lib/utils/cn';
import CreatableSelectPrimitive from 'react-select/creatable';

export type CreatableSelectOption = {
  label: string;
  value: string;
};

type CreatableSelectProps = {
  options: CreatableSelectOption[];
  onValueChange: (newValue: string[] | string) => void;
  isMulti?: boolean;
  placeholder?: string;
  closeMenuOnSelect?: boolean;
};

export function CreatableSelect({
  options,
  onValueChange,
  isMulti,
  placeholder,
  closeMenuOnSelect = false,
}: CreatableSelectProps) {
  const handleChange = (newValue: CreatableSelectOption[] | CreatableSelectOption | null) => {
    if (newValue === null) {
      onValueChange(isMulti ? [] : '');
      return;
    }
    if (Array.isArray(newValue)) {
      onValueChange(newValue.map((option) => option.value));
    } else {
      onValueChange(newValue.value);
    }
  };

  return (
    <CreatableSelectPrimitive
      isMulti={isMulti}
      options={options}
      onChange={handleChange as any}
      placeholder={placeholder}
      closeMenuOnSelect={closeMenuOnSelect}
      unstyled
      styles={{
        option: (base) => ({
          ...base,
          fontSize: '0.875rem',
        }),
      }}
      classNames={{
        clearIndicator: ({ isFocused }) =>
          cn(
            isFocused ? 'text-slate-600' : 'text-slate-200',
            'p-2',
            isFocused ? 'hover:text-slate-800' : 'hover:text-slate-400',
          ),
        // container: () => cn(),
        control: ({ isDisabled, isFocused }) =>
          cn(
            isDisabled ? 'bg-slate-50' : 'bg-white',
            isDisabled ? 'border-slate-100' : isFocused ? 'border-blue-400' : 'border-slate-200',
            'rounded-md',
            'border-solid',
            'border',
            isFocused && 'shadow-[0_0_0_1px] shadow-blue-400',
            isFocused ? 'hover:border-blue-400' : 'hover:border-slate-300',
          ),
        dropdownIndicator: ({ isFocused }) =>
          cn(
            isFocused ? 'text-slate-500' : 'text-slate-400',
            'p-2',
            isFocused ? 'hover:text-slate-700' : 'hover:text-slate-500',
          ),
        group: () => cn('py-2'),
        groupHeading: () =>
          cn('text-slate-400', 'text-xs', 'font-medium', 'mb-1', 'px-3', 'uppercase'),
        // indicatorsContainer: () => cn(),
        indicatorSeparator: ({ isDisabled }) =>
          cn(isDisabled ? 'bg-slate-100' : 'bg-slate-200', 'my-2'),
        input: () => cn('m-0.5', 'py-0.5', 'text-slate-800'),
        loadingIndicator: ({ isFocused }) =>
          cn(isFocused ? 'text-slate-600' : 'text-slate-200', 'p-2'),
        loadingMessage: () => cn('text-slate-400', 'py-2', 'px-3'),
        menu: () => cn('bg-white', 'rounded', 'shadow-[0_0_0_1px_rgba(0,0,0,0.1)]', 'my-1'),
        menuList: () => cn('p-1'),
        // menuPortal: () => cn(),
        multiValue: () => cn('bg-slate-100', 'rounded-md py-1 px-2', 'm-0.5'),
        multiValueLabel: () => cn('rounded-sm', 'text-slate-800', 'text-sm', 'p-[3]', 'pl-[6]'),
        multiValueRemove: ({ isFocused }) =>
          cn(
            'rounded-sm',
            isFocused && 'bg-slate-500',
            'px-1',
            'ml-1',
            'hover:bg-slate-300',
            'hover:text-slate-800',
          ),
        noOptionsMessage: () => cn('text-slate-400', 'py-2', 'px-3'),
        option: ({ isDisabled, isFocused, isSelected }) =>
          cn(
            'text-sm',
            isSelected ? 'bg-slate-200' : isFocused ? 'bg-slate-100' : 'bg-transparent',
            isDisabled ? 'text-slate-200' : isSelected ? 'text-white' : 'text-slate-950',
            'py-2',
            'px-3',
            'rounded-md',
            !isDisabled && (isSelected ? 'active:bg-slate-200' : 'active:bg-slate-100'),
          ),

        placeholder: () => cn('text-slate-500 font-normal text-sm', 'mx-0.5'),
        singleValue: ({ isDisabled }) =>
          cn(isDisabled ? 'text-slate-400' : 'text-slate-700', 'mx-0.5'),
        valueContainer: () => cn('py-0.5', 'px-2'),
      }}
    />
  );
}
CreatableSelect.displayName = 'CreatableSelect';
