import { EquipmentMobilityConfigurationApi } from '../domain/ports/EquipmentMobilityConfigurationApi';
import { EquipmentMobilityConfiguration } from '../domain/entity/PlatformModel';

class InMemoryEquipmentMobilityConfigurationProvider
  implements EquipmentMobilityConfigurationApi
{
  async load(): Promise<EquipmentMobilityConfiguration> {
    return {
      embeddedPlatformModels: [
        {
          id: '1', // Kept original ID
          sectorId: 'RAIL', // New Hitachi Data
          name: 'Tramway',
          description: 'Urban light rail vehicle',
          defaultValue: {
            description: 'Adjusted use',
            value: 2000000,
          },
        },
        {
          id: '2', // Kept original ID
          sectorId: 'RAIL', // New Hitachi Data
          name: 'Urban',
          description: 'Urban metro/subway train',
          defaultValue: {
            description: 'Adjusted use',
            value: 4000000,
          },
        },
        {
          id: '3', // Kept original ID
          sectorId: 'RAIL', // New Hitachi Data
          name: 'Regional / intercity',
          description: 'Regional or intercity train',
          defaultValue: {
            description: 'Adjusted use',
            value: 7500000,
          },
        },
        {
          id: '4', // Kept original ID
          sectorId: 'RAIL', // New Hitachi Data
          name: 'Hi-speed',
          description: 'High-speed train',
          defaultValue: {
            description: 'Adjusted use',
            value: 12500000,
          },
        },
        {
          id: '5', // Kept original ID
          sectorId: 'GROUND CIVILIAN', // New Hitachi Data
          name: 'Urban bus - fuel/diesel/CNG',
          description: 'Urban bus with internal combustion engine',
          defaultValue: {
            description: 'Adjusted use',
            value: 1000000,
          },
        },
        {
          id: '6', // Kept original ID
          sectorId: 'GROUND CIVILIAN', // New Hitachi Data
          name: 'Urban bus - electric',
          description: 'Urban bus with electric motor',
          defaultValue: {
            description: 'Adjusted use',
            value: 1000000,
          },
        },
      ],
      transportedPlatformModels: [
        {
          id: 'tpm-1', // Kept original ID
          sector: 'RAIL', // New Hitachi Data
          name: 'Tramway',
          description: 'Transport by tramway',
          defaultValue: this.getDefaultRollling(),
        },
        {
          id: 'tpm-2', // Kept original ID
          sector: 'RAIL', // New Hitachi Data
          name: 'Urban',
          description: 'Transport by urban rail',
          defaultValue: this.getDefaultRollling(),
        },
        {
          id: 'tpm-10', // Kept original ID
          sector: 'RAIL', // New Hitachi Data
          name: 'Regional / intercity',
          description: 'Transport by regional/intercity rail',
          defaultValue: this.getDefaultRollling(),
        },
        {
          id: 'tpm-11', // Kept original ID
          sector: 'RAIL', // New Hitachi Data
          name: 'Hi-speed',
          description: 'Transport by high-speed rail',
          defaultValue: this.getDefaultRollling(),
        },
        {
          id: 'tpm-16', // Kept original ID
          sector: 'GROUND CIVILIAN', // New Hitachi Data
          name: 'Urban bus - fuel/diesel/CNG',
          description: 'Transport by urban bus (fuel)',
          defaultValue: this.getDefaultHauling(),
        },
        {
          id: 'tpm-17', // Kept original ID
          sector: 'GROUND CIVILIAN', // New Hitachi Data
          name: 'Urban bus - electric',
          description: 'Transport by urban bus (electric)',
          defaultValue: this.getDefaultHauling(),
        },
      ],
    };
  }

  private getDefaultFlight() {
    return {
      description: '1 hour flight',
      value: 1,
    };
  }

  private getDefaultHauling() {
    return {
      description: '100km hauling',
      value: 100,
    };
  }

  private getDefaultRollling() {
    return {
      description: '100km rolling',
      value: 100,
    };
  }

  private getDefaultBoating() {
    return {
      description: '24h boating',
      value: 24,
    };
  }
}

export default new InMemoryEquipmentMobilityConfigurationProvider();