import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ProductsService {
  constructor(private readonly databaseService: DatabaseService) {}
  async create(createProductDto: Prisma.ProductCreateInput) {
    return this.databaseService.product.create({
      data: createProductDto,
      include: { image: true, tags: true, reviews: true },
    });
  }

  async findAll() {
    return this.databaseService.product.findMany({
      include: {
        image: true,
        tags: true,
        reviews: true,
      },
    });
  }

  async findOne(id: number) {
    return this.databaseService.product.findUnique({
      where: {
        id,
      },
      include: {
        image: true,
        tags: true,
        reviews: true,
      },
    });
  }

  async update(id: number, updateProductDto: Prisma.ProductUpdateInput) {
    return this.databaseService.product.update({
      where: {
        id,
      },
      data: updateProductDto,
      include: {
        image: true,
        tags: true,
        reviews: true,
      },
    });
  }

  async remove(id: number) {
    return this.databaseService.product.delete({
      where: {
        id,
      },
    });
  }
}
