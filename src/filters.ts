export const readyFilters = {
  text: (select?: string[]) => (ctx: any) =>
    !!select ? select.includes(ctx.message?.text) : !!ctx.message?.text,
  url: () => (ctx: any) => ctx.message?.entities?.find((entity: any) => entity.type === 'url'),
  email: () => (ctx: any) => ctx.message?.entities?.find((entity: any) => entity.type === 'email'),
  phone: () => (ctx: any) =>
    ctx.message?.entities?.find((entity: any) => entity.type === 'phone_number'),
};
