import {
  IsInt,
  IsEnum,
  IsString,
  IsPositive,
  Min,
  IsBoolean,
} from 'class-validator';
import { Semester } from './course.enum';

export class CreateCourseDto {
  @IsString()
  name: string;

  @IsEnum(Semester)
  semester: Semester;

  @IsInt()
  @IsPositive()
  @Min(1)
  year: number;

  @IsString()
  courseCode: string;

  @IsString()
  coursebookId: string;
}

export class UpdateCourseDto {
  @IsString()
  stripeCustomeId: string;

  @IsBoolean()
  subscribed: boolean;

  @IsString()
  name: string;

  @IsEnum(Semester)
  semester: Semester;

  @IsInt()
  @IsPositive()
  @Min(1)
  year: number;

  @IsString()
  courseCode: string;

  @IsString()
  coursebookId: string;
}
