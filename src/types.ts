import { Context } from 'telegraf';

export interface IStep<T> {
  name?: string;
  filter?: (ctx: T) => Promise<boolean> | boolean;
  handler: (ctx: T, data: any) => Promise<any> | any;
}

export interface IStorage {
  [key: string]: {
    activeScene: string | null;
    stepIndex: number;
    data: any;
  };
}

export interface IModernSceneContextFlavor {
  modernScene: {
    enter: (name: string) => any;
    leave: () => any;
    next: () => any;
    skip: (name: string) => any;
  };
}

export type ExampleContext = Context & IModernSceneContextFlavor;
