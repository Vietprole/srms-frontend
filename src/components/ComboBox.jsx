import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useVirtualizer } from '@tanstack/react-virtual';

const VirtualizedCommand = ({
  height,
  items,
  placeholder,
  selectedOption,
  onSelectOption,
}) => {
  const [filteredOptions, setFilteredOptions] = React.useState(items);
  const [focusedIndex, setFocusedIndex] = React.useState(0);
  const [isKeyboardNavActive, setIsKeyboardNavActive] = React.useState(false);

  const parentRef = React.useRef(null);

  const virtualizer = useVirtualizer({
    count: filteredOptions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
  });

  const virtualOptions = virtualizer.getVirtualItems();

  const scrollToIndex = (index) => {
    virtualizer.scrollToIndex(index, {
      align: 'center',
    });
  };

  const handleSearch = (search) => {
    setIsKeyboardNavActive(false);
    setFilteredOptions(
      items.filter((option) => option.label.toLowerCase().includes(search.toLowerCase() ?? [])),
    );
  };

  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault();
        setIsKeyboardNavActive(true);
        setFocusedIndex((prev) => {
          const newIndex = prev === -1 ? 0 : Math.min(prev + 1, filteredOptions.length - 1);
          scrollToIndex(newIndex);
          return newIndex;
        });
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        setIsKeyboardNavActive(true);
        setFocusedIndex((prev) => {
          const newIndex = prev === -1 ? filteredOptions.length - 1 : Math.max(prev - 1, 0);
          scrollToIndex(newIndex);
          return newIndex;
        });
        break;
      }
      case 'Enter': {
        event.preventDefault();
        if (filteredOptions[focusedIndex]) {
          onSelectOption?.(filteredOptions[focusedIndex].value);
        }
        break;
      }
      default:
        break;
    }
  };

  React.useEffect(() => {
    if (selectedOption) {
      const option = filteredOptions.find((option) => option.value === selectedOption);
      if (option) {
        const index = filteredOptions.indexOf(option);
        setFocusedIndex(index);
        virtualizer.scrollToIndex(index, {
          align: 'center',
        });
      }
    }
  }, [selectedOption, filteredOptions, virtualizer]);

  return (
    <Command shouldFilter={false} onKeyDown={handleKeyDown}>
      <CommandInput onValueChange={handleSearch} placeholder={placeholder} />
      <CommandList
        ref={parentRef}
        style={{
          height: height,
          width: '100%',
          overflow: 'auto',
        }}
        onMouseDown={() => setIsKeyboardNavActive(false)}
        onMouseMove={() => setIsKeyboardNavActive(false)}
      >
        <CommandEmpty>No item found.</CommandEmpty>
        <CommandGroup>
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {virtualOptions.map((virtualOption) => (
              <CommandItem
                key={filteredOptions[virtualOption.index].value}
                disabled={isKeyboardNavActive}
                className={cn(
                  'absolute left-0 top-0 w-full bg-transparent',
                  focusedIndex === virtualOption.index && 'bg-accent text-accent-foreground',
                  isKeyboardNavActive &&
                    focusedIndex !== virtualOption.index &&
                    'aria-selected:bg-transparent aria-selected:text-primary',
                )}
                style={{
                  height: `${virtualOption.size}px`,
                  transform: `translateY(${virtualOption.start}px)`,
                }}
                value={filteredOptions[virtualOption.index].value}
                onMouseEnter={() => !isKeyboardNavActive && setFocusedIndex(virtualOption.index)}
                onMouseLeave={() => !isKeyboardNavActive && setFocusedIndex(-1)}
                // onSelect={onSelectOption}
                  onSelect={() => onSelectOption(filteredOptions[virtualOption.index].value)}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    selectedOption === filteredOptions[virtualOption.index].value
                      ? 'opacity-100'
                      : 'opacity-0',
                  )}
                />
                {filteredOptions[virtualOption.index].label}
              </CommandItem>
            ))}
          </div>
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

// export function ComboBox({ placeholder = "", items, setItemId, initialItemId }) {
//   const [open, setOpen] = React.useState(false)
//   const [value, setValue] = React.useState(initialItemId)
//   console.log("comboBox items: ", items);
//   console.log("setItemId: ", setItemId);
//   console.log("initialItemId: ", initialItemId);

//   return (
//     <div className="flex">
//       <Popover open={open} onOpenChange={setOpen}>
//         <PopoverTrigger asChild>
//           <Button
//             variant="outline"
//             role="combobox"
//             aria-expanded={open}
//             className="w-fit min-w-[250px] justify-between"
//           >
//             {value !== null
//               ? items.find((item) => item.value == value)?.label
//               : placeholder}
//             <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-[200px] p-0">
//           <Command>
//             <CommandInput placeholder={`Tìm kiếm ${placeholder.toLowerCase()}...`} className="h-9" />
//             <CommandList>
//               <CommandEmpty>Không tìm thấy kết quả.</CommandEmpty>
//               <CommandGroup>
//                 {items.map((item) => (
//                   <CommandItem
//                     key={item.value}
//                     value={item.label}
//                     onSelect={() => {
//                       setValue(value === item.value ? null : item.value);
//                       setItemId(value === item.value ? null : item.value);
//                       setOpen(false);
//                     }}
//                   >
//                     {item.label}
//                     <Check
//                       className={cn(
//                         "ml-auto h-4 w-4",
//                         value === item.value ? "opacity-100" : "opacity-0"
//                       )}
//                     />
//                   </CommandItem>
//                 ))}
//               </CommandGroup>
//             </CommandList>
//           </Command>
//         </PopoverContent>
//       </Popover>
//     </div>
//   );
// }

export function ComboBox({
  placeholder = "",
  items,
  setItemId,
  initialItemId,
  width = '400px',
  height = '400px',
}) {
  const [open, setOpen] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState(initialItemId);
  console.log("comboBox items: ", items);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
          style={{
            width: width,
          }}
        >
          {/* {selectedOption ? items.find((option) => option === selectedOption) : placeholder} */}
          {selectedOption ? items.find((option) => option.value === selectedOption)?.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" style={{ width: width }}>
        <VirtualizedCommand
          height={height}
          // items={items.map((option) => ({ value: option, label: option }))}
          items={items}
          placeholder={placeholder}
          selectedOption={selectedOption}
          onSelectOption={(currentValue) => {
            setSelectedOption(currentValue === selectedOption ? '' : currentValue);
            setItemId(currentValue === selectedOption ? '' : currentValue);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}


