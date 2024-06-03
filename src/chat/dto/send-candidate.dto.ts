import { IsNotEmpty, IsString } from 'class-validator';

export class SendCandidateDto {
  candidate: unknown;

  @IsString()
  @IsNotEmpty()
  roomName: string;
}
