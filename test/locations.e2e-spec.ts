import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from '../src/locations/entities/location.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { databaseConfig } from '../src/config/database.config';
import { envConfig } from '../src/config/env.config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Non-existent UUID for testing
const NON_EXISTENT_UUID = '00000000-0000-0000-0000-000000000000';

describe('LocationsController (e2e)', () => {
  let app: INestApplication;
  let configService: ConfigService;
  let locationRepository: Repository<Location>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [envConfig],
        }),
        TypeOrmModule.forRoot(databaseConfig),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    configService = moduleFixture.get<ConfigService>(ConfigService);
    locationRepository = moduleFixture.get<Repository<Location>>(getRepositoryToken(Location));
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/locations (POST)', () => {
    beforeAll(async () => {
      await locationRepository.query('TRUNCATE TABLE location RESTART IDENTITY CASCADE');
    });

    it('should create a new location', () => {
      const createLocationDto = {
        name: 'Test Location',
        locationNumber: 'TEST-001',
        area: 100,
        building: 'Building A',
        level: '1st Floor',
        type: 'Office',
      };

      return request(app.getHttpServer())
        .post('/api/locations')
        .send(createLocationDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe(createLocationDto.name);
          expect(res.body.locationNumber).toBe(createLocationDto.locationNumber);
          expect(res.body.area).toBe(createLocationDto.area);
          expect(res.body.building).toBe(createLocationDto.building);
          expect(res.body.level).toBe(createLocationDto.level);
          expect(res.body.type).toBe(createLocationDto.type);
        });
    });

    it('should fail when required fields are missing', () => {
      const invalidDto = {
        name: 'Test Location',
      };

      return request(app.getHttpServer())
        .post('/api/locations')
        .send(invalidDto)
        .expect(400);
    });
  });

  describe('/api/locations (GET)', () => {
    beforeAll(async () => {
      await locationRepository.query('TRUNCATE TABLE location RESTART IDENTITY CASCADE');
    });

    it('should return an array of locations', () => {
      return request(app.getHttpServer())
        .get('/api/locations')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('/api/locations/:id (GET)', () => {
    let locationId: string;

    beforeAll(async () => {
      await locationRepository.query('TRUNCATE TABLE location RESTART IDENTITY CASCADE');

      const createLocationDto = {
        name: 'Test Location for Get',
        locationNumber: 'TEST-002',
        area: 200,
        building: 'Building B',
        level: '2nd Floor',
        type: 'Meeting Room',
      };

      const response = await request(app.getHttpServer())
        .post('/api/locations')
        .send(createLocationDto);

      locationId = response.body.id;
    });

    it('should return a location by id', () => {
      return request(app.getHttpServer())
        .get(`/api/locations/${locationId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', locationId);
          expect(res.body.name).toBe('Test Location for Get');
        });
    });

    it('should return 404 when location is not found', () => {
      return request(app.getHttpServer())
        .get(`/api/locations/${NON_EXISTENT_UUID}`)
        .expect(404);
    });
  });

  describe('/api/locations/:id (PATCH)', () => {
    let locationId: string;

    beforeAll(async () => {
      await locationRepository.query('TRUNCATE TABLE location RESTART IDENTITY CASCADE');

      const createLocationDto = {
        name: 'Test Location for Update',
        locationNumber: 'TEST-003',
        area: 300,
        building: 'Building C',
        level: '3rd Floor',
        type: 'Conference Room',
      };

      const response = await request(app.getHttpServer())
        .post('/api/locations')
        .send(createLocationDto);

      locationId = response.body.id;
    });

    it('should update a location', () => {
      const updateDto = {
        name: 'Updated Location Name',
        area: 350,
      };

      return request(app.getHttpServer())
        .patch(`/api/locations/${locationId}`)
        .send(updateDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe(updateDto.name);
          expect(res.body.area).toBe(updateDto.area);
          expect(res.body.locationNumber).toBe('TEST-003'); // Unchanged field
        });
    });

    it('should return 404 when updating non-existent location', () => {
      return request(app.getHttpServer())
        .patch(`/api/locations/${NON_EXISTENT_UUID}`)
        .send({ name: 'Updated Name' })
        .expect(404);
    });
  });

  describe('/api/locations/:id (DELETE)', () => {
    let locationId: string;

    beforeAll(async () => {
      await locationRepository.query('TRUNCATE TABLE location RESTART IDENTITY CASCADE');

      const createLocationDto = {
        name: 'Test Location for Delete',
        locationNumber: 'TEST-004',
        area: 400,
        building: 'Building D',
        level: '4th Floor',
        type: 'Storage Room',
      };

      const response = await request(app.getHttpServer())
        .post('/api/locations')
        .send(createLocationDto);

      locationId = response.body.id;
    });

    it('should delete a location', () => {
      return request(app.getHttpServer())
        .delete(`/api/locations/${locationId}`)
        .expect(204);
    });

    it('should return 404 when deleting non-existent location', () => {
      return request(app.getHttpServer())
        .delete(`/api/locations/${NON_EXISTENT_UUID}`)
        .expect(404);
    });
  });
}); 