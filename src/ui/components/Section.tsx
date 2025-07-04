import React from 'react';
import { Switch } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

type SectionProps = {
  title: string;
  canBeDisabled: boolean;
  enabled: boolean;
  onToggle?: () => void;
  children: React.ReactNode;
};

function Section({
  title,
  canBeDisabled,
  enabled,
  onToggle = () => {},
  children,
}: SectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white border border-slate-200/80 rounded-xl shadow-lg p-8"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          {title}
        </h2>
        {canBeDisabled && (
          <Switch
            id={`enable-section-${title}`}
            checked={enabled}
            onChange={onToggle}
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': {
                color: '#E6002D', // Hitachi Red
                '&:hover': {
                  backgroundColor: 'rgba(230, 0, 45, 0.08)',
                },
              },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                backgroundColor: '#E6002D', // Hitachi Red
              },
            }}
          />
        )}
      </div>
      <AnimatePresence>
        {enabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Section;
