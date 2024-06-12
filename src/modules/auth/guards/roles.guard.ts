import { Injectable } from '@nestjs/common';
import { RolesStrategy } from '../strategies/roles.strategy';

@Injectable()
export class RolesGuard extends RolesStrategy {}
