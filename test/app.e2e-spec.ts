import * as pactum from 'pactum';
import { Connection } from 'mongoose';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';

import { AuthDto } from 'src/auth/dto';
import { bulkContacts, limit } from './bulkContacts';
import { AppModule } from './../src/app.module';
import { getConnectionToken } from '@nestjs/mongoose';

describe('App e2e', () => {
  let app: INestApplication;
  let connection: Connection;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    connection = moduleRef.get(getConnectionToken());
    await connection.dropCollection('auths');
    await connection.dropCollection('contacts');

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init();
    await app.listen(5000);
    pactum.request.setBaseUrl('http://localhost:5000');
  });

  afterAll(async () => {
    await connection.close();
    await app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      username: 'm3rashid',
      password: '123',
    };

    describe('Signup', () => {
      it('Should throw esception if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ password: dto.password })
          .expectStatus(400);
      });

      it('Should throw esception if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ username: dto.username })
          .expectStatus(400);
      });

      it('Should throw esception if no dto', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });

      it('Should Signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('Login', () => {
      it('Should throw esception if email empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({ password: dto.password })
          .expectStatus(400);
      });

      it('Should throw esception if password empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({ username: dto.username })
          .expectStatus(400);
      });

      it('Should throw esception if no dto', () => {
        return pactum.spec().post('/auth/login').expectStatus(400);
      });

      it('Should Login', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody(dto)
          .expectStatus(201)
          .stores('userAT', 'access_token');
      });
    });
  });

  describe('Contact', () => {
    describe('Create Contact', () => {
      it('Should create a single contact', () => {
        return pactum
          .spec()
          .post('/contact')
          .withBody({
            name: 'MD Rashid Hussain',
            phone: '+8801711-123456',
            info: "I'm a software engineer",
          })
          .withHeaders({
            Authorization: 'Bearer $S{userAT}',
          })
          .expectStatus(201)
          .stores('contactId', '_id');
      });
    });

    describe('Get last added Contact', () => {
      it('Should get Contacts', () => {
        return pactum
          .spec()
          .get('/contact')
          .withHeaders({
            Authorization: 'Bearer $S{userAT}',
          })
          .expectStatus(200)
          .expect((data) => {
            expect(data.res.body.count).toBe(1);
            expect(data.res.body.contacts).toHaveLength(1);
          });
      });
    });

    describe('Update Contact', () => {
      it('Should update a single contact', () => {
        return pactum
          .spec()
          .patch('/contact/$S{contactId}')
          .withBody({
            name: 'Ramesh',
            phone: '+8801711',
            info: 'Rashid is no more',
          })
          .withHeaders({
            Authorization: 'Bearer $S{userAT}',
          })
          .expectStatus(200);
      });
    });

    describe('Get contact by ID', () => {
      it('Should get a single contact', () => {
        return pactum
          .spec()
          .get('/contact/$S{contactId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAT}',
          })
          .expectStatus(200)
          .expect((data) => {
            expect(data.res.body.name).toBe('Ramesh');
            expect(data.res.body.phone).toBe('+8801711');
            expect(data.res.body.info).toBe('Rashid is no more');
          });
      });
    });

    describe('Delete Contact', () => {
      it('Should delete a single contact', () => {
        return pactum
          .spec()
          .delete('/contact/$S{contactId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAT}',
          })
          .expectStatus(204);
      });
    });

    describe(`Add ${limit} contacts`, () => {
      it(`Should create ${limit} contacts`, () => {
        return pactum
          .spec()
          .post('/contact/bulk')
          .withBody(bulkContacts)
          .withHeaders({
            Authorization: 'Bearer $S{userAT}',
          })
          .expectStatus(201)
          .expect((data) => {
            expect(data.res.body).toHaveLength(limit);
          });
      });
    });

    describe('Get Contacts', () => {
      it('Should get Contacts', () => {
        return pactum
          .spec()
          .get('/contact')
          .withHeaders({
            Authorization: 'Bearer $S{userAT}',
          })
          .expectStatus(200)
          .expect((data) => {
            expect(data.res.body.contacts).toHaveLength(10);
            expect(data.res.body.count).toEqual(limit);
          });
      });
    });
  });
});
