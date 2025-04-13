import { SetMetadata } from "@nestjs/common"
import { JwtRole } from "./jwt-role"

export const hasRoles = (...roles: JwtRole[]) => SetMetadata('roles', roles)