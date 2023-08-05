import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Inject,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ClientProxy } from '@nestjs/microservices';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    @Inject('PRODUCT_SERVICE') private readonly client: ClientProxy,
  ) {}

  @Get()
  async findAll() {
    const product = await this.productService.findAll();
    this.client.emit('product_find_all', product);
    return product;
  }

  @Post()
  async create(@Body() dto: CreateProductDto) {
    const product = await this.productService.create(dto);
    this.client.emit('product_create', product);
    return product;
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const product = await this.productService.findOneById(id);
    this.client.emit('product_find', product);
    return product;
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const product = await this.productService.update(+id, updateProductDto);
    this.client.emit('product_update', product);
    return product;
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const product = await this.productService.remove(+id);
    this.client.emit('product_delete', product);
    return product;
  }

  @Post(':id/like')
  async like(@Param('id') id: number) {
    const product = await this.findOne(+id);

    return this.update(id, {
      likes: product.likes + 1,
    });
  }
}
