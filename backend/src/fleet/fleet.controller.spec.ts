import { Test, TestingModule } from '@nestjs/testing';
import { FleetController } from './fleet.controller';
import { FleetService } from './fleet.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Vehicle, VehicleSchema, FleetHistory, HistorySchema } from './schemas/fleet.schemas';

describe('FleetController', () => {
  let controller: FleetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FleetController],
      providers: [
      FleetService,
      {
        provide: 'VehicleModel',
        useValue: {
        find: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn(),
        },
      },
      {
        provide: 'FleetHistoryModel',
        useValue: {
        find: jest.fn(),
        create: jest.fn(),
        },
      },
      ],
    }).compile();

    controller = module.get<FleetController>(FleetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
