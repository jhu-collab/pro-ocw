import { Course } from 'src/courses/course.entity';
import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Invite {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'timestamptz' })
  public createdAt: Date;

  @Column()
  public role: string;

  @Column()
  public joined: boolean;

  @Column()
  public email: string;

  @Column()
  public send: boolean;

  @Column()
  public userId: string;

  @Column()
  public courseId: string;

  @ManyToOne(() => User, (user) => user.invites)
  public user: User;

  @ManyToOne(() => Course, (course) => course.invites)
  public course: Course;
}
