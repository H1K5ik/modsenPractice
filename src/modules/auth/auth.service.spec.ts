import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthDto, GoogleUserDto } from '@dto';
import { tokenProps } from '@interfaces';
import { PrismaService } from '@prisma/prisma.service';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, PrismaService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('register', () => {
    it('should throw an error when password is missing', async () => {
      const user: AuthDto = { email: 'test@example.com', password: null };
      await expect(service.register(user)).rejects.toThrow(BadRequestException);
      await expect(service.register(user)).rejects.toThrow(
        'Write user password',
      );
    });

    it('should throw an error when user already exists', async () => {
      const user: AuthDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      await expect(service.register(user)).rejects.toThrow(BadRequestException);
      await expect(service.register(user)).rejects.toThrow('User exists');
    });

    it('should create a new user when user does not exist', async () => {
      const user: AuthDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce(null);
      const result = await service.register(user);
      expect(result).toEqual({
        id: 1,
        email: user.email,
        name: user.email.split('@')[0],
      });
    });
  });

  describe('login', () => {
    it('should throw an error when user does not exist', async () => {
      const user: AuthDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce(null);
      await expect(service.login(user)).rejects.toThrow(BadRequestException);
      await expect(service.login(user)).rejects.toThrow('User does not exist');
    });

    it('should throw an error when password is missing', async () => {
      const user: AuthDto = {
        email: 'test@example.com',
        password: 'hashedPassword',
      };
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce({
        id: 1,
        email: user.email,
        password: 'hashedPassword',
        Token: null,
        roles: 'User',
        name: 'ggster',
        profileImage: null,
      });
      await expect(service.login(user)).rejects.toThrow(BadRequestException);
      await expect(service.login(user)).rejects.toThrow('Write user password');
    });

    it('should throw an error when password is incorrect', async () => {
      const user: AuthDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce({
        id: 1,
        email: user.email,
        password: 'hashedPassword',
        Token: null,
        roles: 'User',
        name: 'ggster',
        profileImage: null,
      });
      await expect(service.login(user)).rejects.toThrow(NotFoundException);
      await expect(service.login(user)).rejects.toThrow(
        'Incorrect password or login',
      );
    });

    it('should return tokens when login is successful', async () => {
      const user: AuthDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce({
        id: 1,
        email: user.email,
        password: 'hashedPassword',
        Token: null,
        roles: 'User',
        name: 'ggster',
        profileImage: null,
      });
      const result: tokenProps = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };
      const loginResult = await service.login(user);
      expect(loginResult).toEqual(result);
    });
  });

  describe('updateTokens', () => {
    it('should return tokens when updating tokens is successful', async () => {
      const token = 'test-token';
      const result: tokenProps = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };
      const updatedTokens = await service.updateTokens(token);
      expect(updatedTokens).toEqual(result);
    });
  });

  describe('googleAuthCallback', () => {
    it('should return tokens when user exists', async () => {
      const user: GoogleUserDto = {
        email: 'test@example.com',
        name: 'Test User',
      };
      const result: tokenProps = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };
      const callbackResult = await service.googleAuthCallback(user);
      expect(callbackResult).toEqual(result);
    });

    it('should create a new user when user does not exist', async () => {
      const user: GoogleUserDto = {
        email: 'test@example.com',
        name: 'Test User',
      };
      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValueOnce(null);
      const result: tokenProps = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };
      const callbackResult = await service.googleAuthCallback(user);
      expect(callbackResult).toEqual(result);
    });
  });
});
