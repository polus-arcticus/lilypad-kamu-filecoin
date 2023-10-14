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
        res("removed") 
      })
    })
    await new Promise((res, rej) => {
      exec('ipfs key rm ca.bankofcanada.exchange-rates.daily', (error, stdout, stderr) => {
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

  const res2 = await app.inject({
    method: 'POST',
    url: `/manifest/pull/ca.bankofcanada.exchange-rates.daily`,
  })
    console.log('res2', res2.body)
    t.match(res2.body, '1 dataset(s) updated')

    const address:string = await new Promise((res, rej) => {
      exec('ipfs key gen ca.bankofcanada.exchange-rates.daily', (error, stdout, stderr) => {
        res(stdout)
      })
    })
    console.log('address', address)
  const res3 = await app.inject({
    method: 'POST',
    url: `/manifest/push/ca.bankofcanada.exchange-rates.daily/${address}`,
  })
  console.log('res3', res3.body)
  t.match(res3.body, '1 dataset(s) pushed')


})
