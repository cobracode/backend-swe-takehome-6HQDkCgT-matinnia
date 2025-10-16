// tests/unit/middleware/errorHandler.test.ts
import { Request, Response, NextFunction } from 'express';
import { errorHandler } from '../../../src/middleware/errorHandler';

describe('Error Handler Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let responseObject: any;

  beforeEach(() => {
    responseObject = {};
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((result) => {
        responseObject = result;
        return mockResponse;
      }),
    };
    mockNext = jest.fn();
  });

  describe('Error with statusCode', () => {
    it('should handle error with statusCode property', () => {
      const error = { statusCode: 400, message: 'Bad Request' };
      
      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Bad Request',
        message: 'Bad Request'
      });
    });
  });

  describe('Error with status property', () => {
    it('should handle error with status property', () => {
      const error = { status: 404, message: 'Not Found' };
      
      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Bad Request',
        message: 'Not Found'
      });
    });
  });

  describe('Server errors (5xx)', () => {
    it('should return "Server Error" for 500 status codes', () => {
      const error = { statusCode: 500, message: 'Internal Server Error' };
      
      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Server Error',
        message: 'Internal Server Error'
      });
    });

    it('should return "Server Error" for 503 status codes', () => {
      const error = { statusCode: 503, message: 'Service Unavailable' };
      
      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(503);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Server Error',
        message: 'Service Unavailable'
      });
    });
  });

  describe('Client errors (4xx)', () => {
    it('should return "Bad Request" for 400 status codes', () => {
      const error = { statusCode: 400, message: 'Validation Error' };
      
      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Bad Request',
        message: 'Validation Error'
      });
    });
  });

  describe('Error without status or message', () => {
    it('should handle error without statusCode or status', () => {
      const error = {};
      
      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Server Error',
        message: 'Internal Server Error'
      });
    });

    it('should handle error without message', () => {
      const error = { statusCode: 400 };
      
      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Bad Request',
        message: 'Internal Server Error'
      });
    });
  });

  describe('Error with null/undefined values', () => {
    it('should handle null error', () => {
      errorHandler(null, mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Server Error',
        message: 'Internal Server Error'
      });
    });

    it('should handle undefined error', () => {
      errorHandler(undefined, mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Server Error',
        message: 'Internal Server Error'
      });
    });
  });
});