// src/conversation/conversation.controller.ts
import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseIntPipe, ForbiddenException,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { UpdateConversationStatusDto } from 'src/generated';

@Controller('conversations')
@UseGuards(JwtAuthGuard)
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  // Récupérer les conversations d'un utilisateur'
  @Get()
  @HttpCode(HttpStatus.OK)
  async findMyConversations(@CurrentUser() user: any) {
    const conversations = await this.conversationService.findByUser(
        user.id,
        user.role,
    );
    return {
      success: true,
      data: conversations,
      count: conversations.length,
    };
  }

  // Récupérer une conversation
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
      @Param('id', ParseIntPipe) id: number,
      @CurrentUser() user: any,
  ) {
    const hasAccess = await this.conversationService.userHasAccess(user.id, id);

    if (!hasAccess) {
      throw new ForbiddenException('Accès refusé');
    }

    const conversation = await this.conversationService.findOne(id);
    return { success: true, data: conversation };
  }

  // Changer le statut d'une conversation (ADMIN uniquement)
  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  async updateStatus(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateStatusDto: UpdateConversationStatusDto,
      @CurrentUser() user: any,
  ) {
    const conversation = await this.conversationService.updateStatus(
        id,
        updateStatusDto.status,
        user.id,
    );
    return { success: true, data: conversation, message: 'Mise à jour effectuée avec succès !' };
  }
}