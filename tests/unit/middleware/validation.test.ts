// tests/unit/middleware/validation.test.ts
import { Request, Response, NextFunction } from 'express';
import { validationMiddleware } from '../../../src/middleware/validation';

describe('Validation Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let responseObject: any;

  beforeEach(() => {
    responseObject = {};
    mockRequest = {
      body: {},
      params: {},
      query: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((result) => {
        responseObject = result;
        return mockResponse;
      }),
    };
    mockNext = jest.fn();
  });

  describe('validateCreateGame', () => {
    it('should pass validation with valid name', () => {
      mockRequest.body = { name: 'Test Game' };
      
      validationMiddleware.validateCreateGame(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should pass validation with undefined name', () => {
      mockRequest.body = {};
      
      validationMiddleware.validateCreateGame(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should fail validation with null name', () => {
      mockRequest.body = { name: null };
      
      validationMiddleware.validateCreateGame(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: 'Bad Request',
        message: 'Name must be a string'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should fail validation with non-string name', () => {
      mockRequest.body = { name: 123 };
      
      validationMiddleware.validateCreateGame(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: 'Bad Request',
        message: 'Name must be a string'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should fail validation with name longer than 100 characters', () => {
      const longName = 'a'.repeat(101);
      mockRequest.body = { name: longName };
      
      validationMiddleware.validateCreateGame(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: 'Bad Request',
        message: 'Game name must be 100 characters or less'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should pass validation with name exactly 100 characters', () => {
      const name = 'a'.repeat(100);
      mockRequest.body = { name };
      
      validationMiddleware.validateCreateGame(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should handle empty body', () => {
      mockRequest.body = undefined;
      
      validationMiddleware.validateCreateGame(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });
  });

  describe('validateJoinGame', () => {
    const validUuid = '123e4567-e89b-12d3-a456-426614174000';

    it('should pass validation with valid playerId', () => {
      mockRequest.body = { playerId: validUuid };
      
      validationMiddleware.validateJoinGame(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should fail validation with missing playerId', () => {
      mockRequest.body = {};
      
      validationMiddleware.validateJoinGame(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: 'Bad Request',
        message: 'playerId is required and must be a string'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should fail validation with non-string playerId', () => {
      mockRequest.body = { playerId: 123 };
      
      validationMiddleware.validateJoinGame(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: 'Bad Request',
        message: 'playerId is required and must be a string'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should fail validation with invalid UUID', () => {
      mockRequest.body = { playerId: 'invalid-uuid' };
      
      validationMiddleware.validateJoinGame(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: 'Bad Request',
        message: 'playerId must be a valid UUID'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle empty body', () => {
      mockRequest.body = undefined;
      
      validationMiddleware.validateJoinGame(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: 'Bad Request',
        message: 'playerId is required and must be a string'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('validateMakeMove', () => {
    const validUuid = '123e4567-e89b-12d3-a456-426614174000';

    it('should pass validation with valid move', () => {
      mockRequest.body = { playerId: validUuid, row: 1, col: 2 };
      
      validationMiddleware.validateMakeMove(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should pass validation with move at corner (0,0)', () => {
      mockRequest.body = { playerId: validUuid, row: 0, col: 0 };
      
      validationMiddleware.validateMakeMove(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should pass validation with move at corner (2,2)', () => {
      mockRequest.body = { playerId: validUuid, row: 2, col: 2 };
      
      validationMiddleware.validateMakeMove(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should fail validation with missing playerId', () => {
      mockRequest.body = { row: 1, col: 2 };
      
      validationMiddleware.validateMakeMove(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: 'Bad Request',
        message: 'playerId is required and must be a string'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should fail validation with invalid UUID', () => {
      mockRequest.body = { playerId: 'invalid-uuid', row: 1, col: 2 };
      
      validationMiddleware.validateMakeMove(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: 'Bad Request',
        message: 'playerId must be a valid UUID'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should fail validation with non-integer row', () => {
      mockRequest.body = { playerId: validUuid, row: '1', col: 2 };
      
      validationMiddleware.validateMakeMove(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: 'Bad Request',
        message: 'row and col must be integers'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should fail validation with non-integer col', () => {
      mockRequest.body = { playerId: validUuid, row: 1, col: '2' };
      
      validationMiddleware.validateMakeMove(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: 'Bad Request',
        message: 'row and col must be integers'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should fail validation with row out of bounds (negative)', () => {
      mockRequest.body = { playerId: validUuid, row: -1, col: 2 };
      
      validationMiddleware.validateMakeMove(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: 'Bad Request',
        message: 'Move coordinates must be between 0 and 2'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should fail validation with row out of bounds (too high)', () => {
      mockRequest.body = { playerId: validUuid, row: 3, col: 2 };
      
      validationMiddleware.validateMakeMove(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: 'Bad Request',
        message: 'Move coordinates must be between 0 and 2'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should fail validation with col out of bounds (negative)', () => {
      mockRequest.body = { playerId: validUuid, row: 1, col: -1 };
      
      validationMiddleware.validateMakeMove(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: 'Bad Request',
        message: 'Move coordinates must be between 0 and 2'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should fail validation with col out of bounds (too high)', () => {
      mockRequest.body = { playerId: validUuid, row: 1, col: 3 };
      
      validationMiddleware.validateMakeMove(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: 'Bad Request',
        message: 'Move coordinates must be between 0 and 2'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should fail validation with float coordinates', () => {
      mockRequest.body = { playerId: validUuid, row: 1.5, col: 2 };
      
      validationMiddleware.validateMakeMove(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: 'Bad Request',
        message: 'row and col must be integers'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('validateCreatePlayer', () => {
    it('should pass validation with valid name and email', () => {
      mockRequest.body = { name: 'John Doe', email: 'john@example.com' };
      
      validationMiddleware.validateCreatePlayer(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should fail validation with missing name', () => {
      mockRequest.body = { email: 'john@example.com' };
      
      validationMiddleware.validateCreatePlayer(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: 'Bad Request',
        message: 'Name is required and must be a string'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should fail validation with non-string name', () => {
      mockRequest.body = { name: 123, email: 'john@example.com' };
      
      validationMiddleware.validateCreatePlayer(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: 'Bad Request',
        message: 'Name is required and must be a string'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should fail validation with empty name', () => {
      mockRequest.body = { name: '', email: 'john@example.com' };
      
      validationMiddleware.validateCreatePlayer(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: 'Bad Request',
        message: 'Name is required and must be a string'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should fail validation with whitespace-only name', () => {
      mockRequest.body = { name: '   ', email: 'john@example.com' };
      
      validationMiddleware.validateCreatePlayer(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: 'Bad Request',
        message: 'Name cannot be empty'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should fail validation with name longer than 100 characters', () => {
      const longName = 'a'.repeat(101);
      mockRequest.body = { name: longName, email: 'john@example.com' };
      
      validationMiddleware.validateCreatePlayer(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: 'Bad Request',
        message: 'Name must be 100 characters or less'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should pass validation with name exactly 100 characters', () => {
      const name = 'a'.repeat(100);
      mockRequest.body = { name, email: 'john@example.com' };
      
      validationMiddleware.validateCreatePlayer(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should fail validation with missing email', () => {
      mockRequest.body = { name: 'John Doe' };
      
      validationMiddleware.validateCreatePlayer(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: 'Bad Request',
        message: 'Email is required and must be a string'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should fail validation with non-string email', () => {
      mockRequest.body = { name: 'John Doe', email: 123 };
      
      validationMiddleware.validateCreatePlayer(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: 'Bad Request',
        message: 'Email is required and must be a string'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should fail validation with empty email', () => {
      mockRequest.body = { name: 'John Doe', email: '' };
      
      validationMiddleware.validateCreatePlayer(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: 'Bad Request',
        message: 'Email is required and must be a string'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should fail validation with whitespace-only email', () => {
      mockRequest.body = { name: 'John Doe', email: '   ' };
      
      validationMiddleware.validateCreatePlayer(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: 'Bad Request',
        message: 'Email cannot be empty'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should fail validation with invalid email format', () => {
      mockRequest.body = { name: 'John Doe', email: 'invalid-email' };
      
      validationMiddleware.validateCreatePlayer(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: 'Bad Request',
        message: 'Email must be a valid email address'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should fail validation with email missing @ symbol', () => {
      mockRequest.body = { name: 'John Doe', email: 'johnexample.com' };
      
      validationMiddleware.validateCreatePlayer(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: 'Bad Request',
        message: 'Email must be a valid email address'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should fail validation with email missing domain', () => {
      mockRequest.body = { name: 'John Doe', email: 'john@' };
      
      validationMiddleware.validateCreatePlayer(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: 'Bad Request',
        message: 'Email must be a valid email address'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should pass validation with various valid email formats', () => {
      const validEmails = [
        'user@domain.com',
        'user.name@domain.com',
        'user+tag@domain.co.uk',
        'user123@subdomain.domain.org'
      ];

      validEmails.forEach(email => {
        mockRequest.body = { name: 'John Doe', email };
        (mockNext as jest.Mock).mockClear();
        (mockResponse.status as jest.Mock).mockClear();
        (mockResponse.json as jest.Mock).mockClear();
        
        validationMiddleware.validateCreatePlayer(mockRequest as Request, mockResponse as Response, mockNext);
        
        expect(mockNext).toHaveBeenCalled();
        expect(mockResponse.status).not.toHaveBeenCalled();
      });
    });
  });

  describe('validateUpdatePlayer', () => {
    it('should pass validation with valid name only', () => {
      mockRequest.body = { name: 'John Doe' };
      
      validationMiddleware.validateUpdatePlayer(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should pass validation with valid email only', () => {
      mockRequest.body = { email: 'john@example.com' };
      
      validationMiddleware.validateUpdatePlayer(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should pass validation with both valid name and email', () => {
      mockRequest.body = { name: 'John Doe', email: 'john@example.com' };
      
      validationMiddleware.validateUpdatePlayer(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should fail validation with no fields provided', () => {
      mockRequest.body = {};
      
      validationMiddleware.validateUpdatePlayer(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: 'Bad Request',
        message: 'At least one field (name or email) must be provided'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should fail validation with both fields undefined', () => {
      mockRequest.body = { name: undefined, email: undefined };
      
      validationMiddleware.validateUpdatePlayer(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: 'Bad Request',
        message: 'At least one field (name or email) must be provided'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should fail validation with non-string name', () => {
      mockRequest.body = { name: 123 };
      
      validationMiddleware.validateUpdatePlayer(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: 'Bad Request',
        message: 'Name must be a string'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should fail validation with empty name', () => {
      mockRequest.body = { name: '' };
      
      validationMiddleware.validateUpdatePlayer(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: 'Bad Request',
        message: 'Name cannot be empty'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should fail validation with name longer than 100 characters', () => {
      const longName = 'a'.repeat(101);
      mockRequest.body = { name: longName };
      
      validationMiddleware.validateUpdatePlayer(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: 'Bad Request',
        message: 'Name must be 100 characters or less'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should fail validation with non-string email', () => {
      mockRequest.body = { email: 123 };
      
      validationMiddleware.validateUpdatePlayer(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: 'Bad Request',
        message: 'Email must be a string'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should fail validation with empty email', () => {
      mockRequest.body = { email: '' };
      
      validationMiddleware.validateUpdatePlayer(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: 'Bad Request',
        message: 'Email cannot be empty'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should fail validation with invalid email format', () => {
      mockRequest.body = { email: 'invalid-email' };
      
      validationMiddleware.validateUpdatePlayer(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: 'Bad Request',
        message: 'Email must be a valid email address'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should fail validation with null name but valid email', () => {
      mockRequest.body = { name: null, email: 'john@example.com' };
      
      validationMiddleware.validateUpdatePlayer(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: 'Bad Request',
        message: 'Name must be a string'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should fail validation with valid name but null email', () => {
      mockRequest.body = { name: 'John Doe', email: null };
      
      validationMiddleware.validateUpdatePlayer(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: 'Bad Request',
        message: 'Email must be a string'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('validateIdParam', () => {
    const validUuid = '123e4567-e89b-12d3-a456-426614174000';

    it('should pass validation with valid UUID', () => {
      mockRequest.params = { id: validUuid };
      
      validationMiddleware.validateIdParam(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should fail validation with missing id parameter', () => {
      mockRequest.params = {};
      
      validationMiddleware.validateIdParam(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: 'Bad Request',
        message: 'Invalid ID parameter'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should fail validation with non-string id', () => {
      mockRequest.params = { id: '123' as any };
      
      validationMiddleware.validateIdParam(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: 'Bad Request',
        message: 'ID must be a valid UUID'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should fail validation with invalid UUID', () => {
      mockRequest.params = { id: 'invalid-uuid' };
      
      validationMiddleware.validateIdParam(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: 'Bad Request',
        message: 'ID must be a valid UUID'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle undefined params', () => {
      mockRequest.params = undefined;
      
      validationMiddleware.validateIdParam(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: 'Bad Request',
        message: 'Invalid ID parameter'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('validateLeaderboardQuery', () => {
    it('should pass validation with no query parameters', () => {
      mockRequest.query = {};
      
      validationMiddleware.validateLeaderboardQuery(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should pass validation with valid page parameter', () => {
      mockRequest.query = { page: '1' };
      
      validationMiddleware.validateLeaderboardQuery(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should fail validation with invalid page parameter (non-numeric)', () => {
      mockRequest.query = { page: 'abc' };
      
      validationMiddleware.validateLeaderboardQuery(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: 'Bad Request',
        message: 'Page must be a positive integer'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should fail validation with invalid page parameter (zero)', () => {
      mockRequest.query = { page: '0' };
      
      validationMiddleware.validateLeaderboardQuery(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: 'Bad Request',
        message: 'Page must be a positive integer'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should fail validation with invalid page parameter (negative)', () => {
      mockRequest.query = { page: '-1' };
      
      validationMiddleware.validateLeaderboardQuery(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: 'Bad Request',
        message: 'Page must be a positive integer'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should pass validation with valid limit parameter', () => {
      mockRequest.query = { limit: '50' };
      
      validationMiddleware.validateLeaderboardQuery(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should pass validation with limit at maximum (100)', () => {
      mockRequest.query = { limit: '100' };
      
      validationMiddleware.validateLeaderboardQuery(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should fail validation with limit exceeding maximum', () => {
      mockRequest.query = { limit: '101' };
      
      validationMiddleware.validateLeaderboardQuery(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: 'Bad Request',
        message: 'Limit must be a positive integer between 1 and 100'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should fail validation with invalid limit parameter (zero)', () => {
      mockRequest.query = { limit: '0' };
      
      validationMiddleware.validateLeaderboardQuery(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: 'Bad Request',
        message: 'Limit must be a positive integer between 1 and 100'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should pass validation with valid minGames parameter', () => {
      mockRequest.query = { minGames: '5' };
      
      validationMiddleware.validateLeaderboardQuery(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should pass validation with minGames at zero', () => {
      mockRequest.query = { minGames: '0' };
      
      validationMiddleware.validateLeaderboardQuery(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should fail validation with negative minGames', () => {
      mockRequest.query = { minGames: '-1' };
      
      validationMiddleware.validateLeaderboardQuery(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: 'Bad Request',
        message: 'minGames must be a non-negative integer'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should pass validation with valid playerName parameter', () => {
      mockRequest.query = { playerName: 'John Doe' };
      
      validationMiddleware.validateLeaderboardQuery(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should fail validation with empty playerName', () => {
      mockRequest.query = { playerName: '' };
      
      validationMiddleware.validateLeaderboardQuery(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: 'Bad Request',
        message: 'playerName must be a non-empty string'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should fail validation with whitespace-only playerName', () => {
      mockRequest.query = { playerName: '   ' };
      
      validationMiddleware.validateLeaderboardQuery(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: 'Bad Request',
        message: 'playerName must be a non-empty string'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should fail validation with playerName longer than 100 characters', () => {
      const longName = 'a'.repeat(101);
      mockRequest.query = { playerName: longName };
      
      validationMiddleware.validateLeaderboardQuery(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: 'Bad Request',
        message: 'playerName must be 100 characters or less'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should pass validation with valid dateFrom parameter', () => {
      mockRequest.query = { dateFrom: '2023-01-01T00:00:00.000Z' };
      
      validationMiddleware.validateLeaderboardQuery(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should fail validation with invalid dateFrom parameter', () => {
      mockRequest.query = { dateFrom: 'invalid-date' };
      
      validationMiddleware.validateLeaderboardQuery(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: 'Bad Request',
        message: 'dateFrom must be a valid ISO date string'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should pass validation with valid dateTo parameter', () => {
      mockRequest.query = { dateTo: '2023-12-31T23:59:59.999Z' };
      
      validationMiddleware.validateLeaderboardQuery(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should fail validation with invalid dateTo parameter', () => {
      mockRequest.query = { dateTo: 'invalid-date' };
      
      validationMiddleware.validateLeaderboardQuery(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: 'Bad Request',
        message: 'dateTo must be a valid ISO date string'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should pass validation with valid date range', () => {
      mockRequest.query = { 
        dateFrom: '2023-01-01T00:00:00.000Z',
        dateTo: '2023-12-31T23:59:59.999Z'
      };
      
      validationMiddleware.validateLeaderboardQuery(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should pass validation with equal dateFrom and dateTo', () => {
      const date = '2023-06-15T12:00:00.000Z';
      mockRequest.query = { 
        dateFrom: date,
        dateTo: date
      };
      
      validationMiddleware.validateLeaderboardQuery(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should fail validation when dateFrom is after dateTo', () => {
      mockRequest.query = { 
        dateFrom: '2023-12-31T23:59:59.999Z',
        dateTo: '2023-01-01T00:00:00.000Z'
      };
      
      validationMiddleware.validateLeaderboardQuery(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: 'Bad Request',
        message: 'dateFrom must be before or equal to dateTo'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should pass validation with all valid parameters', () => {
      mockRequest.query = {
        page: '2',
        limit: '25',
        minGames: '10',
        playerName: 'John',
        dateFrom: '2023-01-01T00:00:00.000Z',
        dateTo: '2023-12-31T23:59:59.999Z'
      };
      
      validationMiddleware.validateLeaderboardQuery(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });
  });
});
