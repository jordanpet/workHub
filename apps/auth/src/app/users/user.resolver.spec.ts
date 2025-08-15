import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { GrpcAuthGuard } from '@workhub/guards';

describe('UserResolver', () => {
  let resolver: UserResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        {
          provide: UserService,
          useValue: {
            createUser: jest
              .fn()
              .mockResolvedValue({ id: 1, name: 'Test User' }),
            getUsers: jest
              .fn()
              .mockResolvedValue([{ id: 1, name: 'Test User' }]),
          },
        },
      ],
    })
      .overrideGuard(GrpcAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) }) // mock guard
      .compile();

    resolver = module.get<UserResolver>(UserResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
