"use client";

import { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
  size?: "sm" | "md" | "lg";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      containerClassName = "",
      className = "",
      required,
      id,
      size = "md",
      ...props
    },
    ref
  ) => {
    const inputId = id || props.name;

    const sizeStyles = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-3 text-base",
      lg: "px-5 py-4 text-lg",
    };

    const iconSizes = {
      sm: "left-2.5",
      md: "left-4",
      lg: "left-5",
    };

    const baseInputStyles = `
      w-full bg-white border-2 rounded-xl
      font-medium text-gray-900 placeholder:text-gray-400 placeholder:font-normal
      transition-all duration-200 ease-out
      hover:border-[var(--primary)]/50 hover:shadow-sm
      focus:outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 focus:shadow-md
      disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:shadow-none
    `;

    const stateStyles = error
      ? "border-red-400 bg-red-50/50 hover:border-red-500 focus:border-red-500 focus:ring-red-100"
      : "border-gray-200";

    const iconPaddingLeft = leftIcon
      ? size === "sm"
        ? "pl-9"
        : size === "lg"
          ? "pl-14"
          : "pl-11"
      : "";
    const iconPaddingRight = rightIcon
      ? size === "sm"
        ? "pr-9"
        : size === "lg"
          ? "pr-14"
          : "pr-11"
      : "";

    return (
      <div className={containerClassName}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative group">
          {leftIcon && (
            <div
              className={`absolute ${iconSizes[size]} top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                error
                  ? "text-red-400 group-hover:text-red-500"
                  : "text-gray-400 group-hover:text-[var(--primary)] group-focus-within:text-[var(--primary)]"
              }`}
            >
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={`${baseInputStyles} ${sizeStyles[size]} ${stateStyles} ${iconPaddingLeft} ${iconPaddingRight} ${className}`}
            required={required}
            {...props}
          />

          {rightIcon && (
            <div
              className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                error
                  ? "text-red-400 group-hover:text-red-500"
                  : "text-gray-400 group-hover:text-[var(--primary)] group-focus-within:text-[var(--primary)]"
              }`}
            >
              {rightIcon}
            </div>
          )}
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

Input.displayName = "Input";

export default Input;
