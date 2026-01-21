// src/message/message.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseIntPipe, ForbiddenException,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { ConversationService } from '../conversation/conversation.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type {CreateMessageDto} from "../generated";

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessageController {
  constructor(
      private readonly messageService: MessageService,
      private readonly conversationService: ConversationService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  // Créer un nouveau message
  async create(
      @Body() createMessageDto: CreateMessageDto,
      @CurrentUser() user: any,
  ) {
    const message = await this.messageService.create(createMessageDto, user.id);
    return {
      success: true,
      data: message,
      message: 'Message envoyé avec succès !'
    };
  }

  // Récupérer les messages d'une conversation
  @Get('conversations/:conversationId')
  @HttpCode(HttpStatus.OK)
  async getMessages(
      @Param('conversationId', ParseIntPipe) conversationId: number,
      @CurrentUser() user: any,
  ) {
    const messages = await this.messageService.findAllByConversationId(
        conversationId,
        user.id
    );

    await this.messageService.markAsRead(
        conversationId,
        user.id
    );

    return {
      success: true,
      data: messages,
      count: messages.length,
    };
  }

  // Supprimer un message
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(
      @Param('id', ParseIntPipe) id: number,
      @CurrentUser() user: any,
  ) {
    return this.messageService.remove(id, user.id);
  }
}