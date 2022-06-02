import { faker } from '@faker-js/faker';

import { CreateContactDto } from 'src/contact/dto';

const bulkContacts: CreateContactDto[] = [];

const limit = 200;

for (let i = 0; i < limit; i++) {
  bulkContacts.push({
    name: faker.name.findName(),
    phone: faker.phone.phoneNumber(),
    info: faker.lorem.sentence(),
  } as CreateContactDto);
}

export { bulkContacts, limit };
