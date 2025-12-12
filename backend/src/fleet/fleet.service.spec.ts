import { Test, TestingModule } from '@nestjs/testing';
import { FleetService } from './fleet.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FleetHistory, HistorySchema, Vehicle, VehicleSchema } from './schemas/fleet.schemas';




describe('FleetService', () => {
  let service: FleetService;

  beforeEach(async () => {
    // vehicleModel = {
    //   find: jest.fn().mockReturnValue({exec: jest.fn().mockResolvedValue([mockVehicleDoc])}),
      
    // }
    const module: TestingModule = await Test.createTestingModule({
      providers: [
      FleetService,
      
      {
        provide: 'VehicleModel',
        useValue: {
          
        },
      },
      {
        provide: 'FleetHistoryModel',
        useValue: {
        },
      },
      ],
    }).compile();

    service = module.get<FleetService>(FleetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();

  });
  describe(`get dashboard data`, ()=> {
    it(``)
  })
 
});
