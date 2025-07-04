import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Grid, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { evaluationForProductComputed } from '../domain/evaluationVersions.slice';
import { mapFromProduct } from '../domain/mappers/EvaluatedProductMapper';
import PieChart from './PieChart';
import {
  selectCurrentProduct,
  selectEmbeddedPlatformModels,
  selectTransportedPlatformModels,
} from '../../../products/core/domain/product.selector';
import { selectEvaluationImpactsResult } from '../domain/evaluation.selector';
import DisplayCategory from './DisplayCategory';
import { selectConfiguration } from '../../../products/core/domain/configuration.selector';
import { InUseMobilityType } from '../../../products/core/domain/entity/InUseMobilityType';
import Subtitle from '../../../../ui/components/Subtitle';
import { loadEvaluationVersionList } from '../usecases/evaluation-version-list.query';
import { AppDispatchWithDI } from '../../../shared/core/domain/store';
import Section from '../../../../ui/components/Section';

function Evaluation() {
  const dispatch = useDispatch<AppDispatchWithDI>();
  const product = useSelector(selectCurrentProduct);
  const result = useSelector(selectEvaluationImpactsResult);
  const config = useSelector(selectConfiguration);
  const transportedPlatforms = useSelector(selectTransportedPlatformModels);
  const embeddedPlatforms = useSelector(selectEmbeddedPlatformModels);

  // State to manage the visibility of the error message
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    dispatch(loadEvaluationVersionList());
  }, [dispatch]);

  const displayLabel = (sectionName: string, labelId: string): string => {
    let name: string | undefined;
    switch (sectionName) {
      case 'Hardware mechanics':
        name = config.items.materials.find((m) => m.id === labelId)?.name;
        break;
      case 'Hardware electronics':
        name = config.items.electronicComponents.find((c) => c.id === labelId)?.name;
        break;
      case 'Tests & Qualification':
        name = config.items.testLocations.find((t) => t.id === labelId)?.name;
        break;
      case 'Recycling':
        name = config.items.recyclingTypes.find((r) => r.value === labelId)?.label;
        break;
      case 'In-use power consumption':
        name = config.items.powerSources.find((p) => p.id === labelId)?.name;
        name = name ? `Power source: ${name}` : name;
        break;
      case 'In-use mobility':
        if (product.inUseMobility.type === InUseMobilityType.EMBEDDED) {
          const platformModel = embeddedPlatforms.find(
            (p) => p.id === labelId
          );
          name = platformModel
            ? `${platformModel.sectorId} - ${platformModel.name}`
            : 'Label not found';
        } else if (product.inUseMobility.type === InUseMobilityType.TRANSPORTED) {
          const platformModel = transportedPlatforms.find(
            (p) => p.id === labelId
          );
          name = platformModel
            ? `${platformModel.sector} - ${platformModel.name}`
            : 'Label not found';
        }
        break;
      default:
        name = undefined;
    }
    return name || labelId;
  };
  
  // This function checks if any data has been entered in any section.
  const isProductEmpty = (): boolean => {
    const isManufacturingEmpty = 
      product.materialMassesBreakdownOfMechanicalParts.value.every(m => m.mass === 0) &&
      product.componentMassesBreakdownOfElectronics.value.every(c => c.mass === 0);

    return (
      isManufacturingEmpty &&
      !product.energyUsedAtTestLocations.enabled &&
      !product.inUseMobility.enabled &&
      !product.inUsePowerConsumption.enabled &&
      !product.recycling.enabled
    );
  };

  const handleCompute = () => {
    if (isProductEmpty()) {
      setShowError(true);
      // Hide the error message after 4 seconds
      setTimeout(() => setShowError(false), 4000);
    } else {
      setShowError(false);
      dispatch(
        evaluationForProductComputed({
          versionId: '1.0.0',
          product: mapFromProduct(product),
        })
      );
    }
  };

  const evaluationResult = result?.values?.[0];

  return (
    <Section title="Lifecycle CO₂ emissions" canBeDisabled={false} enabled={true}>
        <AnimatePresence>
          {showError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10, transition: { duration: 0.5 } }}
              transition={{ duration: 0.5 }}
              className="flex items-center p-4 mb-6 text-sm text-red-800 rounded-lg bg-red-50 border border-red-300"
              role="alert"
            >
              <ErrorOutlineIcon className="mr-3" />
              <span className="font-medium">
                Please enter data before computing results.
              </span>
            </motion.div>
          )}
        </AnimatePresence>

      <div className="flex justify-center my-8">
        <Button
          variant="contained"
          onClick={handleCompute}
          sx={{
            backgroundColor: '#E6002D',
            padding: '12px 32px',
            fontSize: '1rem',
            '&:hover': {
              backgroundColor: '#c00026',
            },
          }}
        >
          Compute
        </Button>
      </div>

      {evaluationResult && evaluationResult.total > 0 && !showError ? (
        <motion.div
          key="results"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mt-8">
            <Subtitle label="CO₂ emissions data" />
            <div className="overflow-x-auto">
              <table className="w-full mt-2 text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-200">
                    <th className="p-3 text-left font-semibold text-slate-700">Impact</th>
                    <th className="p-3 text-left font-semibold text-slate-700">Details</th>
                    <th className="p-3 text-right font-semibold text-slate-700">Value</th>
                    <th className="p-3 text-right font-semibold text-slate-700">Emission Factor</th>
                    <th className="p-3 text-right font-semibold text-slate-700">CO₂ Emissions (kg)</th>
                  </tr>
                </thead>
                <tbody>
                  {evaluationResult.impacts.map((impact) =>
                    impact.details.map((detail, index) => (
                      <tr key={detail.labelId + index} className="border-b border-slate-200">
                        <td className="p-3 align-top font-medium text-slate-600 whitespace-nowrap">
                          {index === 0 ? impact.name : ''}
                        </td>
                        <td className="p-3">{displayLabel(impact.name, detail.labelId)}</td>
                        <td className="p-3 text-right whitespace-nowrap">{detail.quantity.value} {detail.quantity.unit}</td>
                        <td className="p-3 text-right">{detail.factor?.toFixed(2)}</td>
                        <td className="p-3 text-right font-medium">{detail.impact.value.toFixed(2)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <footer className="mt-4 flex w-full justify-end">
                <div className="text-right p-2">
                    <Typography variant="body1" component="p" className="font-bold text-slate-800">
                        Total: {evaluationResult.total.toFixed(2)} kg CO₂e
                    </Typography>
                </div>
            </footer>
          </div>

          <Grid container spacing={4} className="mt-8">
            <Grid item xs={12} md={6}>
              <Subtitle label="Graphical restitution" />
              <PieChart result={evaluationResult} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Subtitle label="Categorization" />
              <DisplayCategory category={evaluationResult.category} />
            </Grid>
          </Grid>
        </motion.div>
      ) : (
        <div className="text-center py-8">
          <p className="text-slate-500">
            Click the "Compute" button to see the results.
          </p>
        </div>
      )}
    </Section>
  );
}

export default Evaluation;