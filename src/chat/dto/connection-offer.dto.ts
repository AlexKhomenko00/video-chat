import { IsNotEmpty, IsString } from 'class-validator';

export class ConnectionOfferDto {
  offer: RTCSessionDescriptionInit;

  @IsString()
  @IsNotEmpty()
  roomName: string;
}
