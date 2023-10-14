import { FastifyPluginAsync, FastifyRequest } from "fastify"
import { pipeline } from 'node:stream'
import * as fs from 'node:fs'
import * as util from 'node:util'

import { add, pull, push } from '../../commands'
const pump = util.promisify(pipeline)

const manifest: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post('/', async (request, response) => {
    const data = await request.file()
    if (data) {
      await pump(data.file, fs.createWriteStream(data.filename))
      return await add(data.filename)
    }
  })

  interface PullParams {
    dataset: string
  }
  fastify.post('/pull/:dataset', async (
    request: FastifyRequest<{ Params: PullParams }>,
    response
  ) => {
    const params: PullParams = request.params
    const dataset: string = params.dataset
    if (!dataset) return response.status(500).send('dataset is required')
    return await pull(dataset)
  })
  
  interface PushParams extends PullParams {
    to: string
  }
  fastify.post('/push/:dataset/:to', async (
    request: FastifyRequest<{ Params: PushParams }>,
    response
  ) => {
    const {dataset, to}: PushParams = request.params
    if (!dataset) return response.status(500).send('dataset is required')
    if (!to) return response.status(500).send('please select where to push (ipfs)')
    return await push(dataset, to)
  })
}

export default manifest;
