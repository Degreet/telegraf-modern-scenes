import { ModernScene } from './ModernScene';
import { ExampleContext, IStorage } from './types';
import { log } from './debug';

export class ModernScenesInstaller<T extends ExampleContext = ExampleContext> {
  constructor(readonly scenes: ModernScene<T>[], readonly storage: IStorage = {}) {}

  activateSceneController() {
    log('Activate scene controller');

    return (ctx: T, next: Function) => {
      ctx.modernScene = {
        enter: (name: string) => {
          log('Enter scene', name);

          if (!ctx.chat) return;
          const storageCell = this.storage[ctx.chat.id.toString()];
          if (!storageCell) return;

          const activeScene = this.scenes.find((scene) => scene.name === name);
          if (!activeScene) return;

          storageCell.activeScene = name;
          storageCell.stepIndex = 0;
          storageCell.data = {};

          activeScene.steps[0].handler(ctx, storageCell.data);
        },
        leave: () => {
          log('Leave scene');

          if (!ctx.chat) return;
          const storageCell = this.storage[ctx.chat.id.toString()];
          if (!storageCell) return;

          storageCell.activeScene = null;
          storageCell.stepIndex = 0;
          storageCell.data = {};
        },
        next: () => {
          log('Next scene step');

          if (!ctx.chat) return;
          const storageCell = this.storage[ctx.chat.id.toString()];
          if (storageCell) storageCell.stepIndex++;
        },
        skip: (name: string) => {
          log('Skip scene steps to', name);

          if (!ctx.chat) return;
          const storageCell = this.storage[ctx.chat.id.toString()];
          if (!storageCell || !storageCell.activeScene) return;

          const activeScene = this.scenes.find((scene) => scene.name === storageCell.activeScene);
          if (!activeScene) return;

          const stepIndex = activeScene.steps.findIndex((step) => step.name === name);
          if (stepIndex < 0) return;

          storageCell.stepIndex = stepIndex;
        },
      };

      return next();
    };
  }

  middleware() {
    log('Apply modern scenes middleware');

    return (ctx: T, next: Function) => {
      if (!ctx.chat) return;

      this.storage[ctx.chat.id.toString()] ??= {
        activeScene: null,
        stepIndex: 0,
        data: {},
      };

      const storageCell = this.storage[ctx.chat.id.toString()];
      if (!storageCell.activeScene) return next();

      const activeScene = this.scenes.find((scene) => scene.name === storageCell.activeScene);
      if (!activeScene || !activeScene.steps[storageCell.stepIndex]) {
        storageCell.activeScene = null;
        return next();
      }

      activeScene.steps[storageCell.stepIndex].handler(ctx, storageCell.data);
    };
  }
}
