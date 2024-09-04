import { getDb } from '../db/db';

const raidVersions = {
  'RAID 0': 2,
  'RAID 1': 2,
  'RAID 2': 3,
  'RAID 5': 3,
  'RAID 6': 4,
  'RAID 10': 4
};

type RaidVersionTypes = keyof typeof raidVersions;

export interface RaidConfig {
  raidVersion: RaidVersionTypes;
  blockSize: number;
}

const getRaidConfig = async (): Promise<RaidConfig> => {
  try {
    const db = getDb();
    return await db.get(`raidConfig`);
  } catch (error) {
    console.log('No raid config found, returning default');
    return { raidVersion: 'RAID 0', blockSize: 2 };
  }
};

const setRaidConfig = async (raidConfig: RaidConfig) => {
  const db = getDb();
  await db.put(`raidConfig`, raidConfig);
};

export { getRaidConfig, setRaidConfig };
