import { NestFactory } from '@nestjs/core';
import * as fs from 'fs';
import * as path from 'path';
import { AppModule } from '../../app.module';
import { FleetService } from '../../fleet/fleet.service';

async function bootstrap() {
  try {
    const app = await NestFactory.createApplicationContext(AppModule);
    const fleetService = app.get(FleetService);

    const seedPath = path.join(__dirname, 'seed.json');
    if (!fs.existsSync(seedPath)) {
      console.error('seed.json not found');
      process.exit(1);
    }

    const data = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));
    if (!data.orders) {
      console.error('No "orders" array found in seed.json');
      process.exit(1);
    }

    await fleetService.seedDatabase({ orders: data.orders });
    console.log('Database seeded successfully!');
    await app.close();
  } catch (err) {
    console.error('Error during seeding:', err);
    process.exit(1);
  }
}

bootstrap();