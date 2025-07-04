import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { selectCurrentProduct } from '../../domain/product.selector';
import {
  recyclingToggled,
  recyclingTypeUpdated,
} from '../../domain/product.slice';
import { RecyclingType } from '../../domain/entity/RecyclingType';
import Section from '../../../../../ui/components/Section';
import { AppDispatchWithDI } from '../../../../shared/core/domain/store';

interface RecyclingRadioButtonEntry {
  value: string;
  label: string;
  description: string;
}

const recyclingTypes: RecyclingRadioButtonEntry[] = [
  {
    value: RecyclingType.TYPE_1,
    label: 'Average electronic equipment',
    description: 'Recycling treatment type 1',
  },
  {
    value: RecyclingType.TYPE_2,
    label: 'Average electronic equipment containing a cooling system',
    description: 'Recycling treatment type 2',
  },
];

function Recycling() {
  const product = useSelector(selectCurrentProduct);
  const dispatch = useDispatch<AppDispatchWithDI>();

  return (
    <Section
      title="Recycling"
      canBeDisabled
      onToggle={() => dispatch(recyclingToggled())}
      enabled={product.recycling.enabled}
    >
      <FormControl component="fieldset" sx={{ '& .MuiFormLabel-root.Mui-focused': { color: '#E6002D' } }}>
        <FormLabel component="legend" sx={{ mb: 1.5, color: 'text.primary', fontWeight: 'medium' }}>
          Please define the recycling type of your product
        </FormLabel>
        <RadioGroup
          value={product.recycling.type}
          name="recyclingType"
          onChange={(event) => {
            dispatch(
              recyclingTypeUpdated(
                event.target.value as RecyclingType
              )
            );
          }}
        >
          {recyclingTypes.map((recyclingType) => (
            <div key={recyclingType.value} className="mb-2">
              <FormControlLabel
                value={recyclingType.value}
                control={
                  <Radio
                    sx={{
                      color: 'rgba(0, 0, 0, 0.54)',
                      '&.Mui-checked': {
                        color: '#E6002D',
                      },
                    }}
                  />
                }
                label={recyclingType.label}
              />
              <Typography
                variant="caption"
                className="text-slate-500 block pl-8 -mt-1"
              >
                {recyclingType.description}
              </Typography>
            </div>
          ))}
        </RadioGroup>
      </FormControl>
    </Section>
  );
}

export default Recycling;
