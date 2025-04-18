import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import { Rol } from '../roles/rol.entity';
//import { HttpException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { MailService } from '../mail/mail.service';

// Mock bcrypt compare
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

const mockMailService = {
    sendResetEmail: jest.fn(), // puedes dejarlo vacío si no se usa
  };
  

describe('AuthService - login', () => {
  let service: AuthService;
  let usersRepository: any;
  let jwtService: JwtService;

  beforeEach(async () => {
    usersRepository = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: usersRepository },
        { provide: getRepositoryToken(Rol), useValue: {} },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('fake-jwt-token'),
          },
        },
        { provide: MailService, useValue: mockMailService }, // 💥 aquí estaba faltando
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should throw if user not found', async () => {
    usersRepository.findOne.mockResolvedValue(null);

    await expect(service.login({ email: 'test@test.com', password: '123' }))
      .rejects
      .toThrow('Email not found');
  });

  it('should throw if user is inactive', async () => {
    usersRepository.findOne.mockResolvedValue({ is_active: false });

    await expect(service.login({ email: 'test@test.com', password: '123' }))
      .rejects
      .toThrow('User is inactive');
  });

  it('should throw if password is invalid', async () => {
    (compare as jest.Mock).mockResolvedValue(false);
    usersRepository.findOne.mockResolvedValue({
      is_active: true,
      password: 'hashedPassword',
      roles: [],
    });

    await expect(service.login({ email: 'test@test.com', password: 'wrong' }))
      .rejects
      .toThrow('Invalid credentials');
  });

  it('should return user and token if credentials are valid', async () => {
    (compare as jest.Mock).mockResolvedValue(true);

    const mockUser = {
      id: 1,
      first_name: 'Nico',
      email: 'test@test.com',
      password: 'hashedPassword',
      roles: [{ id: 1 }, { id: 2 }],
      is_active: true,
    };

    usersRepository.findOne.mockResolvedValue({ ...mockUser });

    const result = await service.login({ email: 'test@test.com', password: '123' });

    expect(result.user.password).toBeUndefined(); // Confirm password was removed
    expect(result.token).toBe('Bearer fake-jwt-token');
    expect(result.user.first_name).toBe('Nico');
    expect(jwtService.sign).toHaveBeenCalledWith({
      id: mockUser.id,
      first_name: mockUser.first_name,
      roles: [1, 2],
    });
  });
});
