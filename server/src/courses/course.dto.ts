import {
  IsInt,
  IsEnum,
  IsString,
  IsPositive,
  Min,
  IsBoolean,
  IsNotEmpty,
} from 'class-validator';
import { Semester } from './course.enum';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEnum(Semester)
  semester: Semester;

  @IsInt()
  @IsPositive()
  @Min(1)
  year: number;

  @IsNotEmpty()
  @IsString()
  courseCode: string;

  @IsNotEmpty()
  @IsString()
  coursebookId: string;
}

export class UpdateCourseDto {
  @IsString()
  stripeCustomeId: string;

  @IsBoolean()
  subscribed: boolean;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEnum(Semester)
  semester: Semester;

  @IsInt()
  @IsPositive()
  @Min(1)
  year: number;

  @IsNotEmpty()
  @IsString()
  courseCode: string;

  @IsNotEmpty()
  @IsString()
  coursebookId: string;
}
