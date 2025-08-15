import { Field, ObjectType } from '@nestjs/graphql';
import { AbstractModel } from '@workhub/graphql';

@ObjectType()
export class User extends AbstractModel {
  @Field()
  email: string;
}
