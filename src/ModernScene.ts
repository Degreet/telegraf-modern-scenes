import type { IStep } from './types';
import { Context } from 'telegraf';

export class ModernScene<T extends Context> {
  constructor(readonly name: string, readonly steps: IStep<T>[]) {}
}
