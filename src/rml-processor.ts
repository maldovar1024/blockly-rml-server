import RMLMapperWrapper from '@rmlio/rmlmapper-java-wrapper';
import fs from 'fs';
import Router from 'koa-router';
import { rmlmapperPath, tmpDir } from './config';
import { RMLExecutorOptions } from './rmlmapper-java-wrapper/lib/wrapper';

if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir);
}

const rmlmapper = new RMLMapperWrapper(rmlmapperPath, tmpDir, true, {
  'Dfile.encoding': 'UTF-8',
});

type RMLMapperBody = RMLExecutorOptions & {
  rml: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function checkRMLRequestBody(body: any): boolean {
  if (!body) {
    return false;
  }

  const { rml, sources, asQuads, generateMetadata, serialization } = body;
  if (typeof rml !== 'string' || typeof sources !== 'object') {
    return false;
  }
  if (generateMetadata !== undefined && typeof generateMetadata !== 'boolean') {
    return false;
  }
  if (asQuads !== undefined && typeof asQuads !== 'boolean') {
    return false;
  }
  if (serialization !== undefined && typeof serialization !== 'string') {
    return false;
  }
  if (typeof asQuads === 'boolean' && typeof serialization === 'string') {
    return false;
  }

  return true;
}

const router = new Router().post('/execute', async ctx => {
  const { body } = ctx.request;
  if (!checkRMLRequestBody(body)) {
    ctx.throw(400, new Error('Invalid arguments'));
  }

  const { rml, ...options } = <RMLMapperBody>body;
  try {
    const result = await rmlmapper.execute(rml, options);
    ctx.response.body = JSON.stringify(result.output);
  } catch (error) {
    ctx.throw(400, error);
  }
});

export default new Router().use(
  '/api',
  router.routes(),
  router.allowedMethods()
);
