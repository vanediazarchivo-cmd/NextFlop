import { Controller, Post, Body, Get, Param, Put, Delete, Query, Inject, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { CreateMediaDto } from "../dtos/media/create-media.dto";
import { UpdateMediaDto } from "../dtos/media/update-media.dto";
import { MediaResponseDto } from "../dtos/media/media-response.dto";
import { SearchMediaDto } from "../dtos/media/search-media.dto";
import { RateMediaDto } from "../dtos/media/rate-media.dto";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";

import { CreateMediaUseCase } from "../../application/use-cases/media/create-media.use-case";
import { UpdateMediaUseCase } from "../../application/use-cases/media/update-media.use-case";
import { DeleteMediaUseCase } from "../../application/use-cases/media/delete-media.use-case";
import { GetMediaUseCase } from "../../application/use-cases/media/get-media.use-case";
import { ListMediaUseCase } from "../../application/use-cases/media/list-media.usecase";
import { SearchMediaUseCase } from "../../application/use-cases/media/search-media.use-case";
import { IncrementViewCountUseCase } from "../../application/use-cases/media/increment-view.usecase";
import { UpdateRatingUseCase } from "../../application/use-cases/media/update-rating.usecase";
import { CreateMediaDto as CreateMediaPresentationDto } from "../dtos/media/create-media.dto";
import { CreateMediaDto as CreateMediaAppDto } from "../../application/dto/media.dto";

@ApiTags("Media")
@Controller()
export class MediaController {
  constructor(
    private readonly createMediaUseCase: CreateMediaUseCase,
    private readonly updateMediaUseCase: UpdateMediaUseCase,
    private readonly deleteMediaUseCase: DeleteMediaUseCase,
    private readonly getMediaUseCase: GetMediaUseCase,
    private readonly listMediaUseCase: ListMediaUseCase,
    private readonly searchMediaUseCase: SearchMediaUseCase,
    private readonly incrementViewCountUseCase: IncrementViewCountUseCase,
    private readonly updateRatingUseCase: UpdateRatingUseCase,
  ) {}

 @Post()
  //@UseGuards(JwtAuthGuard)
  //@ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Create media item" })
  @ApiResponse({ status: 201, type: MediaResponseDto })
  async create(@Body() dto: CreateMediaPresentationDto): Promise<MediaResponseDto> {
    const appDto: CreateMediaAppDto = {
      title: dto.title,
      description: dto.description ?? "",
      type: dto.type,
      genres: (dto.genres || []).map(g => g.toLowerCase()),
      rating: typeof dto.rating === "number" ? dto.rating : 0,
      maturityRating: dto.maturityRating ?? "G",     
      releaseYear: dto.releaseYear ?? new Date().getFullYear(),
      duration: dto.duration,
      posterUrl: dto.posterUrl ?? "",
      trailerUrl: dto.trailerUrl,
      isActive: dto.isActive ?? true,
    } as unknown as CreateMediaAppDto;

    const created = await this.createMediaUseCase.execute(appDto);
    return this.toDto(created);
  }

  // NOTE: Upload endpoint removed to avoid manual admin uploads.

  @Get()
  @ApiOperation({ summary: "List media" })
  @ApiResponse({ status: 200, type: [MediaResponseDto] })
  async list(@Query("limit") limit?: string, @Query("offset") offset?: string) {
    const l = limit ? parseInt(limit) : 20;
    const o = offset ? parseInt(offset) : 0;
    const result = await this.listMediaUseCase.execute(l, o);
    return {
      total: result.total,
      items: result.media.map((m) => this.toDto(m)),
    };
  }

  @Get("search")
  @ApiOperation({ summary: "Search media" })
  @ApiResponse({ status: 200, type: [MediaResponseDto] })
  async search(@Query() dto: SearchMediaDto) {
    const items = await this.searchMediaUseCase.execute(dto);
    return items.map((m) => this.toDto(m));
  }

  @Get(":id")
  @ApiOperation({ summary: "Get media by id" })
  @ApiResponse({ status: 200, type: MediaResponseDto })
  async get(@Param("id") id: string): Promise<MediaResponseDto | null> {
    const m = await this.getMediaUseCase.execute(id);
    return m ? this.toDto(m) : null;
  }

  @Put(":id")
  //@UseGuards(JwtAuthGuard)
  //@ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Update media" })
  async update(@Param("id") id: string, @Body() dto: UpdateMediaDto): Promise<MediaResponseDto | null> {
    const updated = await this.updateMediaUseCase.execute(id, dto);
    return updated ? this.toDto(updated) : null;
  }

  @Delete(":id")
  //@UseGuards(JwtAuthGuard)
  //@ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Delete media" })
  async remove(@Param("id") id: string): Promise<{ deleted: boolean }> {
    const deleted = await this.deleteMediaUseCase.execute(id);
    return { deleted };
  }

  @Post(":id/increment-view")
  @ApiOperation({ summary: "Increment view count" })
  async incrementView(@Param("id") id: string) {
    const updated = await this.incrementViewCountUseCase.execute(id);
    return this.toDto(updated);
  }

  @Post(":id/rate")
  @ApiOperation({ summary: "Rate a media item" })
  async rate(@Param("id") id: string, @Body() dto: RateMediaDto) {
    const updated = await this.updateRatingUseCase.execute(id, dto.rate);
    return this.toDto(updated);
  }


  private toDto(m: any): MediaResponseDto {
    if (!m) return null;
    return {
      id: m.id,
      title: m.title,
      description: m.description,
      type: m.type,
      genres: m.genres,
      rating: m.rating,
      maturityRating: m.maturityRating,
      releaseYear: m.releaseYear,
      duration: m.duration,
      posterUrl: m.posterUrl,
      trailerUrl: m.trailerUrl,
      isActive: m.isActive,
      viewCount: m.viewCount,
      averageRating: m.averageRating,
      totalRatings: m.totalRatings,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
    };
  }
}
