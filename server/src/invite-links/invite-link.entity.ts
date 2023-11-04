import { Course } from 'src/courses/course.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class InviteLink {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public role: string;

  @Column()
  public courseId: string;

  @ManyToOne(() => Course, (course) => course.inviteLinks, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  public course: Course;
}
