import { Field, ObjectType } from '@nestjs/graphql';
import { AbstractModel } from '@work-hub/nestjs';

@ObjectType()
export class User extends AbstractModel {
  @Field()
  email: string;
}
