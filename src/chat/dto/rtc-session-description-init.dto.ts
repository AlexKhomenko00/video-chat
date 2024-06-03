import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

enum RTCSdpType {
  answer = 'answer',
  offer = 'offer',
  pranswer = 'pranswer',
  rollback = 'rollback',
}

export class RtcSessionDescriptionInitDto implements RTCSessionDescriptionInit {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  sdp?: string;

  @IsEnum(RTCSdpType)
  type: RTCSdpType;
}
