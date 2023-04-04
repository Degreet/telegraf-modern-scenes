import { Context } from 'telegraf';

export type Filter<T extends Context = any> = (ctx: T) => Promise<boolean> | boolean;
export type ExampleContext = Context & IModernSceneContextFlavor;
export type Step<T extends Context> = IStep<T> | Filter<T>;

export interface IStep<T extends Context> {
  name?: string;
  filter?: Filter<T>;
  handler: (ctx: T, data: any) => Promise<any> | any;
}

export interface IStorage {
  [key: string]: {
    currentFilter?: Filter | null;
    activeScene: string | null;
    stepIndex: number;
    data: any;
  };
}

export interface IModernSceneContextFlavor {
  modernScene: {
    enter: (name: string) => any;
    leave: () => any;
    next: (filter?: Filter) => any;
    skip: (name: string, filter?: Filter, disableAutoEnter?: boolean) => any;
  };
}
