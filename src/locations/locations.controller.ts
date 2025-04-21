import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ClassSerializerInterceptor, ParseUUIDPipe, HttpStatus, HttpCode } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dtos/create-location.dto';
import { UpdateLocationDto } from './dtos/update-location.dto';
import { Location } from './entities/location.entity';

@Controller('api/locations')
@UseInterceptors(ClassSerializerInterceptor)
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  /**
   * Create a new location
   * @param createLocationDto Location data
   * @returns Created location
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createLocationDto: CreateLocationDto): Promise<Location> {
    return this.locationsService.create(createLocationDto);
  }

  /**
   * Get all locations (flat list)
   * @returns Array of all locations
   */
  @Get()
  findAll(): Promise<Location[]> {
    return this.locationsService.findAll();
  }

  /**
   * Get all locations as tree
   * @returns Hierarchical tree of locations
   */
  @Get('tree')
  findTree(): Promise<Location[]> {
    return this.locationsService.findTree();
  }

  /**
   * Get a specific location by ID
   * @param id Location ID
   * @returns Location entity
   */
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Location> {
    return this.locationsService.findOne(id);
  }

  /**
   * Get a location with its children
   * @param id Location ID
   * @returns Location with children
   */
  @Get(':id/with-children')
  findOneWithChildren(@Param('id', ParseUUIDPipe) id: string): Promise<Location> {
    return this.locationsService.findOneWithChildren(id);
  }

  /**
   * Update a location
   * @param id Location ID
   * @param updateLocationDto Updated data
   * @returns Updated location
   */
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ): Promise<Location> {
    return this.locationsService.update(id, updateLocationDto);
  }

  /**
   * Delete a location
   * @param id Location ID
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.locationsService.remove(id);
  }
}
