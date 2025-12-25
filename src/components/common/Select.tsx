"use client";

import { useState, useRef, useEffect, forwardRef } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (e: { target: { value: string; name?: string } }) => void;
  placeholder?: string;
  className?: string;
  containerClassName?: string;
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  name?: string;
  id?: string;
  size?: "sm" | "md" | "lg";
  "aria-label"?: string;
}

const Select = forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder,
      className = "",
      containerClassName = "",
      label,
      error,
      helperText,
      required,
      disabled,
      name,
      size = "md",
      "aria-label": ariaLabel,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);

    // Auto-select first option if no value provided
    const effectiveValue =
      value ?? (options.length > 0 ? options[0].value : "");
    const selectedOption = options.find((opt) => opt.value === effectiveValue);

    const sizeStyles = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-3 text-base",
      lg: "px-5 py-4 text-lg",
    };

    const dropdownItemSizes = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-3 text-base",
      lg: "px-5 py-4 text-lg",
    };

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          selectRef.current &&
          !selectRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (optionValue: string) => {
      if (onChange) {
        onChange({ target: { value: optionValue, name } });
      }
      setIsOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setIsOpen(!isOpen);
      } else if (e.key === "Escape") {
        setIsOpen(false);
      } else if (e.key === "ArrowDown" && isOpen) {
        e.preventDefault();
        const currentIndex = options.findIndex(
          (opt) => opt.value === effectiveValue
        );
        const nextIndex = Math.min(currentIndex + 1, options.length - 1);
        handleSelect(options[nextIndex].value);
      } else if (e.key === "ArrowUp" && isOpen) {
        e.preventDefault();
        const currentIndex = options.findIndex(
          (opt) => opt.value === effectiveValue
        );
        const prevIndex = Math.max(currentIndex - 1, 0);
        handleSelect(options[prevIndex].value);
      }
    };

    return (
      <div ref={ref} className={containerClassName}>
        {label && (
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div ref={selectRef} className={`relative ${className}`}>
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            onKeyDown={handleKeyDown}
            aria-label={ariaLabel}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            disabled={disabled}
            className={`
              w-full flex items-center justify-between gap-3
              bg-white border-2 rounded-xl font-medium
              transition-all duration-200 cursor-pointer
              ${sizeStyles[size]}
              ${
                disabled
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                  : ""
              }
              ${error ? "border-red-400 hover:border-red-500" : ""}
              ${
                !error && !disabled
                  ? "border-gray-200 hover:border-[var(--primary)] hover:shadow-sm"
                  : ""
              }
              ${
                isOpen && !error
                  ? "border-[var(--primary)] shadow-md ring-4 ring-[var(--primary)]/10"
                  : ""
              }
              ${
                isOpen && error
                  ? "border-red-500 shadow-md ring-4 ring-red-100"
                  : ""
              }
            `}
          >
            <span
              className={`truncate ${
                selectedOption ? "text-gray-900" : "text-gray-400"
              }`}
            >
              {selectedOption?.label || placeholder}
            </span>
            <ChevronDown
              className={`w-5 h-5 flex-shrink-0 transition-all duration-200 ${
                error
                  ? "text-red-400"
                  : isOpen
                  ? "text-[var(--primary)]"
                  : "text-gray-400"
              } ${isOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Dropdown */}
          <div
            className={`
              absolute z-50 w-full mt-2 bg-white border-2 border-gray-100 rounded-xl shadow-xl
              overflow-hidden transition-all duration-200 origin-top
              ${
                isOpen
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
              }
            `}
            role="listbox"
            aria-label={ariaLabel || label || "Select options"}
          >
            <div className="max-h-[200px] overflow-y-auto py-1">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={option.value === effectiveValue}
                  onClick={() => !option.disabled && handleSelect(option.value)}
                  disabled={option.disabled}
                  className={`
                    flex items-center justify-between w-full text-left
                    transition-all duration-150 cursor-pointer
                    ${dropdownItemSizes[size]}
                    ${option.disabled ? "text-gray-300 cursor-not-allowed" : ""}
                    ${
                      option.value === effectiveValue
                        ? "bg-gradient-to-r from-[var(--primary)]/10 to-[var(--primary)]/5 text-[var(--primary)] font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                    }
                  `}
                >
                  <span className="truncate">{option.label}</span>
                  {option.value === effectiveValue && (
                    <Check className="w-5 h-5 text-[var(--primary)] flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
