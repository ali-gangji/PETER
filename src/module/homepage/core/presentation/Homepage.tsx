import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box, Tabs, Tab } from '@mui/material';
import { motion } from 'framer-motion';
import { MathJaxContext, MathJax } from 'better-react-mathjax';
import Section from '../../../../ui/components/Section';

// --- MathJax Configuration ---
const config = {
  loader: { load: ["input/asciimath"] },
  asciimath: {
    delimiters: [["`", "`"]]
  }
};

// --- Tab Panel Component ---
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

// --- Main Homepage Component ---
function Homepage() {
  const [currentCategory, setCurrentCategory] = useState(0);
  const navigate = useNavigate();

  const handleCategoryChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentCategory(newValue);
  };

  const handleStartClick = () => {
    navigate('/evaluation');
  };

  const categoryDescriptions = [
    {
      label: 'Energy (E)',
      content: (
        <>
          <p>
            Impacts of operating energy (i.e. caused by its production in
            power plants) consumed by the equipment prevail over the other
            lifecycle aspects (e.g. manufacturing impacts).
          </p>
          <p className="mt-4">
            Energy consumption decrease should be targeted to reduce
            efficiently environmental impacts.
          </p>
        </>
      ),
    },
    {
      label: 'Material/Movement (M)',
      content: (
        <>
          <p>
            Impacts of the product movement in use (i.e. caused by
            vehicles) along the whole lifecycle overcome all other
            sources of impacts including the operating energy in use.
            Product mass decrease should be targeted to reduce efficiently
            environmental impacts.
          </p>
        </>
      ),
    },
    {
      label: 'Energy & Material (EM)',
      content: (
        <>
          <p>
            Impacts from both operating energy and movement are important.
          </p>
          <p className="mt-4">
            Both aspects from the use phase are to be considered in
            priority.
          </p>
        </>
      ),
    },
    {
      label: 'X',
      content: (
        <>
           <p>
            This case is expected to be quite rare in Thales. Impacts from
            use phase (related to operating energy and movement) are not
            predominant.
          </p>
          <p className="mt-4">
            Manufacturing process alternatives may be for instance relevant
            to decrease the impacts. Yet it does not mean that the use phase
            must be neglected or forgotten. It simply means environmental
            facts do not justify a priority action on those items.
          </p>
        </>
      ),
    },
  ];

  return (
    <MathJaxContext config={config}>
      <div>
        {/* --- START: Updated Hero Section --- */}
        <style>
            {`
                .hero-gradient-final {
                    background: linear-gradient(-45deg, #fdecec, #f8f9fa, #e9ecef, #fdecec);
                    background-size: 400% 400%;
                    animation: gradient-pan 25s ease infinite;
                }

                @keyframes gradient-pan {
                    0% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                    100% {
                        background-position: 0% 50%;
                    }
                }
            `}
        </style>
        <div className="hero-gradient-final w-full">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                // FIX: Removed text-center, added vertical padding
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20" 
            >
                <Typography 
                    variant="h3" 
                    component="h1" 
                    // FIX: Added text-left and adjusted font size for two lines
                    className="font-bold text-slate-800 drop-shadow-sm text-left"
                    sx={{ fontSize: '2.25rem', lineHeight: '2.75rem' }}
                >
                  Product Evaluation Tool <br /> for Ecodesign and Reporting
                </Typography>

                {/* FIX: Moved the button into the hero section */}
                <div className="mt-10">
                    <Button
                        variant="contained"
                        onClick={handleStartClick}
                        sx={{
                        backgroundColor: '#E6002D',
                        padding: '12px 32px',
                        fontSize: '1rem',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                            backgroundColor: '#c00026',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        },
                        }}
                    >
                        Start Categorizing your product
                    </Button>
                </div>
            </motion.div>
        </div>
        {/* --- END: Updated Hero Section --- */}

        {/* --- Main Content Container --- */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-12">
            {/* --- Objective Section --- */}
            <Section title="Objective" canBeDisabled={false} enabled={true}>
              <div className="space-y-4 text-slate-600">
                <p>
                  This method has been specifically set for Hitachi equipment to identify 
                  the main environmental stakes to be considered in an ecodesign strategy. 
                  The ultimate purpose of this method is to assign an environmental 
                  category to the product / system under study.
                </p>
                <p>
                  Since most people in a company context cannot apply or cannot afford 
                  formal Life Cycle Assessment (LCA) due to a lack of time, data, 
                  resources, or skills, this express method has been created to reach the 
                  same goal in a much more efficient manner.
                </p>
              </div>
            </Section>
            
            {/* --- Categories Section --- */}
            <Section title="Categories" canBeDisabled={false} enabled={true}>
              <Typography variant="body1" className="text-slate-600">
                The 4 categories are the following:
              </Typography>
              <Box sx={{ width: '100%', mt: 2 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs
                    value={currentCategory}
                    onChange={handleCategoryChange}
                    aria-label="Environmental Categories"
                    TabIndicatorProps={{ style: { backgroundColor: '#E6002D' } }}
                    sx={{
                      '& .Mui-selected': { color: '#E6002D !important' },
                      '& .MuiTab-root': { color: '#334155' },
                    }}
                  >
                    {categoryDescriptions.map((cat, index) => (
                      <Tab key={cat.label} label={cat.label} {...a11yProps(index)} />
                    ))}
                  </Tabs>
                </Box>
                {categoryDescriptions.map((cat, index) => (
                  <CustomTabPanel key={cat.label} value={currentCategory} index={index}>
                    <div className="space-y-4 text-slate-600">{cat.content}</div>
                  </CustomTabPanel>
                ))}
              </Box>
            </Section>

            {/* --- Example Section --- */}
            <Section title="Example" canBeDisabled={false} enabled={true}>
              <div className="space-y-4 text-slate-600">
                <MathJax>
                  <p className="font-semibold text-slate-700">Mechanics:</p>
                  <p>CO₂ emissions for material production and manufacturing operation of a 3kg steel cabinet will account for:</p>
                  <p className="my-2 p-4 bg-slate-50 rounded-md">`mCO2_Mecha = 3 xx m_Steel = 3 xx 3 = 9kgCO₂`</p>
                  
                  <p className="font-semibold text-slate-700 mt-4">Electronics:</p>
                  <p>for its 1kg PCBs production CO₂ will account for:</p>
                  <p className="my-2 p-4 bg-slate-50 rounded-md">`mCO2_PCB = 250 xx m_PCB = 250 xx 1 = 250kgCO₂`</p>

                  <p className="font-semibold text-slate-700 mt-4">Hardware:</p>
                  <p>at product level, total mass and production CO₂ impact can be estimated as follow</p>
                  <p className="my-2 p-4 bg-slate-50 rounded-md">`mHW = 3 + 1 = 4kg` and `mCO2_HW = 259kgCO₂`</p>

                  <p className="font-semibold text-slate-700 mt-4">Movement:</p>
                  <p>CO₂ emissions of an equipment regularly transported in a land vehicle along its 20 years of use will account for:</p>
                  <p className="my-2 p-4 bg-slate-50 rounded-md">`mCO2_MoveGroundVehicles = 80 xx mHW = 80 xx 4 = 320kgCO₂`</p>
                </MathJax>
                <h3 className="text-lg font-semibold text-slate-800 pt-4">Conclusion</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>In this case, if the real (or equivalent) power of the equipment is higher than this estimate, the energy consumption during the product use phase and the product mass should be addressed in priority. The product is categorized as "EM".</li>
                  <li>If the power is lower, movement impacts prevail. Mass reduction should be targeted at first. The product is then categorized as "M".</li>
                  <li>If the real (or equivalent) power of the equipment was higher than this estimate, the energy consumption during the product use phase should be addressed in priority. The product would be categorized as "E".</li>
                  <li>If the power was lower than this figure the product would be categorized as "X".</li>
                </ul>
              </div>
            </Section>

            {/* --- Method Basics Section --- */}
            <Section title="Method Basics" canBeDisabled={false} enabled={true}>
              <div className="space-y-6 text-slate-600">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">Methodology aspects</h3>
                  <p className="mt-2">Impacts estimates are calculated by using the same basic principles as in LCAs: data aggregating all direct and indirect quantified consumption and emissions of a given activity (e.g. 1kWh electricity supplied in Germany) or material (e.g. 1kg Steel production) are introduced in environmental models (E.g. IPCC/GIECC model on Climate Change) to define the contribution to this type of environmental impact. Those data generally cover a range of different context and lead to average data. Such typical "generic" data have been also completed where necessary by materials processing representative data.</p>
                  <p className="mt-2">Figures may greatly differ from one material to another. This is why formulas contain different factors for Steel, Aluminium, Polymers...This is also the case for the different vehicles type (Truck, Ship, Aircraft).</p>
                  <p className="mt-2">While relying on a quantitative approach, figures obtained with this method should not be seen as accurate estimates to be directly used for instance in external communication. Consider the following figures as orders of magnitude.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">Impact categories</h3>
                  <p className="mt-2">With difference to usual LCAs the only criterion used here is CO₂ and other greenhouse gases emissions. This choice has been made for the following reasons:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Global warming / climate change caused by increasing greenhouse gases anthropic emissions may bee seen as thee key environmental challenge: its effects will affect the whole planet on a very long term. Those dramatic consequences have lead to an unprecedented worldwide political awareness mobilization.</li>
                    <li>Homothetic impacts: a large part of those emissions result from fossil fuel combustion which induces simultaneously and in a proportional manner many other useful indirect indicator of mercury emissions!</li>
                    <li>Easiness: working with one single parameter is much more convenient than handling a series of environmental indicators for which no scientific hierarchy exists. Let's bee pragmatic.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">Electricity related issues</h3>
                  <MathJax inline>
                    <p className="mt-2">The "energy mix" factor (i.e. the respective part of each power plant type -nuclear, coal, hydraulic, solar...) reflects the world average value (`FElec = 0,437kgCO₂/KWh`). Products being usually not developed for one single national market, it is more realistic to consider a wider analysis scope.</p>
                  </MathJax>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-800">Recycling aspects:</h3>
                    <p className="mt-2">Data collected by French recycling organization Ecosystem reflect the average CO₂ emissions resulting from the successive treatment operations and the related logistics within borders and abroad until the final material preparation for reuse. Though they are based on a French data collection, they are only partly affected by the French energy mix (nuclear intensive and low carbon). This favorable bias is limited to electric processes in France while logistics (truck emissions) and treatment outside France are not concerned. Globally Ecosystem figures are then slightly underestimated if they were to be applied to another geographical area. To take into account this aspect, figures have been rounded up respectively for average electronic equipment data (0.802 rounded in 1gCO₂/g waster equipment) and average electronic equipment containing a fluid compressor based cooling system (0.934 rounded in 1.2kgCO₂/g waster equipment). Reminder: the topic addressed here is limited to CO₂. For other aspects pertaining to end of life (e.g. recyclability and subsequent limitation to material depletion), see specific tools such as Reecyce'lab.</p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-800">Sources</h3>
                    <p className="mt-2">Data used to set the formulas parameters have been mainly obtained from M Ashby (Materials and thee environment - BH / Elsevier - 2013) & French ADEME (Bilan produit)</p>
                </div>
              </div>
            </Section>
          </div>
        </div>
      </div>
    </MathJaxContext>
  );
}

export default Homepage;