# Telegraf Modern Scenes

Modern wizard scenes for Telegraf v4

```
npm install telegraf-modern-scenes
# or
yarn add telegraf-modern-scenes
```

# Example

index.ts

```typescript
import { Telegraf, Context } from 'telegraf';
import { IModernSceneContextFlavor, ModernScenesInstaller } from 'telegraf-modern-scenes';
import { testScene } from './scenes/test.scene';

type MyContext = Context & IModernSceneContextFlavor;
const bot = new Telegraf<MyContext>('TOKEN');

const modernScenesInstaller = new ModernScenesInstaller([testScene])
bot.use(modernScenesInstaller.activateSceneController());

bot.command('cancel', (ctx) => ctx.modernScene.leave());
bot.use(modernScenesInstaller.middleware());

bot.command('test', (ctx) => ctx.modernScene.enter('test'));
bot.launch();
```

scenes/test.scene.ts

```typescript
import { ModernScene } from 'telegraf-modern-scenes';
type MyContext = Context & IModernSceneContextFlavor;

export const testScene = new ModernScene<MyContext>('test', [
  {
    async handler(ctx, data) {
      data.some = 1;
      await ctx.reply('Hello, world!');
      return ctx.modernScene.next();
    },
  },
  {
    filter: (ctx) => !!ctx.message?.text, // only text messages
    async handler(ctx, data) {
      if (ctx.message?.text === 'skip') return ctx.modernScene.skip('last_example_step');
      
      data.some++;
      await ctx.reply('Hello, world! 2');
      return ctx.modernScene.next();
    },
  },
  {
    async handler(ctx, data) {
      await ctx.reply('Hello, world! 3');
      console.log(data);
      return ctx.modernScene.leave();
    },
  },
  {
    name: 'last_example_step',
    async handler(ctx, data) {
      await ctx.reply('Hello, world! skipped');
      console.log(data);
      return ctx.modernScene.leave();
    },
  },
]);
```

# Custom storage

You can pass custom storage as second argument to ModernScenesInstaller constructor. It can be object with getters/setters.

# Debug

```typescript
import debug from 'debug'; // typescript
const debug = require('debug'); // javascript

debug.enable('telegraf:scenes');
```
