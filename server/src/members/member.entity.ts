import { Course } from 'src/courses/course.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@Index(['userId', 'courseId'], { unique: true }) // one user can only be a member of a course once
export class Member {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  public createdAt: Date;

  @Column()
  public role: string;

  @Column()
  public userId: string;

  @Column()
  public courseId: string;

  @ManyToOne(() => User, (user) => user.members, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  public user: User;

  @ManyToOne(() => Course, (course) => course.members, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  public course: Course;
}
