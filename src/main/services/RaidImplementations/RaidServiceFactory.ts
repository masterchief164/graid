import Raid0Service from './Raid0Serivice';

class RaidServiceFactory {
  static getRaidService(raidVersion: string) {
    switch (raidVersion) {
      case 'RAID 0':
        return new Raid0Service();
      // case 'RAID 1':
      //   return new Raid1Service();
      // case 'RAID 2':
      //   return new Raid2Service();
      // case 'RAID 5':
      //   return new Raid5Service();
      // case 'RAID 6':
      //   return new Raid6Service();
      // case 'RAID 10':
      //   return new Raid10Service();
      default:
        throw new Error('Invalid RAID version');
    }
  }
}

export default RaidServiceFactory;
