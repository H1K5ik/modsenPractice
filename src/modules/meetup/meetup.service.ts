import { Injectable } from '@nestjs/common';

@Injectable()
export class MeetupService {
  constructor() {}
  async getAllMeetups() {}
  async getMeeupById(id: number) {}
  async createMeetup(id: number, dto: string) {}
  async changeMeetup(postId: number, dto: string) {}
  async deleteMeetup(id: number) {}
}
