import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { FleetService } from '../../fleet/fleet.service';
import { faker } from '@faker-js/faker';

async function createVehicles(count = 20) {
  const app = await NestFactory.createApplicationContext(AppModule);
  const fleetService = app.get(FleetService);

  const vehicles = Array.from({ length: count }).map(() => ({
    modelo: faker.vehicle.model(),
    estado: faker.helpers.arrayElement(['En Ruta', 'Disponible', 'Mantenimiento', 'Incidencia']),
    combustible: faker.number.int({ min: 0, max: 100 }),
    temp: faker.number.int({ min: 20, max: 120 }),
    km: faker.number.int({ min: 10000, max: 500000 }),
    chofer: faker.person.fullName(),
    tipo: faker.helpers.arrayElement(['Carga Pesada', 'Refrigerado', 'Reparto Urbano']),
  }));

  for (const v of vehicles) {
    await fleetService.createVehicle(v);
  }

  console.log(`Created ${count} vehicles with random data.`);
  await app.close();
}

async function updateVehicles() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const fleetService = app.get(FleetService);

  const dashboard = await fleetService.getDashboardData();
  for (const v of dashboard.orders) {
    await fleetService.updateVehicle(v.id, {
      modelo: faker.vehicle.model(),
      estado: faker.helpers.arrayElement(['En Ruta', 'Disponible', 'Mantenimiento', 'Incidencia']),
      combustible: faker.number.int({ min: 0, max: 100 }),
      temp: faker.number.int({ min: 20, max: 120 }),
      km: faker.number.int({ min: 10000, max: 500000 }),
      chofer: faker.person.fullName(),
      tipo: faker.helpers.arrayElement(['Carga Pesada', 'Refrigerado', 'Reparto Urbano']),
      
      
    });
  }

  console.log(`Updated ${dashboard.orders.length} vehicles with new random data.`);
  await app.close();
}

// CLI usage: node faker-seed.js create|update [count]
(async () => {
  try {
    const [,, action, countArg] = process.argv;
    if (action === 'create') {
      await createVehicles(Number(countArg) || 20);
    } else if (action === 'update') {
      await updateVehicles();
    } else {
      console.log('Usage: npm run faker:create [count] | npm run faker:update');
    }
  } catch (err) {
    console.error('Faker seed error:', err);
    process.exit(1);
  }
})();