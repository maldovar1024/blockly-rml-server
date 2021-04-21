import { constants } from 'fs';
import fs from 'fs/promises';
import Koa from 'koa';
import bodyParser from 'koa-body';
import compress from 'koa-compress';
import logger from 'koa-logger';
import serve from 'koa-static';
import path from 'path';
import { staticDir } from './config';
import apiRouter from './rml-processor';

const staticServe = serve(staticDir);

const app = new Koa();

app
  .use(logger())
  .use(bodyParser())
  .use(compress({ threshold: 2048, br: false }))
  .use(apiRouter.routes())
  .use(apiRouter.allowedMethods());

app.use(async (ctx, next) => {
  const targetPath = path.resolve(staticDir, `./${ctx.path}`);
  try {
    // 检查路径是否存在
    await fs.access(targetPath, constants.R_OK);
  } catch (error) {
    // 不存在的路径一律转为 index.html
    ctx.path = 'index.html';
  }
  await staticServe(ctx, next);
});

app.onerror = error => {
  console.error(`Server error: ${error}`);
};

const port = Number.parseInt(process.argv[2]);
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}\n`);
});
