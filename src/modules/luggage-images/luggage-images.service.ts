import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LuggageImages } from 'common/database/entities/luggage-imgs.entity';
import { Luggage } from 'common/database/entities/luggage.entity';
import * as fs from 'fs';
import { Repository } from 'typeorm';

@Injectable()
export class LuggageImagesService {
  constructor(
    @InjectRepository(LuggageImages)
    private readonly luggageImagesRepository: Repository<LuggageImages>,
    @InjectRepository(Luggage)
    private readonly luggageRepository: Repository<Luggage>,
  ) {}

  async getLuggageByOrderId(orderId: number): Promise<Luggage[]> {
    try {
      const luggages = await this.luggageRepository.find({
        where: { order: { id: orderId } },
        relations: ['imgs'],
      });

      if (!luggages.length) {
        throw new NotFoundException(`No luggage found for Order ID ${orderId}`);
      }

      return luggages;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new Error('An unexpected error occurred while fetching luggage.');
    }
  }

  async uploadImage(file: Express.Multer.File | null | undefined, luggageId: number): Promise<string> {
    try {
      if (!file) {
        throw new BadRequestException('File must be provided.');
      }

      const luggage = await this.luggageRepository.findOne({ where: { id: luggageId } });
      if (!luggage) {
        throw new NotFoundException(`Luggage with ID ${luggageId} not found`);
      }

      if (!file.path) {
        throw new BadRequestException('File path is invalid or empty.');
      }

      const newImage = this.luggageImagesRepository.create({
        link: file.path,
        luggage,
      });

      await this.luggageImagesRepository.save(newImage);

      return `Image uploaded successfully for luggage ID ${luggageId}`;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new Error('An unexpected error occurred while uploading the image.');
    }
  }

  async deleteImages(luggageId: number): Promise<string> {
    try {
      const luggage = await this.luggageRepository.findOne({
        where: { id: luggageId },
        relations: ['imgs'],
      });

      if (!luggage) {
        throw new NotFoundException(`Luggage with ID ${luggageId} not found.`);
      }

      if (luggage.imgs.length === 0) {
        return `No images found for luggage ID ${luggageId}.`;
      }

      luggage.imgs.forEach((image) => {
        if (fs.existsSync(image.link)) {
          fs.unlinkSync(image.link);
        }
      });

      await this.luggageImagesRepository.remove(luggage.imgs);

      return `Successfully deleted all images for luggage ID ${luggageId}.`;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('An unexpected error occurred while deleting images.');
    }
  }
}
