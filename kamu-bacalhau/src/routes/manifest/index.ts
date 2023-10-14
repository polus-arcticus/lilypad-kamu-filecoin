import { FastifyPluginAsync } from "fastify"
import { pipeline } from 'node:stream'
import * as fs from 'node:fs'
import { exec } from 'child_process'
import * as util from 'node:util'
const pump = util.promisify(pipeline)

const manifest: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post('/', async (request, response) => {
    const data = await request.file()
    if (data) {
      await pump(data.file, fs.createWriteStream(data.filename))
      return await new Promise((res, rej) => {
        exec(`kamu add ${data.filename}`, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error executing command: ${error.message}`);
            res(error.message)
          }
          if (stderr) {
            console.error(`Command error: ${stderr}`);
            res(stderr)
          }
          console.log(`Command output: ${stdout}`);
          res(stdout)
        })
      })
    }
  })
}

export default manifest;
