import { test } from 'tap'
import { build } from '../helper'
//import * as fs from 'node:fs'
import * as FormData from 'form-data'
//import { exec } from 'node:child_process'
test('post a yaml manifest', async (t) => {
  t.before(async () => {
    console.log('hello')
  })
  const app = await build(t)
  const form = new FormData()
  const res = await app.inject({
    method: 'GET',
    url: '/dpid/46',
    headers: form.getHeaders(),
    payload: form
  })
  console.log(JSON.parse(res.body))
  t.equal(JSON.parse(res.body).length, 4)

})
