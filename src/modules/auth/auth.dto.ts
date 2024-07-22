import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class SignUpReqDto {
  @ApiProperty({ example: 'username' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z][a-zA-Z0-9]*$/, {
    message:
      'Username must start with an alphabet and can contain alphanumeric characters.',
  })
  @Length(1, 20, {
    message: 'Username can be max 20 characters long.',
  })
  @Transform(({ value }) => value.toLowerCase())
  username: string;

  @ApiProperty({ example: 'Abc@1234' })
  @IsString()
  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$&+,:;=?@#|'<>.^*()_%!-])[A-Za-z\d$&+,:;=?@#|'<>.^*()_%!-]{8,}$/,
    {
      message:
        'Invalid Password. Use 8-15 characters with a mix of letters, numbers & symbols',
    },
  )
  password: string;

  @ApiProperty({ example: 'name' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => {
    return value.toLowerCase();
  })
  name: string;
}

export class LoginReqDto {
  @ApiProperty({ example: 'username' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  username: string;

  @ApiProperty({ example: 'Abc@1234' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
