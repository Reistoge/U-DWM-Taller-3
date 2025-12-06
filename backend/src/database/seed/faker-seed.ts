import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { FleetService } from '../../fleet/fleet.service';
import { faker } from '@faker-js/faker';
import { getWeekStart } from '../../fleet/schemas/fleet.schemas';

function getRandomWeekStart(): Date {
  // Get a random date between current week and 4 weeks ago
  const today = new Date();
  const randomDaysAgo = faker.number.int({ min: 0, max: 28 });
  const randomDate = new Date(today);
  randomDate.setDate(randomDate.getDate() - randomDaysAgo);
  return getWeekStart(randomDate);
}

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
    weekStart: getRandomWeekStart(),
    weeklyKm: 0,
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
  
  // Get current week start
  const weekStart = new Date();
  const day = weekStart.getDay();
  const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
  const currentWeekStart = new Date(weekStart.setDate(diff));
  currentWeekStart.setHours(0, 0, 0, 0);
  
  // Days of the week: 0=Monday, 6=Sunday
  const daysOfWeek = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];
  
  let vehicleIndex = 0;
  // Distribute vehicles across each day of the week
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const recordDate = new Date(currentWeekStart);
    recordDate.setDate(recordDate.getDate() + dayOffset);
    
    const vehiclesPerDay = Math.ceil(dashboard.vehicles.length / 7);
    const endIndex = Math.min(vehicleIndex + vehiclesPerDay, dashboard.vehicles.length);
    
    console.log(`\n--- Updating vehicles for ${daysOfWeek[dayOffset]} (${recordDate.toDateString()}) ---`);
    
    for (; vehicleIndex < endIndex; vehicleIndex++) {
      const v = dashboard.vehicles[vehicleIndex];
      const currentKm = v.km;
      // Generate new km that's HIGHER than current (add 100-5000 km)
      const newKm = currentKm + faker.number.int({ min: 100, max: 5000 });
      
      await fleetService.updateVehicle(v.id, {
        modelo: faker.vehicle.model(),
        estado: faker.helpers.arrayElement(['En Ruta', 'Disponible', 'Mantenimiento', 'Incidencia']),
        combustible: faker.number.int({ min: 0, max: 100 }),
        temp: faker.number.int({ min: 20, max: 120 }),
        km: newKm, // Always higher than current
        chofer: faker.person.fullName(),
        tipo: faker.helpers.arrayElement(['Carga Pesada', 'Refrigerado', 'Reparto Urbano']),
      }, recordDate); // Pass the date to record in history
    }
  }

  console.log(`\nUpdated ${dashboard.vehicles.length} vehicles distributed across the week.`);
  await app.close();
}

// CLI usage: npm run faker:create [count] | npm run faker:update
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