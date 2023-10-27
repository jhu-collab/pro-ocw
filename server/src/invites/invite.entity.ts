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
@Index(['userId', 'courseId'], { unique: true }) // enforce unique invites
export class Invite {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  public createdAt: Date;

  @Column()
  public role: string;

  @Column({ default: false })
  public joined: boolean;

  @Column()
  public email: string;

  @Column({ default: false })
  public send: boolean;

  @Column()
  public userId: string; // the id of the user who sent the invite

  @Column()
  public courseId: string;

  @ManyToOne(() => User, (user) => user.invites, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  public user: User; // the user who sent the invite

  @ManyToOne(() => Course, (course) => course.invites, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  public course: Course;
}
