import { Injectable } from '@nestjs/common';
import { RolesStrategy } from '../strategies';

@Injectable()
export class RolesGuard extends RolesStrategy {}
