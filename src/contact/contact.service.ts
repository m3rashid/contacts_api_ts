import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ForbiddenException, Injectable } from '@nestjs/common';

import { CreateContactDto, EditContactDto } from './dto';
import { Contact, ContactDocument } from './contact.schema';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(Contact.name) private contactModel: Model<ContactDocument>,
  ) {}

  async createContact(userId: string, dto: CreateContactDto) {
    const contact = new this.contactModel({
      user: userId,
      name: dto.name,
      phone: dto.phone,
      info: dto.info,
    });
    await contact.save();
    return contact;
  }

  async bulkCreateContact(userId: string, dto: CreateContactDto[]) {
    const contacts = dto.map((contact) => ({
      user: userId,
      name: contact.name,
      phone: contact.phone,
      info: contact.info,
    }));
    return this.contactModel.insertMany(contacts);
  }

  async getContacts(userId: string, page: number, limit: number) {
    const contacts = await this.contactModel.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          metadata: [{ $count: 'count' }],
          data: [{ $skip: page * limit }, { $limit: limit }],
        },
      },
    ]);

    return {
      contacts: contacts[0].data,
      page,
      limit,
      count:
        contacts[0].metadata.length !== 0 ? contacts[0].metadata[0].count : 0,
    };
  }

  async getContactById(userId: string, contactId: string) {
    const contact = await this.contactModel
      .findById(contactId)
      .populate('user');
    if (!contact || userId !== contact.user._id.toString()) {
      throw new ForbiddenException('Access to Resource Denied');
    }
    return contact;
  }

  async editContactById(
    userId: string,
    contactId: string,
    dto: EditContactDto,
  ) {
    const contact = await this.contactModel.findById(contactId);
    if (!contact || contact.user.toString() !== userId) {
      throw new ForbiddenException('Access to Resource Denied');
    }

    return await this.contactModel.findByIdAndUpdate(contactId, {
      $set: { ...dto },
    });
  }

  async deleteContactById(userId: string, contactId: string) {
    const contact = await this.contactModel.findById(contactId);
    if (!contact || contact.user.toString() !== userId) {
      throw new ForbiddenException('Access to Resource Denied');
    }

    return await this.contactModel.deleteOne({ _id: contactId });
  }
}
