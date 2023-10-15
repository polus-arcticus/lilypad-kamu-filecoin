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
    manifest: string
  }
  fastify.post('/:manifest/pull', async (
    request: FastifyRequest<{ Params: PullParams }>,
    response
  ) => {
    const params: PullParams = request.params
    const manifest: string = params.manifest
    if (!manifest) return response.status(500).send('dataset is required')
    return await pull(manifest)
  })
  
  interface PushParams extends PullParams {
    to: string
  }
  fastify.post('/:manifest/push/:to', async (
    request: FastifyRequest<{ Params: PushParams }>,
    response
  ) => {
    const {manifest, to}: PushParams = request.params
    if (!manifest) return response.status(500).send('dataset is required')
    if (!to) return response.status(500).send('please select where to push (ipfs)')
    return await push(manifest, to)
  })
}

export default manifest;
