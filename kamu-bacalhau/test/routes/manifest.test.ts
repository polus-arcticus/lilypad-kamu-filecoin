import { test } from 'tap'
import { build } from '../helper'
import * as fs from 'node:fs'
import * as FormData from 'form-data'
import { exec } from 'node:child_process'
test('post a yaml manifest', async (t) => {
  t.before(async () => {
    console.log('hello')
    await new Promise((res, rej) => {
      exec('kamu rm ca.bankofcanada.exchange-rates.daily --yes', (error, stdout, stderr) => {
        console.log(error, stdout, stderr)
        res("removed") 
      })
    })
  })
  const app = await build(t)
  
  const form = new FormData()
  form.append('file', fs.createReadStream('/app/test/ca.bankofcanada.exchange-rates.daily.yaml'))
  const res = await app.inject({
    method: 'POST',
    url: '/manifest',
    headers: form.getHeaders(),
    payload: form
  })
  t.match(res.body, 'Added: ca.bankofcanada.exchange-rates.daily')
})
