import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { LocationsService } from '../locations/locations.service';
import { Logger } from '@nestjs/common';

/**
 * Seed script to populate database with initial data
 */
async function seedDatabase() {
  const logger = new Logger('DatabaseSeeder');
  logger.log('Starting database seeding...');

  const app = await NestFactory.createApplicationContext(AppModule);
  const locationsService = app.get(LocationsService);

  try {
    // Create buildings
    logger.log('Creating Building A...');
    const buildingA = await locationsService.create({
      name: 'Building A',
      locationNumber: 'A',
      building: 'A',
      type: 'Building',
    });

    logger.log('Creating Building B...');
    const buildingB = await locationsService.create({
      name: 'Building B',
      locationNumber: 'B',
      building: 'B',
      type: 'Building',
    });

    // Create Building A locations
    logger.log('Creating Building A - Car Park...');
    await locationsService.create({
      name: 'Car Park',
      locationNumber: 'A-CarPark',
      area: 80.620,
      parentId: buildingA.id,
      building: 'A',
      type: 'Car Park',
    });

    logger.log('Creating Building A - Level 1...');
    const levelA1 = await locationsService.create({
      name: 'Level 1',
      locationNumber: 'A-01',
      area: 100.920,
      parentId: buildingA.id,
      building: 'A',
      level: '1',
      type: 'Level',
    });

    logger.log('Creating Building A - Level 1 - Lobby...');
    await locationsService.create({
      name: 'Lobby Level 1',
      locationNumber: 'A-01-Lobby',
      area: 80.620,
      parentId: levelA1.id,
      building: 'A',
      level: '1',
      type: 'Lobby',
    });

    logger.log('Creating Building A - Level 1 - Master Room...');
    const masterRoom = await locationsService.create({
      name: 'Master Room',
      locationNumber: 'A-01-01',
      area: 50.110,
      parentId: levelA1.id,
      building: 'A',
      level: '1',
      type: 'Room',
    });

    logger.log('Creating Building A - Level 1 - Meeting Room 1...');
    await locationsService.create({
      name: 'Meeting Room 1',
      locationNumber: 'A-01-01-M1',
      area: 20.110,
      parentId: masterRoom.id,
      building: 'A',
      level: '1',
      type: 'Meeting Room',
    });

    logger.log('Creating Building A - Level 1 - Corridor...');
    await locationsService.create({
      name: 'Corridor Level 1',
      locationNumber: 'A-01-Corridor',
      area: 30.200,
      parentId: levelA1.id,
      building: 'A',
      level: '1',
      type: 'Corridor',
    });

    logger.log('Creating Building A - Level 1 - Toilet...');
    await locationsService.create({
      name: 'Toilet Level 1',
      locationNumber: 'A-01-02',
      area: 30.200,
      parentId: levelA1.id,
      building: 'A',
      level: '1',
      type: 'Toilet',
    });

    // Create Building B locations
    logger.log('Creating Building B - Level 5...');
    const levelB5 = await locationsService.create({
      name: 'Level 5',
      locationNumber: 'B-05',
      area: 150.000,
      parentId: buildingB.id,
      building: 'B',
      level: '5',
      type: 'Level',
    });

    logger.log('Creating Building B - Level 5 - Utility Room...');
    await locationsService.create({
      name: 'Utility Room',
      locationNumber: 'B-05-11',
      area: 10.200,
      parentId: levelB5.id,
      building: 'B',
      level: '5',
      type: 'Utility',
    });

    logger.log('Creating Building B - Level 5 - Sanitary Room...');
    await locationsService.create({
      name: 'Sanitary Room',
      locationNumber: 'B-05-12',
      area: 12.200,
      parentId: levelB5.id,
      building: 'B',
      level: '5',
      type: 'Sanitary',
    });

    logger.log('Creating Building B - Level 5 - Male Toilet...');
    await locationsService.create({
      name: 'Male Toilet',
      locationNumber: 'B-05-13',
      area: 30.200,
      parentId: levelB5.id,
      building: 'B',
      level: '5',
      type: 'Toilet',
    });

    logger.log('Creating Building B - Level 5 - Genset Room...');
    await locationsService.create({
      name: 'Genset Room',
      locationNumber: 'B-05-14',
      area: 35.200,
      parentId: levelB5.id,
      building: 'B',
      level: '5',
      type: 'Utility',
    });

    logger.log('Creating Building B - Level 5 - Pantry...');
    await locationsService.create({
      name: 'Pantry Level 5',
      locationNumber: 'B-05-15',
      area: 50.200,
      parentId: levelB5.id,
      building: 'B',
      level: '5',
      type: 'Pantry',
    });

    logger.log('Creating Building B - Level 5 - Corridor...');
    await locationsService.create({
      name: 'Corridor Level 5',
      locationNumber: 'B-05-Corridor',
      area: 30.000,
      parentId: levelB5.id,
      building: 'B',
      level: '5',
      type: 'Corridor',
    });

    logger.log('Database seeding completed successfully');
  } catch (error) {
    logger.error(`Error during database seeding: ${error.message}`, error.stack);
  } finally {
    await app.close();
  }
}

// Run the seed function if this script is run directly
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;
