import { Module } from '@nestjs/common';
import { WebSocketChatGateway } from './chat.gateway';

@Module({
  providers: [WebSocketChatGateway],
})
export class ChatModule {}
