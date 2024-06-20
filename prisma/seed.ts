import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { SeedDto } from '@dto';

const prisma = new PrismaClient();

async function hashPassword(password) {
  const salt = 10;
  return await bcrypt.hash(password, salt);
}
const fakerUser = async (): Promise<SeedDto> => ({
  name: faker.internet.userName(),
  email: faker.internet.email(),
  password: '123456',
});

async function main() {
  const fakerRounds = 5;
  console.log('Seeding...');
  for (let i = 0; i < fakerRounds; i++) {
    const dto = await fakerUser();
    const hashedPassword = await hashPassword(dto.password);
    if (i % 2 == 0) {
      await prisma.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          name: dto.name,
        },
      });
      continue;
    }
    await prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        roles: 'Admin',
      },
    });

    for (let j = 0; j < fakerRounds; j++) {
      const user = await prisma.user.findUnique({
        where: { email: dto.email },
      });
      await prisma.meetup.create({
        data: {
          title: faker.person.jobTitle(),
          description: faker.lorem.words(10),
          tags: '#' + faker.animal.type(),
          place: faker.location.streetAddress(),
          authorId: user.id,
          date: faker.date.future(),
        },
      });
    }
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
