import { Test, TestingModule } from '@nestjs/testing';
import { LocationsService } from './locations.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { TreeRepository } from 'typeorm';
import { CreateLocationDto } from './dtos/create-location.dto';
import { UpdateLocationDto } from './dtos/update-location.dto';
import { NotFoundException } from '@nestjs/common';

describe('LocationsService', () => {
  let service: LocationsService;
  let repository: TreeRepository<Location>;

  const mockLocation = {
    id: '1',
    name: 'Test Location',
    locationNumber: 'LOC-001',
    area: 100,
    parentId: null,
    building: 'Building A',
    level: '1st Floor',
    type: 'Office',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findDescendants: jest.fn(),
    findTrees: jest.fn(),
    findDescendantsTree: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationsService,
        {
          provide: getRepositoryToken(Location),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<LocationsService>(LocationsService);
    repository = module.get<TreeRepository<Location>>(getRepositoryToken(Location));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new location', async () => {
      const createLocationDto: CreateLocationDto = {
        name: 'Test Location',
        locationNumber: 'LOC-001',
        area: 100,
        building: 'Building A',
        level: '1st Floor',
        type: 'Office',
      };

      mockRepository.create.mockReturnValue(mockLocation);
      mockRepository.save.mockResolvedValue(mockLocation);

      const result = await service.create(createLocationDto);

      expect(result).toEqual(mockLocation);
      expect(mockRepository.create).toHaveBeenCalledWith(createLocationDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockLocation);
    });
  });

  describe('findAll', () => {
    it('should return an array of locations', async () => {
      const locations = [mockLocation];
      mockRepository.find.mockResolvedValue(locations);

      const result = await service.findAll();

      expect(result).toEqual(locations);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a location by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockLocation);

      const result = await service.findOne('1');

      expect(result).toEqual(mockLocation);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw NotFoundException when location is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a location', async () => {
      const updateLocationDto: UpdateLocationDto = {
        name: 'Updated Location',
      };

      // First findOne call (in the update method)
      mockRepository.findOne.mockResolvedValueOnce(mockLocation);
      
      // Mock the save method to return the updated location
      const updatedLocation = { ...mockLocation, ...updateLocationDto };
      mockRepository.save.mockResolvedValue(updatedLocation);

      const result = await service.update('1', updateLocationDto);

      expect(result.name).toBe(updateLocationDto.name);
      expect(mockRepository.save).toHaveBeenCalledWith(expect.objectContaining(updateLocationDto));
    });

    it('should throw NotFoundException when location to update is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update('999', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a location', async () => {
      // Mock findOne to return the location
      mockRepository.findOne.mockResolvedValue(mockLocation);
      
      // Mock findDescendants to return only the location itself (no children)
      mockRepository.findDescendants.mockResolvedValue([mockLocation]);
      
      // Mock remove to return successfully
      mockRepository.remove.mockResolvedValue(undefined);

      await service.remove('1');

      expect(mockRepository.remove).toHaveBeenCalledWith(mockLocation);
    });

    it('should throw NotFoundException when location to remove is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
}); 