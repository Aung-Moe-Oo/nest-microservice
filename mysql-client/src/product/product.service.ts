import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    return this.productRepository.save({ ...dto, likes: +dto?.likes || 0 });
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async findOneById(id: number): Promise<Product> {
    return this.productRepository.findOne({ where: { id } });
  }

  async update(id: number, dto: UpdateProductDto) {
    await this.productRepository.update(id, { ...dto, likes: +dto?.likes });
    return this.findOneById(id);
  }

  async remove(id: number) {
    await this.productRepository.delete(id);
    return { id: id };
  }
}
