import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { ContactService } from './contact.service';
import { CreateContactDto, EditContactDto } from './dto';

@UseGuards(JwtGuard)
@Controller('contact')
export class ContactsController {
  constructor(private contactService: ContactService) {}
  @Post()
  async createContact(
    @GetUser('id') userId: string,
    @Body() dto: CreateContactDto,
  ) {
    return this.contactService.createContact(userId, dto);
  }

  @Post('bulk')
  async createBulkContact(
    @GetUser('id') userId: string,
    @Body() dto: CreateContactDto[],
  ) {
    return this.contactService.bulkCreateContact(userId, dto);
  }

  @Get()
  async getContacts(@GetUser('id') userId: string, page = 0, limit = 10) {
    return this.contactService.getContacts(userId, page, limit);
  }

  @Get(':contactId')
  async getContactById(
    @Param('contactId') contactId: string,
    @GetUser('id') userId: string,
  ) {
    return this.contactService.getContactById(userId, contactId);
  }

  @Patch(':contactId')
  async editContactById(
    @Param('contactId') contactId: string,
    @GetUser('id') userId: string,
    @Body()
    dto: EditContactDto,
  ) {
    return this.contactService.editContactById(userId, contactId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':contactId')
  async deleteContactById(
    @Param('contactId') contactId: string,
    @GetUser('id') userId: string,
  ) {
    return this.contactService.deleteContactById(userId, contactId);
  }
}
