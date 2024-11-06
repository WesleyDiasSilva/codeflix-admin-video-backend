import { CategoryOutput } from '@core/category/application/use-cases/common/category-output';
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
  HttpCode,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  CategoryCollectionPresenter,
  CategoryPresenter,
} from './categories.presenter';
import { CreateCategoryDto } from './dto/create-category.dto';
import { SearchCategoriesDTO } from './dto/search-categories.dto';
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
    const output = await this.createUseCase.execute(createCategoryDto);
    return CategoriesController.serialize(output);
  }

  @Get()
  async search(@Query() searchParamsDTO: SearchCategoriesDTO) {
    const output = await this.listCategoriesUseCase.execute(searchParamsDTO);
    return new CategoryCollectionPresenter(output);
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
  ) {
    const output = await this.getCategoryUseCase.execute({ id });
    return CategoriesController.serialize(output);
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const output = await this.updateCategoryUseCase.execute({
      ...updateCategoryDto,
      id,
    });
    return CategoriesController.serialize(output);
  }

  @HttpCode(204)
  @Delete(':id')
  async remove(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
  ) {
    await this.deleteCategoryUseCase.execute({ id });
  }

  static serialize(output: CategoryOutput) {
    return new CategoryPresenter(output);
  }
}
