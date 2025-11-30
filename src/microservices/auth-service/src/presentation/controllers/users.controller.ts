import { Controller, Get, Put, Delete, Body, UseGuards, Param } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { GetUserUseCase } from "../../application/use-cases/users/get-user.use-case";
import { UpdateUserUseCase } from "../../application/use-cases/users/update-user.use-case";
import { AddPointsUseCase } from "../../application/use-cases/users/add-points.use-case";
import { DeleteUserUseCase } from "../../application/use-cases/users/delete-user.use-case";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { UpdateUserDto } from "../dtos/auth/update-user.dto";
import { AddPointsDto } from "../dtos/auth/add-points.dto";

@ApiTags("users")
@Controller("users")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(
    private readonly getUserUseCase: GetUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly addPointsUseCase: AddPointsUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) { }

  @Get(":id")
  @ApiOperation({ summary: "Get user by ID" })
  @ApiResponse({ status: 200, description: "User found successfully" })
  async getUser(@Param("id") id: string) {
    return this.getUserUseCase.execute(id);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update user" })
  @ApiResponse({ status: 200, description: "User updated successfully" })
  async updateUser(
    @Param("id") id: string,
    @Body() updateData: UpdateUserDto,
  ) {
    return this.updateUserUseCase.execute(id, updateData);
  }

  @Put(":id/points")
  @ApiOperation({ summary: "Add points to user" })
  @ApiResponse({ status: 200, description: "Points added successfully" })
  async addPoints(
    @Param("id") id: string,
    @Body() pointsData: AddPointsDto,   // 👈 ahora Swagger sabe que debe pedir points y reason
  ) {
    return this.addPointsUseCase.execute(id, pointsData.points, pointsData.reason);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete user" })
  @ApiResponse({ status: 200, description: "User deleted successfully" })
  async deleteUser(@Param("id") id: string) {
    return this.deleteUserUseCase.execute(id);
  }
}
