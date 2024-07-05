import { Test, TestingModule } from '@nestjs/testing';

import { AuthDto, UserDto } from '@dto';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should register a new user', async () => {
    const mockDto: AuthDto = { email: 'test@example.com', password: 'test123' };
    const mockUser: UserDto = {
      id: 1,
      email: 'test@example.com',
      name: 'test',
    };

    jest.spyOn(service, 'register').mockResolvedValue(mockUser);

    expect(await controller.register(mockDto)).toEqual(mockUser);
  });
  it('should log in a user', async () => {
    const mockDto: AuthDto = { email: 'test@example.com', password: 'test123' };
    const mockTokens = { accessToken: 'token123', refreshToken: 'refresh123' };

    jest.spyOn(service, 'login').mockResolvedValue(mockTokens);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = { cookie: jest.fn() } as any;

    await controller.login(mockDto, res);

    expect(res.cookie).toBeCalledTimes(2);
    expect(res.cookie).nthCalledWith(1, 'accessToken', mockTokens.accessToken, {
      httpOnly: true,
    });
    expect(res.cookie).nthCalledWith(
      2,
      'refreshToken',
      mockTokens.refreshToken,
      { httpOnly: true },
    );
  });
  it('should update tokens', async () => {
    const mockRefreshToken = 'refresh123';
    const mockTokens = { accessToken: 'token123', refreshToken: 'refresh123' };

    jest.spyOn(service, 'updateTokens').mockResolvedValue(mockTokens);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const req = { cookies: { refreshToken: mockRefreshToken } } as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = { cookie: jest.fn() } as any;

    await controller.update(req, res);

    expect(res.cookie).toBeCalledTimes(2);
    expect(res.cookie).nthCalledWith(1, 'accessToken', mockTokens.accessToken, {
      httpOnly: true,
    });
    expect(res.cookie).nthCalledWith(
      2,
      'refreshToken',
      mockTokens.refreshToken,
      { httpOnly: true },
    );
  });
});
