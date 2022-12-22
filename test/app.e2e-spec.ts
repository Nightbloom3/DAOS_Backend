import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TestModule } from './../src/test.module';
import { ProfilesService } from './../src/profiles/profiles.service';
import { CreateProfileDTO } from './../src/profiles/dtos/create-profile.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let profilesService: ProfilesService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestModule],
    }).compile();

    profilesService = moduleFixture.get(ProfilesService);
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  beforeEach(async () => {
    // delete all profiles
    await profilesService.deleteMany({});
  });

  //Testing authentication
  describe('Auth', () => {
    it('Sign up / Create Profile', async () => {
      //Arrange - Setup
      const beforeSignUp = await profilesService.findAll();

      const newProfile = new CreateProfileDTO(
        'Kasper', //firstName - required
        'Tester', //lastName - required
        'Copenhagen', // City
        '1050', // ZipCode
        'test@gmail.com', //email - required
        '99999999', //password
        true, //conditions
        true, //newsletter
        true // Status - seeking
      );

      // Act
      const signUp = await request(app.getHttpServer())
        .post('/profiles/auth/sign-up')
        .send(newProfile)
        .expect(201);//Assert

      // Assert
      const afterSignUp = await profilesService.findAll();
      // First we validate that the database has one more object than before "new profile" got created
      expect(beforeSignUp.length).toBeLessThan(afterSignUp.length);
      expect(beforeSignUp).toEqual([]);
      expect(beforeSignUp.length).toEqual(0);

      // Here we validate that the email used to create "new profile", exists in the database
      expect(await profilesService.findOneByEmail("test@gmail.com")).not.toEqual(null || undefined);
      expect(afterSignUp.length).toEqual(1);
    });

    it('Sign up / Create Profile - Fail - not an email', async () => {
      //Arrange - Setup
      const beforeSignUp = await profilesService.findAll();

      const newProfile = new CreateProfileDTO(
        'Kasper', //firstName
        'Tester', //lastName
        'Copenhagen', // City
        '1050', // ZipCode
        'testgmail.com', //email
        '99999999', //password
        true, //conditions
        true, //newsletter
        true // Status - seeking
      );

      // Act
      const signUp = await request(app.getHttpServer())
        .post('/profiles/auth/sign-up')
        .send(newProfile)
        .expect(400);//Assert - Bad Request

      // Assert
      const afterSignUp = await profilesService.findAll();
      expect(signUp.body.message).toEqual(["email must be an email"]);
      expect(beforeSignUp.length).toEqual(0);
      expect(afterSignUp.length).toEqual(0);
    });

    it('Sign up / Create Profile - Fail - no password', async () => {
      //Arrange - Setup
      const beforeSignUp = await profilesService.findAll();

      const newProfile = new CreateProfileDTO(
        'Kasper', //firstName
        'Tester', //lastName
        'Copenhagen', // City
        '1050', // ZipCode
        'test@gmail.com', //email
        '', //password
        true, //conditions
        true, //newsletter
        true // Status - seeking
      );

      // Act
      const signUp = await request(app.getHttpServer())
        .post('/profiles/auth/sign-up')
        .send(newProfile)
        .expect(400);//Assert - Bad Request

      // Assert
      const afterSignUp = await profilesService.findAll();
      expect(signUp.body.message).toEqual(["password must be longer than or equal to 8 characters"]);
      expect(beforeSignUp.length).toEqual(0);
      expect(afterSignUp.length).toEqual(0);
    });

    it('Sign up / Create Profile - Fail - no first name', async () => {
      //Arrange - Setup
      const beforeSignUp = await profilesService.findAll();

      const newProfile = new CreateProfileDTO(
        '', //firstName
        'Tester', //lastName
        'Copenhagen', // City
        '1050', // ZipCode
        'test@gmail.com', //email
        '99999999', //password
        true, //conditions
        true, //newsletter
        true // Status - seeking
      );

      // Act
      const signUp = await request(app.getHttpServer())
        .post('/profiles/auth/sign-up')
        .send(newProfile)
        .expect(400);//Assert - Bad Request

      // Assert
      const afterSignUp = await profilesService.findAll();
      expect(signUp.body.message).toEqual(["firstName must contain only letters (a-zA-Z)"]);
      expect(beforeSignUp.length).toEqual(0);
      expect(afterSignUp.length).toEqual(0);
    });

    it('Sign up / Create Profile - Fail - no last name', async () => {
      //Arrange - Setup
      const beforeSignUp = await profilesService.findAll();

      const newProfile = new CreateProfileDTO(
        'Kasper', //firstName
        '', //lastName
        'Copenhagen', // City
        '1050', // ZipCode
        'test@gmail.com', //email
        '99999999', //password
        true, //conditions
        true, //newsletter
        true // Status - seeking
      );

      // Act
      const signUp = await request(app.getHttpServer())
        .post('/profiles/auth/sign-up')
        .send(newProfile)
        .expect(400);//Assert - Bad Request

      // Assert
      const afterSignUp = await profilesService.findAll();
      expect(signUp.body.message).toEqual(["lastName must contain only letters (a-zA-Z)"]);
      expect(beforeSignUp.length).toEqual(0);
      expect(afterSignUp.length).toEqual(0);
    });

    it('Sign up / Create Profile - Fail - firstname numbers', async () => {
      //Arrange - Setup
      const beforeSignUp = await profilesService.findAll();

      const newProfile = new CreateProfileDTO(
        '123', //firstName
        'Tester', //lastName
        'Copenhagen', // City
        '1050', // ZipCode
        'test@gmail.com', //email
        '99999999', //password
        true, //conditions
        true, //newsletter
        true // Status - seeking
      );

      // Act
      const signUp = await request(app.getHttpServer())
        .post('/profiles/auth/sign-up')
        .send(newProfile)
        .expect(400);//Assert - Bad Request

      // Assert
      const afterSignUp = await profilesService.findAll();
      expect(signUp.body.message).toEqual(["firstName must contain only letters (a-zA-Z)"]);
      expect(beforeSignUp.length).toEqual(0);
      expect(afterSignUp.length).toEqual(0);
    });

    it('Login - auth ok', async () => {
      //Arrange
      const loginProfile = new CreateProfileDTO(
        'Kasper', //firstName
        'Tester', //lastName
        'Copenhagen', // City
        '1050', // ZipCode
        'test@gmail.com', //email
        '99999999', //password
        true, //conditions
        true, //newsletter
        true // Status - seeking
      );

      await profilesService.create(loginProfile);
      const token = null;

      const responseWithNoToken = await request(app.getHttpServer())
      .get('/profiles')
      .send({
        email: loginProfile.email,
        password: loginProfile.password,
      })
      .set('Authorization', `Bearer ${token}`);
 
      //Act
      const loginResponse = await request(app.getHttpServer())
        .post('/profiles/auth/login')
        .send({
          email: loginProfile.email,
          password: loginProfile.password,
        });

      //Assert
      //expect( What actually is happening ).toBe ( what we expect to happen)
      expect(responseWithNoToken.status).toBe(401);
      expect(responseWithNoToken.body.access_token).toBeNull;
      expect(responseWithNoToken.body.access_token).toBeUndefined;

      expect(loginResponse.status).toBe(201);
      // They do the same, its just to show case different options - pick ".not.toEqual(null)" if only we only show one
      expect(loginResponse.body.access_token).not.toBeUndefined();
      expect(loginResponse.body.access_token).not.toEqual(null);
      expect(loginResponse.body.access_token).not.toBeNull();
      expect(loginResponse.body.access_token).not.toBe(null);

      // Response should not have an email, because the payload is sign and transformed to a JWT token
      expect(loginResponse.body.email).toBeUndefined;
      expect(loginResponse.body.email).toBeNull;
    });

    it('Login - Wrong Email', async () => {
      //Arrange
      const myProfile = new CreateProfileDTO(
        'Kasper', //firstName
        'Tester', //lastName
        'Copenhagen', // City
        '1050', // ZipCode
        'test@gmail.com', //email
        '99999999', //password
        true, //conditions
        true, //newsletter
        true // Status - seeking
      );
      
      await profilesService.create(myProfile);

      //Act
      const response = await request(app.getHttpServer())
      .post('/profiles/auth/login')
      .send({
        email: "MyWrongEmail@Tests.com",
        password: myProfile.password,
      });

      //Assert
      expect(response.status).toBe(404);
      // if message is changed with error handling - look at - auth.service - message comes from there
      expect(response.body.message).toEqual('This email does not exist');
    });

    it('Login - Wrong password', async () => {
      //Arrange
      const myProfile = new CreateProfileDTO(
        'Kasper', //firstName
        'Tester', //lastName
        'Copenhagen', // City
        '1050', // ZipCode
        'test@gmail.com', //email
        '99999999', //password
        true, //conditions
        true, //newsletter
        true // Status - seeking
      );

      await profilesService.create(myProfile);

      //Act
      const response = await request(app.getHttpServer())
        .post('/profiles/auth/login')
        .send({
          email: myProfile.email,
          password: 'MyWrongPassword',
        });

      //Assert
      expect(response.status).toBe(401);
      // if message is changed with error handling - look at - auth.service - message comes from there
      expect(response.body.message).toEqual('Wrong password');
    });

    describe('Get', () => {
      it('Get all profiles - ok', async () => {
        //Arrange
        const getAllProfilesObject1 = new CreateProfileDTO(
          'Jens',
          'Tester',
          'Copenhagen', // City
          '1050', // ZipCode
          'Fake@mail.dk',
          'MyPassword123',
          true,
          true,
          true // Status - seeking
        );
        const getAllProfilesObject2 = new CreateProfileDTO(
          'Peter',
          'Tester',
          'Copenhagen', // City
          '1050', // ZipCode
          'SuperFake@mail.dk',
          'MyPassword1234',
          true,
          true,
          true // Status - seeking
        );
        await profilesService.create(getAllProfilesObject1);
        await profilesService.create(getAllProfilesObject2);

        const SignUpProfile = new CreateProfileDTO(
          'Kasper',
          'Tester',
          'Copenhagen', // City
          '1050', // ZipCode
          'test@mail.dk',
          '123456789',
          true,
          true,
          true // Status - seeking
        );

        const signUpResponse = await request(app.getHttpServer())
          .post('/profiles/auth/sign-up')
          .send(SignUpProfile)
          .expect(201);

        // Act
        const token = signUpResponse.body.access_token;

        const response = await request(app.getHttpServer())
          .get('/profiles')
          .set('Authorization', `Bearer ${token}`);

        // Assert
        expect(response.body.length).toBeGreaterThan(2);
        expect(response.status).toBe(200);
      });

      it('Get all profiles - No token - Fail', async () => {
        //Arrange
        const getAllProfilesObject1 = new CreateProfileDTO(
          'Jens',
          'Tester',
          'Copenhagen', // City
          '1050', // ZipCode
          'Fake@mail.dk',
          'MyPassword123',
          true,
          true,
          true // Status - seeking
        );
        const getAllProfilesObject2 = new CreateProfileDTO(
          'Peter',
          'Tester',
          'Copenhagen', // City
          '1050', // ZipCode
          'SuperFake@mail.dk',
          'MyPassword1234',
          true,
          true,
          true // Status - seeking
        );
        await profilesService.create(getAllProfilesObject1);
        await profilesService.create(getAllProfilesObject2);

        // Act
        const token = '';

        const result = await request(app.getHttpServer())
          .get('/profiles')
          .set('Authorization', `Bearer ${token}`);

        // Assert
        expect(result.body.length).toBeUndefined;
        expect(result.body.length).toBeNull;
        expect(result.status).toBe(401);
      });

      it('Get all profiles - Filter Show only "status" with true', async () => {
        //Arrange
        const getAllProfilesObject1 = new CreateProfileDTO(
          'Jens',
          'Tester',
          'Copenhagen', // City
          '1050', // ZipCode
          'Fake@mail.dk',
          'MyPassword123',
          true,
          true,
          false // Status - seeking
        );
        const getAllProfilesObject2 = new CreateProfileDTO(
          'Peter',
          'Tester',
          'Copenhagen', // City
          '1050', // ZipCode
          'SuperFake@mail.dk',
          'MyPassword1234',
          true,
          true,
          true // Status - seeking
        );
        await profilesService.create(getAllProfilesObject1);
        await profilesService.create(getAllProfilesObject2);

        const SignUpProfile = new CreateProfileDTO(
          'Kasper',
          'Tester',
          'Copenhagen', // City
          '1050', // ZipCode
          'test@mail.dk',
          '123456789',
          true,
          true,
          true // Status - seeking
        );

        const signUpResponse = await request(app.getHttpServer())
          .post('/profiles/auth/sign-up')
          .send(SignUpProfile)
          .expect(201);

        // Act
        const token = signUpResponse.body.access_token;

        const response = await request(app.getHttpServer())
          .get('/profiles')
          .set('Authorization', `Bearer ${token}`);

        // Assert
        expect(response.body.length).toBeLessThanOrEqual(2);
        expect(response.status).toBe(200);
      });
    });
   });
   
    // Closing app after all tests => not hanging.
    afterAll(async () => {
    app.close();
  });
});
