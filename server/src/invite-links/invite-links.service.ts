import { Injectable } from '@nestjs/common';
import { Role } from 'src/commons/role.enum';
import { InviteLinkRepository } from './invite-links.repository';
import { CreateInviteLinkDto } from './invite-link.dto';

@Injectable()
export class InviteLinksService {
  constructor(private inviteLinkRepository: InviteLinkRepository) {}

  async createInviteLinks(courseId: string) {
    const studentLink: CreateInviteLinkDto = {
      courseId: courseId,
      role: Role.STUDENT,
    };

    const TALink: CreateInviteLinkDto = {
      courseId: courseId,
      role: Role.TA,
    };

    return this.inviteLinkRepository.createInviteLinks([studentLink, TALink]);
  }
}
