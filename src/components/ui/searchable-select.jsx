"use client";

import * as React from "react";
import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

function SearchableSelect({
  value,
  onValueChange,
  options = [],
  placeholder,
  emptyText = "No results found",
  onOpenChange,
  onBlockedOpen,
  invalid = false,
  disabled = false,
  className,
  contentClassName,
}) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const containerRef = React.useRef(null);

  const setOpenState = React.useCallback(
    (next) => {
      setOpen(next);
      if (!next) setQuery("");
      onOpenChange?.(next);
    },
    [onOpenChange]
  );

  React.useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpenState(false);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [open, setOpenState]);

  const handleTriggerClick = () => {
    if (disabled) return;
    if (open) {
      setOpenState(false);
      return;
    }
    // Let the parent veto opening (e.g. a previous dropdown isn't selected yet)
    if (onBlockedOpen?.()) return;
    setOpenState(true);
  };

  const handleSelect = (nextValue) => {
    onValueChange?.(nextValue);
    setOpenState(false);
  };

  const selected = options.find((option) => option.value === value);
  const search = query.trim().toLowerCase();
  const filteredOptions = search
    ? options.filter((option) => option.label?.toLowerCase().includes(search))
    : options;

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          e.stopPropagation();
          setOpenState(false);
        }
      }}
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-invalid={invalid || undefined}
        disabled={disabled}
        data-state={open ? "open" : "closed"}
        data-placeholder={selected ? undefined : ""}
        onClick={handleTriggerClick}
        className={cn(
          "group text-[13px] sm:text-[12px] lg:text-[12px] 3xl:text-[16px] text-left h-[35px] sm:h-[30px] xl:h-[35px] 2xl:h-[40px] 3xl:h-[48px] border-input data-[placeholder]:text-[#404040] aria-invalid:border-destructive flex w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 shadow-none outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      >
        <span className="line-clamp-1">{selected ? selected.label : placeholder}</span>
        <svg
          width="11"
          height="6"
          viewBox="0 0 11 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="size-2 2xl:size-3 shrink-0 opacity-50 transition-transform duration-300 group-data-[state=open]:rotate-180"
        >
          <path d="M5.50002 6L10.2632 0.75H0.736877L5.50002 6Z" fill="#0F0F0F" />
        </svg>
      </button>

      {open && (
        <div
          className={cn(
            "absolute left-0 top-full z-50 mt-1 w-full min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
            contentClassName
          )}
        >
          <Command shouldFilter={false} className="h-auto">
            <CommandInput
              autoFocus
              value={query}
              onValueChange={setQuery}
              placeholder="Search..."
              className="text-[12px] 3xl:text-[16px]"
            />
            <CommandList>
              {filteredOptions.length === 0 ? (
                <div className="py-4 text-center text-[12px] 3xl:text-[16px]">{emptyText}</div>
              ) : (
                filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleSelect(option.value)}
                    className="text-[12px] 3xl:text-[16px] cursor-pointer justify-between hover:bg-base1/10"
                  >
                    <span>{option.label}</span>
                    {option.value === value && <CheckIcon className="size-4" />}
                  </CommandItem>
                ))
              )}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}

export { SearchableSelect };
