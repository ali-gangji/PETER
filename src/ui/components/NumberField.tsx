import React, { useState, useEffect } from 'react';
import { FormControl, FormLabel, TextField, Typography } from '@mui/material';

type Props = {
  id: string;
  fieldValue: number;
  label: string;
  onChange: (newValue: number) => void;
  caption?: string;
  className?: string;
};

function NumberField({
  id,
  fieldValue,
  label,
  onChange,
  caption = '',
  className = '',
}: Props) {
  const [displayValue, setDisplayValue] = useState('');

  // Helper to format a number with thousand separators
  const formatNumber = (num: number) => {
    if (isNaN(num)) return '0';
    // toLocaleString handles both integers and decimals correctly.
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 20, // Allow many decimal places
    });
  };

  // Helper to remove formatting and get the raw number string
  const unformatNumber = (str: string) => {
    return str.replace(/,/g, '');
  };

  // When the component loads or the external value changes, format it for display
  useEffect(() => {
    // Only update if the new value is different from the current unformatted value
    if (parseFloat(unformatNumber(displayValue)) !== fieldValue) {
      setDisplayValue(formatNumber(fieldValue));
    }
  }, [fieldValue]);

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    // When the user clicks into the field, show the raw number for easy editing
    setDisplayValue(unformatNumber(event.target.value));
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    // When the user clicks away, format the number and update the parent state
    const numericValue = parseFloat(unformatNumber(event.target.value)) || 0;
    onChange(numericValue);
    setDisplayValue(formatNumber(numericValue));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // While typing, allow only valid numeric characters
    const rawValue = event.target.value;
    // Allow numbers and a single decimal point. Commas are handled by the formatter.
    if (/^[0-9.]*$/.test(unformatNumber(rawValue))) {
      if ((unformatNumber(rawValue).match(/\./g) || []).length <= 1) {
        setDisplayValue(rawValue);
      }
    }
  };

  return (
    <FormControl fullWidth>
      <FormLabel className={className}>{label}</FormLabel>
      <TextField
        id={id}
        className={className}
        type="text"
        inputMode="decimal"
        inputProps={{ style: { textAlign: 'center' } }}
        value={displayValue}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        sx={{
          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#E6002D',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#E6002D',
          },
        }}
      />
      {caption && (
        <Typography variant="caption" className={className}>
          {caption}
        </Typography>
      )}
    </FormControl>
  );
}

export default NumberField;