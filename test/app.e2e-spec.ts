import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import { AppModule } from '../src/infra/http/app.module';

describe('User Management (e2e)', () => {
  let app: INestApplication;
  const prisma = new PrismaClient();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    await prisma.refreshToken.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it('should update own name and password', async () => {
    await request(app.getHttpServer()).post('/auth/register').send({
      name: 'User',
      email: 'update@example.com',
      password: 'password123',
    });

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'update@example.com',
        password: 'password123',
      });

    const token = loginRes.body.access_token;

    await request(app.getHttpServer())
      .patch('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated Name',
      })
      .expect(200);

    await request(app.getHttpServer())
      .patch('/users/password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        password: 'newpassword123',
      })
      .expect(204);

    const meRes = await request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(meRes.body.name).toBe('Updated Name');
  });

  it('should filter users by role and order by name', async () => {
    await request(app.getHttpServer()).post('/auth/register').send({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'password123',
    });

    await request(app.getHttpServer()).post('/auth/register').send({
      name: 'B User',
      email: 'b@example.com',
      password: 'password123',
    });

    await request(app.getHttpServer()).post('/auth/register').send({
      name: 'A User',
      email: 'a@example.com',
      password: 'password123',
    });

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'password123',
      });

    const adminToken = loginRes.body.access_token;

    const res = await request(app.getHttpServer())
      .get('/users?page=1&limit=10&role=user&sortBy=name&order=asc')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body.users[0].name).toBe('A User');
    expect(res.body.users[1].name).toBe('B User');
    expect(
      res.body.users.some((u: { role: string }) => u.role === 'admin'),
    ).toBe(false);
  });

  it('should not login with wrong password', async () => {
    await request(app.getHttpServer()).post('/auth/register').send({
      name: 'User',
      email: 'wrongpass@example.com',
      password: 'password123',
    });

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'wrongpass@example.com',
        password: 'wrongpassword',
      })
      .expect(401);
  });

  it('should not allow registration with invalid email', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'Invalid Email',
        email: 'not-an-email',
        password: 'password123',
      })
      .expect(400);
  });

  it('should not allow duplicate email registration', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'User1',
        email: 'dup@example.com',
        password: 'password123',
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'User2',
        email: 'dup@example.com',
        password: 'password123',
      })
      .expect(409);
  });

  it('should create the first user as admin and login', async () => {
    const registerRes = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'Admin User',
        email: 'admin1@example.com',
        password: 'password123',
      })
      .expect(201);

    expect(registerRes.body.role).toBe('admin');

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin1@example.com',
        password: 'password123',
      })
      .expect(200);

    expect(loginRes.body).toHaveProperty('access_token');
    const adminToken = loginRes.body.access_token;

    const meRes = await request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(meRes.body.email).toBe('admin1@example.com');
    expect(meRes.body.role).toBe('admin');
  });

  it('should create a second user as regular and login', async () => {
    await request(app.getHttpServer()).post('/auth/register').send({
      name: 'Admin User',
      email: 'admin2@example.com',
      password: 'password123',
    });

    const registerRes = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'Regular User',
        email: 'user1@example.com',
        password: 'password123',
      })
      .expect(201);

    expect(registerRes.body.role).toBe('user');

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'user1@example.com',
        password: 'password123',
      })
      .expect(200);

    expect(loginRes.body).toHaveProperty('access_token');
    const userToken = loginRes.body.access_token;

    const meRes = await request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(meRes.body.email).toBe('user1@example.com');
    expect(meRes.body.role).toBe('user');
  });

  it('should not allow user to list all users', async () => {
    await request(app.getHttpServer()).post('/auth/register').send({
      name: 'Admin User',
      email: 'admin3@example.com',
      password: 'password123',
    });

    await request(app.getHttpServer()).post('/auth/register').send({
      name: 'Regular User',
      email: 'user2@example.com',
      password: 'password123',
    });

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'user2@example.com',
        password: 'password123',
      });

    const userToken = loginRes.body.access_token;

    await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);
  });

  it('should allow admin to list all users', async () => {
    await request(app.getHttpServer()).post('/auth/register').send({
      name: 'Admin User',
      email: 'admin4@example.com',
      password: 'password123',
    });

    await request(app.getHttpServer()).post('/auth/register').send({
      name: 'Regular User',
      email: 'user3@example.com',
      password: 'password123',
    });

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin4@example.com',
        password: 'password123',
      });

    const adminToken = loginRes.body.access_token;

    const listRes = await request(app.getHttpServer())
      .get('/users?page=1&limit=10')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(Array.isArray(listRes.body.users)).toBe(true);
    expect(listRes.body.total).toBeGreaterThanOrEqual(2);
  });

  it('should not allow user to delete another user', async () => {
    await request(app.getHttpServer()).post('/auth/register').send({
      name: 'Admin User',
      email: 'admin5@example.com',
      password: 'password123',
    });

    await request(app.getHttpServer()).post('/auth/register').send({
      name: 'Regular User',
      email: 'user4@example.com',
      password: 'password123',
    });

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'user4@example.com',
        password: 'password123',
      });

    const userToken = loginRes.body.access_token;

    const admin = await prisma.user.findUnique({
      where: { email: 'admin5@example.com' },
    });

    await request(app.getHttpServer())
      .delete(`/users/${admin?.id}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);
  });

  it('should allow admin to delete a user', async () => {
    await request(app.getHttpServer()).post('/auth/register').send({
      name: 'Admin User',
      email: 'admin6@example.com',
      password: 'password123',
    });

    await request(app.getHttpServer()).post('/auth/register').send({
      name: 'Regular User',
      email: 'user5@example.com',
      password: 'password123',
    });

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin6@example.com',
        password: 'password123',
      });

    const adminToken = loginRes.body.access_token;

    const user = await prisma.user.findUnique({
      where: { email: 'user5@example.com' },
    });

    await request(app.getHttpServer())
      .delete(`/users/${user?.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(204);
  });
});
