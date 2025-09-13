import { Hono } from 'hono'
import { renderer } from './renderer'
import { D1Database } from '@cloudflare/workers-types'

type Bindings = {
  DB: D1Database
}
const app = new Hono<{ Bindings: Bindings }>()

app.use(renderer)

app.get('/', (c) => {
  return c.render(<h1>Hello!</h1>)
})

app.get('/hello', (c) => c.text('Hello Cloudflare Workers!'))

app.get('/api/users', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      "SELECT * FROM users"
    ).all();
    return c.json(results);
  } catch (e) {
    return c.json({ err: e }, 500);
  }
})

export default app
