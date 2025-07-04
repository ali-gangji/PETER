import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Button,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { motion, AnimatePresence } from 'framer-motion';
import { selectCurrentProduct } from '../../domain/product.selector';
import {
  inUsePowerConsumptionToggled,
  inUsePowerConsumptionUpdated,
  powerLevelAdded,
  powerLevelRemoved,
  powerLevelUpdated,
} from '../../domain/product.slice';
import NumberField from '../../../../../ui/components/NumberField';
import Section from '../../../../../ui/components/Section';
import { selectConfiguration } from '../../domain/configuration.selector';
import { AppDispatchWithDI } from '../../../../shared/core/domain/store';

function ElectricalPower() {
  const dispatch = useDispatch<AppDispatchWithDI>();
  const product = useSelector(selectCurrentProduct);
  const configuration = useSelector(selectConfiguration);

  const canDeletePowerLevel = (): boolean => {
    return product.inUsePowerConsumption.powerConsumptionBreakdown.powerLevels.length > 1;
  };

  // --- Animation Variants ---
  const listItemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { x: -50, opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <Section
      title="In-use power consumption"
      canBeDisabled
      enabled={product.inUsePowerConsumption.enabled}
      onToggle={() => {
        dispatch(inUsePowerConsumptionToggled());
      }}
    >
      <div>
        <h3 className="text-lg font-semibold text-slate-800">General Aspects</h3>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Card for Lifetime Input */}
          <div className="bg-slate-50/70 p-6 rounded-xl border border-slate-200 h-full">
            <NumberField
              id="lifetime"
              fieldValue={product.inUsePowerConsumption.lifetime}
              label="In-use lifetime (in hours)"
              onChange={(value: number) => {
                dispatch(
                  inUsePowerConsumptionUpdated({
                    lifetime: value,
                    powerSource: product.inUsePowerConsumption.powerSource,
                  })
                );
              }}
              caption="Default total is 20 years, i.e. 175200h"
            />
          </div>
          {/* Card for Power Source Selection */}
          <div className="bg-slate-50/70 p-6 rounded-xl border border-slate-200 h-full">
            {/* FIX: Moved the sx prop to the correct FormControl wrapper */}
            <FormControl component="fieldset" sx={{ '& .MuiFormLabel-root.Mui-focused': { color: '#E6002D' } }}>
              <FormLabel component="legend" sx={{ mb: 1, color: 'text.primary', fontWeight: 'medium' }}>
                Please define the electrical power source
              </FormLabel>
              <RadioGroup
                name="powerSource"
                value={product.inUsePowerConsumption.powerSource}
                onChange={(event) => {
                  dispatch(
                    inUsePowerConsumptionUpdated({
                      lifetime: product.inUsePowerConsumption.lifetime,
                      powerSource: event.target.value,
                    })
                  );
                }}
              >
                {configuration.items.powerSources.map((powerSource) => (
                  <div key={powerSource.id}>
                    <FormControlLabel
                      value={powerSource.id}
                      control={<Radio sx={{ color: 'rgba(0, 0, 0, 0.54)', '&.Mui-checked': { color: '#E6002D' } }} />}
                      label={powerSource.name}
                    />
                    <Typography variant="caption" className="text-slate-500 block pl-8 -mt-1">
                      {powerSource.description}
                    </Typography>
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-lg font-semibold text-slate-800">Power consumption breakdown overtime</h3>
        <div className="mt-4 space-y-3">
          <AnimatePresence>
            {product.inUsePowerConsumption.powerConsumptionBreakdown.powerLevels.map(
              (powerLevel) => (
                <motion.div
                  key={powerLevel.id}
                  variants={listItemVariants}
                  animate="visible"
                  initial="hidden"
                  exit="exit"
                  className="flex items-end justify-between p-2 rounded-lg transition-colors duration-300 hover:bg-red-500/5"
                >
                  <div className="flex items-end space-x-4">
                    <div className="w-48">
                      <NumberField
                        id={`power-${powerLevel.id}`}
                        fieldValue={powerLevel.power}
                        label="Power (W)"
                        onChange={(value: number) => {
                          dispatch(
                            powerLevelUpdated({
                              id: powerLevel.id,
                              power: value,
                              share: powerLevel.share,
                            })
                          );
                        }}
                      />
                    </div>
                    <div className="w-48">
                      <NumberField
                        id={`share-${powerLevel.id}`}
                        fieldValue={powerLevel.share}
                        label="Share (%)"
                        onChange={(value: number) => {
                          dispatch(
                            powerLevelUpdated({
                              id: powerLevel.id,
                              power: powerLevel.power,
                              share: value,
                            })
                          );
                        }}
                      />
                    </div>
                  </div>
                  {canDeletePowerLevel() && (
                    <IconButton
                      aria-label="delete power level"
                      onClick={() => {
                        dispatch(powerLevelRemoved(powerLevel.id));
                      }}
                      sx={{ color: 'rgba(0, 0, 0, 0.54)', transition: 'all 0.2s ease-in-out', '&:hover': { backgroundColor: 'rgba(230, 0, 45, 0.08)', color: '#E6002D', transform: 'translateY(-2px)' } }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </motion.div>
              )
            )}
          </AnimatePresence>
          <div className="pt-4 flex justify-between items-center">
            <Button
              variant="contained"
              onClick={() => dispatch(powerLevelAdded())}
              startIcon={<AddCircleOutlineIcon />}
              sx={{ backgroundColor: '#E6002D', '&:hover': { backgroundColor: '#c00026' } }}
            >
              Add Power level
            </Button>
            <div className="text-right font-medium text-slate-600">
              Total share: 
              <span className={product.inUsePowerConsumption.powerConsumptionBreakdown.shareTotal !== 100 ? 'text-red-500 font-bold' : 'text-green-600 font-bold'}>
                {' '}{product.inUsePowerConsumption.powerConsumptionBreakdown.shareTotal}%
              </span>
              <span className="mx-2 text-slate-300">|</span>
              Mean power: 
              <span className="font-bold text-slate-800">
                {' '}{product.inUsePowerConsumption.powerConsumptionBreakdown.meanPower.toFixed(2)} W
              </span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

export default ElectricalPower;
