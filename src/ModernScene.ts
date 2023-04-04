import type { IStep, Step } from './types';
import { Context } from 'telegraf';

export class ModernScene<T extends Context> {
  steps: IStep<T>[];

  constructor(readonly name: string, _steps: Step<T>[]) {
    // _steps is not formatted this.steps
    this.steps = _steps.map((step) => (typeof step === 'function' ? { handler: step } : step));
  }
}
