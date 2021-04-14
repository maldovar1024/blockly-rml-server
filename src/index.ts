import Koa from 'koa';
import bodyParser from 'koa-body';
import logger from 'koa-logger';
import serve from 'koa-static';
import fs from 'fs/promises';
import { constants } from 'fs';
import path from 'path';

const staticPath = path.resolve(__dirname, '../build');
const staticServe = serve(staticPath);

const app = new Koa();

app.use(logger());
app.use(bodyParser());
app.use(async (ctx, next) => {
  const targetPath = path.resolve(staticPath, `./${ctx.path}`);
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
