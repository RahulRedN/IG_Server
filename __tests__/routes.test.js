const request = require('supertest');
const express = require('express');
const { StatusCodes } = require('http-status-codes');
const authRoutes = require('../routes/authRoute');
const authController = require('../controllers/authController');

// Create an Express app
const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

describe('Login Jobseeker', () => {
  it('should return a valid JWT token and cookie if credentials are correct', async () => {
    // Mock jobseeker data
    const mockJobseeker = {
      _id: 'mockId',
      fname: 'John',
      email: 'john@example.com',
      comparePassword: jest.fn().mockResolvedValue(true), // Mock password comparison function
    };

    // Mock Jobseeker.findOne method
    const Jobseeker = {
      findOne: jest.fn().mockResolvedValue(mockJobseeker),
    };

    // Mock createTokenUser and attachCookiesToResponse functions
    const mockToken = 'mockToken';
    const mockCookie = 'mockCookie';
    const utils = {
      createTokenUser: jest.fn().mockReturnValue(mockToken),
      attachCookiesToResponse: jest.fn().mockReturnValue(mockCookie),
    };

    // Mock req and res objects
    const req = {
      body: {
        email: 'john@example.com',
        password: 'password123',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Override Jobseeker model and utility functions in authController
    jest.spyOn(authController, 'Jobseeker', 'get').mockReturnValue(Jobseeker);
    jest.spyOn(authController, 'createTokenUser').mockImplementation(utils.createTokenUser);
    jest.spyOn(authController, 'attachCookiesToResponse').mockImplementation(utils.attachCookiesToResponse);

    // Send POST request to loginJobseeker endpoint
    await request(app)
      .post('/auth/loginJobseeker')
      .send(req.body)
      .expect(StatusCodes.OK)
      .then((response) => {
        // Verify response
        expect(response.body).toEqual({
          Jobseeker: mockToken,
          cookie: mockCookie,
        });

        // Verify Jobseeker.findOne is called with correct email
        expect(Jobseeker.findOne).toHaveBeenCalledWith({ email: req.body.email });

        // Verify comparePassword is called with correct password
        expect(mockJobseeker.comparePassword).toHaveBeenCalledWith(req.body.password);

        // Verify createTokenUser is called with correct data
        expect(utils.createTokenUser).toHaveBeenCalledWith({
          name: mockJobseeker.fname,
          _id: mockJobseeker._id,
          role: 'jobseeker',
        });

        // Verify attachCookiesToResponse is called with correct data
        expect(utils.attachCookiesToResponse).toHaveBeenCalledWith({ res, user: mockToken });
      });
  });

  it('should return an error if email does not exist', async () => {
    // Mock Jobseeker.findOne method to return null
    const Jobseeker = {
      findOne: jest.fn().mockResolvedValue(null),
    };

    // Override Jobseeker model in authController
    jest.spyOn(authController, 'Jobseeker', 'get').mockReturnValue(Jobseeker);

    // Send POST request to loginJobseeker endpoint
    await request(app)
      .post('/auth/loginJobseeker')
      .send({ email: 'nonexistent@example.com', password: 'password123' })
      .expect(StatusCodes.UNAUTHORIZED)
      .then((response) => {
        // Verify error response
        expect(response.body).toEqual({ msg: 'Email does not exist!' });

        // Verify Jobseeker.findOne is called with correct email
        expect(Jobseeker.findOne).toHaveBeenCalledWith({ email: 'nonexistent@example.com' });
      });
  });

  it('should return an error if password is invalid', async () => {
    // Mock jobseeker data
    const mockJobseeker = {
      comparePassword: jest.fn().mockResolvedValue(false), // Mock invalid password
    };

    // Mock Jobseeker.findOne method to return mockJobseeker
    const Jobseeker = {
      findOne: jest.fn().mockResolvedValue(mockJobseeker),
    };

    // Override Jobseeker model in authController
    jest.spyOn(authController, 'Jobseeker', 'get').mockReturnValue(Jobseeker);

    // Send POST request to loginJobseeker endpoint
    await request(app)
      .post('/auth/loginJobseeker')
      .send({ email: 'john@example.com', password: 'wrongpassword' })
      .expect(StatusCodes.UNAUTHORIZED)
      .then((response) => {
        // Verify error response
        expect(response.body).toEqual({ msg: 'Invalid password!' });

        // Verify Jobseeker.findOne is called with correct email
        expect(Jobseeker.findOne).toHaveBeenCalledWith({ email: 'john@example.com' });

        // Verify comparePassword is called with correct password
        expect(mockJobseeker.comparePassword).toHaveBeenCalledWith('wrongpassword');
      });
  });

  it('should return an error if email or password is missing', async () => {
    // Send POST request to loginJobseeker endpoint with missing email
    await request(app)
      .post('/auth/loginJobseeker')
      .send({ password: 'password123' })
      .expect(StatusCodes.BAD_REQUEST)
      .then((response) => {
        // Verify error response
        expect(response.body).toEqual({ msg: 'Please provide email and password!' });
      });

    // Send POST request to loginJobseeker endpoint with missing password
    await request(app)
      .post('/auth/loginJobseeker')
      .send({ email: 'john@example.com' })
      .expect(StatusCodes.BAD_REQUEST)
      .then((response) => {
        // Verify error response
        expect(response.body).toEqual({ msg: 'Please provide email and password!' });
      });
  });
});
