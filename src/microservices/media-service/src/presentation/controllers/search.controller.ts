import { Controller, Get, UseGuards } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"

import type { SearchMediaUseCase } from "../../application/use-cases/media/search-media.use-case"
import type { MediaSearchDto } from "../../application/dto/search.dto"

import { JwtAuthGuard } from "../guards/jwt-auth.guard"

@ApiTags("search")
@Controller("media")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SearchController {
  constructor(private readonly searchMediaUseCase: SearchMediaUseCase) {}

  @Get("search")
  @ApiOperation({ summary: "Search media content" })
  @ApiResponse({ status: 200, description: "Search results retrieved successfully" })
  async searchMedia(searchDto: MediaSearchDto) {
    return this.searchMediaUseCase.execute(searchDto)
  }
}
