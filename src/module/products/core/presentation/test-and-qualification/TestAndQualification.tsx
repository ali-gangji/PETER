import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  Typography,
  Button,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { motion, AnimatePresence } from 'framer-motion';
import {
  energyUsedAtTestLocationAdded,
  energyUsedAtTestLocationRemoved,
  energyUsedAtTestLocationUpdated,
  testsAndQualificationsToggled,
} from '../../domain/product.slice';
import NumberField from '../../../../../ui/components/NumberField';
import { selectCurrentProduct } from '../../domain/product.selector';
import { selectConfiguration } from '../../domain/configuration.selector';
import { DefaultLocationId } from '../../domain/entity/TestLocation';
import Section from '../../../../../ui/components/Section';
import { AppDispatchWithDI } from '../../../../shared/core/domain/store';

function TestAndQualification() {
  const dispatch = useDispatch<AppDispatchWithDI>();
  const product = useSelector(selectCurrentProduct);
  const configuration = useSelector(selectConfiguration);

  const canDeleteTestLocations = (): boolean => {
    return product.energyUsedAtTestLocations.testLocations.length > 1;
  };

  // --- Animation Variants ---
  const listContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
      },
    },
  };

  const listItemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { x: -50, opacity: 0, transition: { duration: 0.2 } },
  };

  // --- Style Objects ---
  const formControlFocusStyles = {
    '& label.Mui-focused': { color: '#E6002D' },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#E6002D',
    },
  };

  const menuItemStyles = {
    '&:hover': { backgroundColor: 'rgba(230, 0, 45, 0.08)' },
    '&.Mui-selected': { backgroundColor: 'rgba(230, 0, 45, 0.12) !important' },
    '&.Mui-selected:hover': { backgroundColor: 'rgba(230, 0, 45, 0.16) !important' },
  };

  return (
    <Section
      title="Tests & qualification"
      canBeDisabled
      enabled={product.energyUsedAtTestLocations.enabled}
      onToggle={() => {
        dispatch(testsAndQualificationsToggled());
      }}
    >
      <Typography variant="body2" className="mt-1 text-slate-600">
        Energy consumed on site per product unit (e.g. satellite).
      </Typography>

      <motion.div
        className="mt-6 space-y-4"
        variants={listContainerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {product.energyUsedAtTestLocations.testLocations.map(
            (energyUsedAtTestLocation) => (
              <motion.div
                key={energyUsedAtTestLocation.id}
                variants={listItemVariants}
                exit="exit"
                layout
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                whileHover={{ backgroundColor: 'rgba(230, 0, 45, 0.04)' }}
                className="flex items-end space-x-4 p-2 rounded-lg"
              >
                <FormControl fullWidth sx={formControlFocusStyles}>
                  <FormLabel>Test location</FormLabel>
                  <Select
                    value={energyUsedAtTestLocation.testLocationId}
                    onChange={(event) => {
                      dispatch(
                        energyUsedAtTestLocationUpdated({
                          id: energyUsedAtTestLocation.id,
                          testLocationId: event.target.value,
                          energy: energyUsedAtTestLocation.energy,
                        })
                      );
                    }}
                    MenuProps={{ sx: { '& .MuiMenuItem-root': menuItemStyles } }}
                  >
                    <MenuItem value={DefaultLocationId}>
                      No selected location
                    </MenuItem>
                    {configuration.items.testLocations.map((location) => (
                      <MenuItem value={location.id} key={location.id}>
                        {location.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <div className="w-48">
                  <NumberField
                    id={`energy-${energyUsedAtTestLocation.id}`}
                    fieldValue={energyUsedAtTestLocation.energy}
                    label="Total energy (kWh)"
                    onChange={(value: number) => {
                      dispatch(
                        energyUsedAtTestLocationUpdated({
                          id: energyUsedAtTestLocation.id,
                          testLocationId:
                            energyUsedAtTestLocation.testLocationId,
                          energy: value,
                        })
                      );
                    }}
                  />
                </div>
                {canDeleteTestLocations() && (
                  <IconButton
                    aria-label="delete test location"
                    onClick={() => {
                      dispatch(
                        energyUsedAtTestLocationRemoved(
                          energyUsedAtTestLocation.id
                        )
                      );
                    }}
                    sx={{
                      color: 'rgba(0, 0, 0, 0.54)',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: 'rgba(230, 0, 45, 0.08)',
                        color: '#E6002D',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </motion.div>
            )
          )}
        </AnimatePresence>
        <div className="pt-4">
          <Button
            variant="contained"
            onClick={() => dispatch(energyUsedAtTestLocationAdded())}
            startIcon={<AddCircleOutlineIcon />}
            sx={{
              backgroundColor: '#E6002D',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: '#c00026',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              },
            }}
          >
            Add Test location
          </Button>
        </div>
      </motion.div>
    </Section>
  );
}

export default TestAndQualification;
