import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  Button,
  IconButton,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { motion, AnimatePresence } from 'framer-motion';
import { InUseMobilityType } from '../../domain/entity/InUseMobilityType';
import {
  selectCurrentProduct,
  selectInUseMobilityType,
} from '../../domain/product.selector';
import {
  inUseMobilityToggled,
  inUseMobilityTypeUpdated,
  loadMobilityEquipmentConfiguration,
  embeddedEquipmentMobilitySectorSelected,
  embeddedEquipmentMobilityPlatformModelSelected,
  embeddedEquipmentMobilityUsageOverridden,
  transportedEquipmentPayloadAdded,
  platformModelPayloadSectorSelected,
  platformModelForPayloadSelected,
  platformModelPayloadOverridden,
  platformModelPayloadRemoved,
} from '../../domain/product.slice';
import Section from '../../../../../ui/components/Section';
import { AppDispatchWithDI } from '../../../../shared/core/domain/store';
import NumberField from '../../../../../ui/components/NumberField';
import {
  DefaultEmbeddedPlatformModelId,
  DefaultSectorId,
} from '../../domain/entity/PlatformModel';

export interface RadioButtonEntry {
  value: string;
  label: string;
}

const mobilityTypes: RadioButtonEntry[] = [
  {
    value: InUseMobilityType.EMBEDDED,
    label: 'Platform-embedded movement',
  },
  {
    value: InUseMobilityType.TRANSPORTED,
    label: 'Platform-onboarded transportation',
  },
];

