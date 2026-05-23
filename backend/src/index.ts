import { Hono } from 'hono';
import { cors } from 'hono/cors';

interface Env {
  KV: KVNamespace;
}

const app = new Hono<{ Bindings: Env }>();
app.use('*', cors());

app.get('/', (c) => c.json({ status: 'ok', service: 'bus-watch' }));

export default {
  fetch: app.fetch,
  scheduled: async (_event: ScheduledEvent, env: Env, _ctx: ExecutionContext) => {
    console.log('Scheduled refresh triggered');
  },
};