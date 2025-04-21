import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository } from 'typeorm';
import { Location } from './entities/location.entity';
import { CreateLocationDto } from './dtos/create-location.dto';
import { UpdateLocationDto } from './dtos/update-location.dto';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: TreeRepository<Location>,
  ) {}

  /**
   * Create a new location
   * @param createLocationDto Data for the new location
   * @returns The created location entity
   */
  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    // Check if location number already exists
    const existingLocation = await this.locationRepository.findOne({
      where: { locationNumber: createLocationDto.locationNumber },
    });

    if (existingLocation) {
      throw new BadRequestException(`Location with number ${createLocationDto.locationNumber} already exists`);
    }

    const location = this.locationRepository.create(createLocationDto);

    // Handle parent relationship if parentId is provided
    if (createLocationDto.parentId) {
      const parent = await this.locationRepository.findOne({
        where: { id: createLocationDto.parentId },
      });

      if (!parent) {
        throw new NotFoundException(`Parent location with ID ${createLocationDto.parentId} not found`);
      }

      location.parent = parent;
    }

    return this.locationRepository.save(location);
  }

  /**
   * Find all locations (flat list)
   * @returns Array of all locations
   */
  async findAll(): Promise<Location[]> {
    return this.locationRepository.find();
  }

  /**
   * Get complete location tree
   * @returns Tree structure of all locations
   */
  async findTree(): Promise<Location[]> {
    return this.locationRepository.findTrees();
  }

  /**
   * Find a specific location by ID
   * @param id Location ID
   * @returns Location entity
   */
  async findOne(id: string): Promise<Location> {
    const location = await this.locationRepository.findOne({
      where: { id },
    });

    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }

    return location;
  }

  /**
   * Find a specific location with its children
   * @param id Location ID
   * @returns Location entity with children
   */
  async findOneWithChildren(id: string): Promise<Location> {
    const location = await this.locationRepository.findOne({
      where: { id },
    });

    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }

    return this.locationRepository.findDescendantsTree(location);
  }

  /**
   * Update a location
   * @param id Location ID
   * @param updateLocationDto New location data
   * @returns Updated location entity
   */
  async update(id: string, updateLocationDto: UpdateLocationDto): Promise<Location> {
    const location = await this.findOne(id);

    // Check if trying to update location number and if it already exists
    if (updateLocationDto.locationNumber && updateLocationDto.locationNumber !== location.locationNumber) {
      const existingLocation = await this.locationRepository.findOne({
        where: { locationNumber: updateLocationDto.locationNumber },
      });

      if (existingLocation) {
        throw new BadRequestException(`Location with number ${updateLocationDto.locationNumber} already exists`);
      }
    }

    // Handle parent update if needed
    if (updateLocationDto.parentId) {
      const parent = await this.locationRepository.findOne({
        where: { id: updateLocationDto.parentId },
      });

      if (!parent) {
        throw new NotFoundException(`Parent location with ID ${updateLocationDto.parentId} not found`);
      }

      // Prevent circular references
      if (id === updateLocationDto.parentId) {
        throw new BadRequestException(`Location cannot be its own parent`);
      }

      // Check if new parent is a descendant of this node
      const descendants = await this.locationRepository.findDescendants(location);
      if (descendants.some(desc => desc.id === updateLocationDto.parentId)) {
        throw new BadRequestException(`Cannot set a descendant as parent (creates circular reference)`);
      }

      location.parent = parent;
    }

    // Update other fields
    Object.assign(location, updateLocationDto);
    
    return this.locationRepository.save(location);
  }

  /**
   * Delete a location
   * @param id Location ID
   * @returns void
   */
  async remove(id: string): Promise<void> {
    const location = await this.findOne(id);
    
    // Check if location has children
    const children = await this.locationRepository.findDescendants(location);
    
    if (children.length > 1) { // > 1 because findDescendants includes the entity itself
      throw new BadRequestException(`Cannot delete location with children. Delete children first or move them to another parent.`);
    }
    
    await this.locationRepository.remove(location);
  }
}