function InUseMobility() {
  const selectedMobilityType = useSelector(selectInUseMobilityType);
  const product = useSelector(selectCurrentProduct);
  const dispatch = useDispatch<AppDispatchWithDI>();

  useEffect(() => {
    dispatch(loadMobilityEquipmentConfiguration());
  }, [dispatch]);

  const embeddedSectors = useMemo(() => 
    [...new Set(product.inUseMobility.embedded.platformModels.map(p => p.sectorId))]
    .sort(), [product.inUseMobility.embedded.platformModels]);

  const transportedSectors = useMemo(() => 
    [...new Set(product.inUseMobility.transported.platformModels.map(p => p.sector))]
    .sort(), [product.inUseMobility.transported.platformModels]);

  const filteredEmbeddedModels = useMemo(() => {
    if (!product.inUseMobility.embedded.usage.sectorId || product.inUseMobility.embedded.usage.sectorId === DefaultSectorId) {
      return [];
    }
    return product.inUseMobility.embedded.platformModels.filter(
      (model) => model.sectorId === product.inUseMobility.embedded.usage.sectorId
    );
  }, [product.inUseMobility.embedded.platformModels, product.inUseMobility.embedded.usage.sectorId]);

  const listItemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { x: -50, opacity: 0, transition: { duration: 0.2 } },
  };

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
      title="In-use mobility"
      canBeDisabled
      enabled={product.inUseMobility.enabled}
      onToggle={() => dispatch(inUseMobilityToggled())}
    >
      <FormControl component="fieldset" sx={{ '& .MuiFormLabel-root.Mui-focused': { color: '#E6002D' } }}>
        <FormLabel component="legend" sx={{ mb: 1.5, color: 'text.primary', fontWeight: 'medium' }}>
          Please define the mobility type of your product
        </FormLabel>
        <RadioGroup
          row
          name="mobilityType"
          value={selectedMobilityType}
          onChange={(event) => dispatch(inUseMobilityTypeUpdated(event.target.value as InUseMobilityType))}
        >
          {mobilityTypes.map((type) => (
            <FormControlLabel
              key={type.value}
              value={type.value}
              control={
                <Radio sx={{ color: 'rgba(0, 0, 0, 0.54)', '&.Mui-checked': { color: '#E6002D' }, '&.Mui-focusVisible': { outline: '2px solid #E6002D', outlineOffset: '2px' } }} />
              }
              label={type.label}
            />
          ))}
        </RadioGroup>
      </FormControl>

      <AnimatePresence mode="wait">
        {selectedMobilityType === InUseMobilityType.EMBEDDED && (
          <motion.div
            key="embedded"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="mt-8 flex items-end space-x-4"
          >
            <FormControl fullWidth sx={formControlFocusStyles}>
              <FormLabel>Sector</FormLabel>
              <Select
                value={product.inUseMobility.embedded.usage.sectorId}
                onChange={(e) => dispatch(embeddedEquipmentMobilitySectorSelected(e.target.value))}
                MenuProps={{ sx: { '& .MuiMenuItem-root': menuItemStyles } }}
              >
                <MenuItem value={DefaultSectorId}>No selected sector</MenuItem>
                {embeddedSectors.map((sector) => (
                  <MenuItem key={sector} value={sector}>{sector}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={formControlFocusStyles}>
              <FormLabel>Platform Model</FormLabel>
              <Select
                value={product.inUseMobility.embedded.usage.platformModelId}
                onChange={(e) => dispatch(embeddedEquipmentMobilityPlatformModelSelected(e.target.value))}
                MenuProps={{ sx: { '& .MuiMenuItem-root': menuItemStyles } }}
                disabled={!product.inUseMobility.embedded.usage.sectorId || product.inUseMobility.embedded.usage.sectorId === DefaultSectorId}
              >
                <MenuItem value={DefaultEmbeddedPlatformModelId}>No selected model</MenuItem>
                {filteredEmbeddedModels.map((model) => (
                  <MenuItem key={model.id} value={model.id}>{model.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <div className="w-72">
              <NumberField
                id="embedded-usage"
                fieldValue={product.inUseMobility.embedded.usage.usage}
                label="Adjusted use"
                onChange={(value) => dispatch(embeddedEquipmentMobilityUsageOverridden(value))}
              />
            </div>
          </motion.div>
        )}

        {selectedMobilityType === InUseMobilityType.TRANSPORTED && (
          <motion.div
            key="transported"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="mt-8"
          >
            <div className="space-y-4">
              <AnimatePresence>
                {product.inUseMobility.transported.payloads.map((payload) => (
                  <motion.div
                    key={payload.id}
                    variants={listItemVariants}
                    animate="visible"
                    initial="hidden"
                    exit="exit"
                    className="grid grid-cols-[1fr_1fr_auto_auto] gap-4 items-end p-2 rounded-lg transition-colors duration-300 hover:bg-red-500/5"
                  >
                    <FormControl fullWidth sx={formControlFocusStyles}>
                      <FormLabel>Sector</FormLabel>
                      <Select
                        value={payload.sectorId}
                        onChange={(e) => dispatch(platformModelPayloadSectorSelected({ platformModelPayloadId: payload.id, sectorId: e.target.value }))}
                        MenuProps={{ sx: { '& .MuiMenuItem-root': menuItemStyles } }}
                      >
                        <MenuItem value={DefaultSectorId}>No selected sector</MenuItem>
                        {transportedSectors.map((sector) => (
                          <MenuItem key={sector} value={sector}>{sector}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl fullWidth sx={formControlFocusStyles}>
                      <FormLabel>Platform Model</FormLabel>
                      <Select
                        value={payload.platformModelId}
                        onChange={(e) => dispatch(platformModelForPayloadSelected({ platformModelPayloadId: payload.id, platformModelId: e.target.value }))}
                        MenuProps={{ sx: { '& .MuiMenuItem-root': menuItemStyles } }}
                        disabled={!payload.sectorId || payload.sectorId === DefaultSectorId}
                      >
                        <MenuItem value={DefaultSectorId}>No selected model</MenuItem>
                        {payload.filteredPlatformModels.map((model) => (
                          <MenuItem key={model.id} value={model.id}>{model.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <div className="w-56">
                      <NumberField
                        id={`transported-payload-${payload.id}`}
                        fieldValue={payload.payload}
                        label="Quantity of transportation units"
                        onChange={(value) => dispatch(platformModelPayloadOverridden({ platformModelPayloadId: payload.id, payload: value }))}
                      />
                    </div>
                    <IconButton
                      aria-label="delete transport leg"
                      onClick={() => dispatch(platformModelPayloadRemoved(payload.id))}
                      sx={{ color: 'rgba(0, 0, 0, 0.54)', transition: 'all 0.2s ease-in-out', '&:hover': { backgroundColor: 'rgba(230, 0, 45, 0.08)', color: '#E6002D', transform: 'translateY(-2px)' } }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div className="pt-4">
                <Button
                  variant="contained"
                  onClick={() => dispatch(transportedEquipmentPayloadAdded())}
                  startIcon={<AddCircleOutlineIcon />}
                  sx={{ backgroundColor: '#E6002D', transition: 'all 0.2s ease-in-out', '&:hover': { backgroundColor: '#c00026', transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' } }}
                >
                  Add Platform
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}

export default InUseMobility;