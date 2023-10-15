import { FastifyPluginAsync, FastifyRequest } from "fastify"
const DPID_BASE_URL = 'https://beta.dpid.org/'

interface DPIDParams {
    dpid: string
}
const dpid: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.get('/:dpid', async (
        request: FastifyRequest<{ Params: DPIDParams }>,
        response
    ) => {
        const params: DPIDParams = request.params
        const dpid: string = params.dpid
        if (!dpid) return response.status(500).send('dpid is required')
        const res = await fetch(`${DPID_BASE_URL}${dpid}?jsonld`)
        if (res.ok) {
            const json:any = await res.json()
            if (json.error) return response.status(500).send(json.error)
            if (!json.error) {
                const datasets = json['@graph'].filter((item:any) => {
                    return item['@type'] === 'Dataset'
                })

                const cids = datasets.map((item:any) => {
                    return item['/']
                })

                return response.status(200).send(cids)

                
            }
        }
    })
}


export default dpid