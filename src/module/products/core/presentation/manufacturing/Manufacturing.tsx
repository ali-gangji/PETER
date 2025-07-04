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
  addMassOfElectronicComponent,
  addMassOfMaterial,
  removeMassOfElectronicComponent,
  removeMassOfMaterial,
  updateMassOfElectronicComponent,
  updateMassOfMaterial,
} from '../../domain/product.slice';
import { DefaultMaterialId } from '../../domain/entity/Material';
import NumberField from '../../../../../ui/components/NumberField';
import { DefaultElectronicComponentId } from '../../domain/entity/ElectronicalComponent';
import Section from '../../../../../ui/components/Section';
import { selectConfiguration } from '../../domain/configuration.selector';
import { selectCurrentProduct } from '../../domain/product.selector';
import { AppDispatchWithDI } from '../../../../shared/core/domain/store';

function Manufacturing() {
  const dispatch = useDispatch<AppDispatchWithDI>();
  const configuration = useSelector(selectConfiguration);
  const product = useSelector(selectCurrentProduct);

  const canDeleteMaterials = (): boolean => {
    return product.materialMassesBreakdownOfMechanicalParts.value.length > 1;
  };

  const canDeleteElectronicsComponents = (): boolean => {
    return product.componentMassesBreakdownOfElectronics.value.length > 1;
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
    <Section title="Manufacturing" canBeDisabled={false} enabled={true}>
      <div>
        <h3 className="text-lg font-semibold text-slate-800">
          Material breakdown of mechanical parts
        </h3>
        <Typography variant="body2" className="mt-1 text-slate-600">
          Please enter the rounded estimated masses (in kg) of parts composing
          your product by materials family.
        </Typography>
        <motion.div
          className="mt-6 space-y-4"
          variants={listContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {product.materialMassesBreakdownOfMechanicalParts.value.map(
              (massOfMaterial) => (
                <motion.div
                  key={massOfMaterial.id}
                  variants={listItemVariants}
                  exit="exit"
                  layout
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  whileHover={{ backgroundColor: 'rgba(230, 0, 45, 0.04)' }}
                  className="flex items-end space-x-4 p-2 rounded-lg"
                >
                  <FormControl fullWidth sx={formControlFocusStyles}>
                    <FormLabel>Material</FormLabel>
                    <Select
                      value={massOfMaterial.materialId}
                      onChange={(event) => {
                        dispatch(
                          updateMassOfMaterial({
                            id: massOfMaterial.id,
                            materialId: event.target.value,
                            mass: massOfMaterial.mass,
                          })
                        );
                      }}
                      MenuProps={{ sx: { '& .MuiMenuItem-root': menuItemStyles } }}
                    >
                      <MenuItem value={DefaultMaterialId}>
                        No selected material
                      </MenuItem>
                      {configuration.items.materials.map((material) => (
                        <MenuItem value={material.id} key={material.id}>
                          {material.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <div className="w-48">
                    <NumberField
                      id={`materialMass-${massOfMaterial.id}`}
                      fieldValue={massOfMaterial.mass}
                      label="Mass (kg)"
                      onChange={(value: number) => {
                        dispatch(
                          updateMassOfMaterial({
                            id: massOfMaterial.id,
                            materialId: massOfMaterial.materialId,
                            mass: value,
                          })
                        );
                      }}
                    />
                  </div>
                  {canDeleteMaterials() && (
                    <IconButton
                      aria-label="delete material"
                      onClick={() => {
                        dispatch(removeMassOfMaterial(massOfMaterial.id));
                      }}
                      sx={{ 
                        color: 'rgba(0, 0, 0, 0.54)', 
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': { 
                          backgroundColor: 'rgba(230, 0, 45, 0.08)', 
                          color: '#E6002D',
                          transform: 'translateY(-2px)'
                        } 
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
              onClick={() => dispatch(addMassOfMaterial())}
              startIcon={<AddCircleOutlineIcon />}
              sx={{ 
                backgroundColor: '#E6002D', 
                transition: 'all 0.2s ease-in-out',
                '&:hover': { 
                  backgroundColor: '#c00026',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                } 
              }}
            >
              Add Material
            </Button>
          </div>
        </motion.div>
      </div>

      <div className="mt-12">
        <h3 className="text-lg font-semibold text-slate-800">
          Component breakdown of Electronics
        </h3>
        <Typography variant="body2" className="mt-1 text-slate-600">
          Please enter the rounded estimated masses (in kg) of electronic
          components composing your product by component family.
        </Typography>
        <motion.div
          className="mt-6 space-y-4"
          variants={listContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {product.componentMassesBreakdownOfElectronics.value.map(
              (massOfComponent) => (
                <motion.div
                  key={massOfComponent.id}
                  variants={listItemVariants}
                  exit="exit"
                  layout
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  whileHover={{ backgroundColor: 'rgba(230, 0, 45, 0.04)' }}
                  className="flex items-end space-x-4 p-2 rounded-lg"
                >
                  <FormControl fullWidth sx={formControlFocusStyles}>
                    <FormLabel>Electronic component</FormLabel>
                    <Select
                      value={massOfComponent.componentId}
                      onChange={(event) => {
                        dispatch(
                          updateMassOfElectronicComponent({
                            id: massOfComponent.id,
                            componentId: event.target.value,
                            mass: massOfComponent.mass,
                          })
                        );
                      }}
                      MenuProps={{ sx: { '& .MuiMenuItem-root': menuItemStyles } }}
                    >
                      <MenuItem value={DefaultElectronicComponentId}>
                        No selected component
                      </MenuItem>
                      {configuration.items.electronicComponents.map(
                        (component) => (
                          <MenuItem value={component.id} key={component.id}>
                            {component.name}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </FormControl>
                  <div className="w-48">
                    <NumberField
                      id={`componentMass-${massOfComponent.id}`}
                      fieldValue={massOfComponent.mass}
                      label="Mass (kg)"
                      onChange={(value: number) => {
                        dispatch(
                          updateMassOfElectronicComponent({
                            id: massOfComponent.id,
                            componentId: massOfComponent.componentId,
                            mass: value,
                          })
                        );
                      }}
                    />
                  </div>
                  {canDeleteElectronicsComponents() && (
                    <IconButton
                      aria-label="delete component"
                      onClick={() => {
                        dispatch(
                          removeMassOfElectronicComponent(massOfComponent.id)
                        );
                      }}
                      sx={{ 
                        color: 'rgba(0, 0, 0, 0.54)',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': { 
                          backgroundColor: 'rgba(230, 0, 45, 0.08)', 
                          color: '#E6002D',
                          transform: 'translateY(-2px)'
                        } 
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
              onClick={() => dispatch(addMassOfElectronicComponent())}
              startIcon={<AddCircleOutlineIcon />}
              sx={{ 
                backgroundColor: '#E6002D', 
                transition: 'all 0.2s ease-in-out',
                '&:hover': { 
                  backgroundColor: '#c00026',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                } 
              }}
            >
              Add Component
            </Button>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

export default Manufacturing;