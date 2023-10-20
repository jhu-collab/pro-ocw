import { Course } from 'src/courses/course.entity';
import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
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

  @ManyToOne(() => User, (user) => user.members)
  public user: User;

  @ManyToOne(() => Course, (course) => course.members)
  public course: Course;
}
