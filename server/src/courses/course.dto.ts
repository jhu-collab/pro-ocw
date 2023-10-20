import { IsInt, IsEnum, IsString, IsPositive, Min } from 'class-validator';
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
