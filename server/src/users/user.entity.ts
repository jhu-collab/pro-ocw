import { Invite } from 'src/invites/invite.entity';
import { Member } from 'src/members/member.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ length: 100, nullable: true })
  public fullName: string;

  @Column({ unique: true })
  public email: string;

  @Column()
  password: string;

  @Column({ nullable: false, default: false })
  public hasOnboarded: boolean;

  @Column('jsonb', { nullable: false, default: {} })
  public metadata: string;

  @OneToMany(() => Member, (member) => member.user)
  public members: Member[];

  @OneToMany(() => Invite, (invite) => invite.user)
  public invites: Invite[];
}
