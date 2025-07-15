import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma-clients/hub-auth';
import { hash } from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}
  async createUser(data: Prisma.userCreateInput) {
    return this.prismaService.user.create({
      data: {
        ...data,
        password: await hash(data.password, 10),
      },
    });
  }
  async getUsers() {
    return this.prismaService.user.findMany();
  }
  async getUser(args: Prisma.userWhereUniqueInput) {
    return this.prismaService.user.findUniqueOrThrow({
      where: args,
    });
  }
}
