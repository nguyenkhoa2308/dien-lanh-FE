"use client";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md" | "lg";
}

export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "md",
}: QuantitySelectorProps) {
  const handleDecrease = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrease = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue)) {
      if (newValue < min) {
        onChange(min);
      } else if (newValue > max) {
        onChange(max);
      } else {
        onChange(newValue);
      }
    }
  };

  const sizeClasses = {
    sm: {
      button: "w-7 h-7",
      input: "w-10 h-7 text-sm",
      icon: "w-3 h-3",
    },
    md: {
      button: "w-9 h-9",
      input: "w-14 h-9 text-base",
      icon: "w-4 h-4",
    },
    lg: {
      button: "w-11 h-11",
      input: "w-16 h-11 text-lg",
      icon: "w-5 h-5",
    },
  };

  const classes = sizeClasses[size];

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={handleDecrease}
        disabled={value <= min}
        className={`${classes.button} flex items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
        aria-label="Giảm số lượng"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className={classes.icon}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
        </svg>
      </button>

      <input
        type="number"
        value={value}
        onChange={handleInputChange}
        min={min}
        max={max}
        className={`${classes.input} text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
        aria-label="Số lượng"
      />

      <button
        type="button"
        onClick={handleIncrease}
        disabled={value >= max}
        className={`${classes.button} flex items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
        aria-label="Tăng số lượng"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className={classes.icon}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </button>
    </div>
  );
}
