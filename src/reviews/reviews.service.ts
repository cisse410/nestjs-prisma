import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ReviewsService {
  constructor(private readonly databaseService: DatabaseService) {}
  create(createReviewDto: Prisma.ReviewCreateInput) {
    return this.databaseService.review.create({
      data: createReviewDto,
      include: {
        product: true,
      },
    });
  }

  findAll() {
    return this.databaseService.review.findMany({
      include: {
        product: true,
      },
    });
  }

  findOne(id: number) {
    return this.databaseService.review.findUnique({
      where: {
        id,
      },
      include: {
        product: true,
      },
    });
  }

  update(id: number, updateReviewDto: Prisma.ReviewUpdateInput) {
    return this.databaseService.review.update({
      where: {
        id,
      },
      data: updateReviewDto,
      include: {
        product: true,
      },
    });
  }

  remove(id: number) {
    return this.databaseService.review.delete({
      where: {
        id,
      },
    });
  }
}
