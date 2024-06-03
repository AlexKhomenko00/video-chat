import { IsNotEmpty, IsString } from 'class-validator';

export class AnswerDto {
  answer: RTCSessionDescriptionInit;

  @IsString()
  @IsNotEmpty()
  roomName: string;
}
