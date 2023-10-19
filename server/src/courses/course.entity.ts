import { Invite } from 'src/invites/invite.entity';
import { Member } from 'src/members/member.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Course {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'timestamptz' })
  public createdAt: Date;

  @Column()
  public stripeCustomerId: string;

  @Column()
  public subscribed: boolean;

  @Column({ unique: true })
  public name: string;

  @Column()
  public semester: string;

  @Column()
  public year: number;

  @Column()
  public courseCode: string;

  @OneToMany(() => Member, (member) => member.course)
  public members: Member[];

  @OneToMany(() => Invite, (invite) => invite.course)
  public invites: Invite[];
}
