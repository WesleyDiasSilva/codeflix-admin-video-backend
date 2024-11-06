import { CreateCategoryUseCase } from '@core/category/application/use-cases/create-category/create-category.use-case';
import { DeleteCategoryUseCase } from '@core/category/application/use-cases/delete-category/delete-category.use-case';
import { GetCategoryUseCase } from '@core/category/application/use-cases/get-category/get-category.use-case';
import { ListCategoriesUseCase } from '@core/category/application/use-cases/list-category/list-category.use-case';
import { UpdateCategoryUseCase } from '@core/category/application/use-cases/update-category/update-category.use-case';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  @Inject(CreateCategoryUseCase)
  private readonly createUseCase: CreateCategoryUseCase;

  @Inject(GetCategoryUseCase)
  private readonly getCategoryUseCase: GetCategoryUseCase;

  @Inject(ListCategoriesUseCase)
  private readonly listCategoriesUseCase: ListCategoriesUseCase;

  @Inject(UpdateCategoryUseCase)
  private readonly updateCategoryUseCase: UpdateCategoryUseCase;

  @Inject(DeleteCategoryUseCase)
  private readonly deleteCategoryUseCase: DeleteCategoryUseCase;

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.createUseCase.execute(createCategoryDto);
  }

  @Get()
  findAll() {}

  @Get(':id')
  findOne(@Param('id') id: string) {}

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {}

  @Delete(':id')
  remove(@Param('id') id: string) {}
}
