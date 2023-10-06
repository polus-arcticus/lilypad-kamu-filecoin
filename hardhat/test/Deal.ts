import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs"
import { expect } from "chai"
import { ethers } from "hardhat"
import { deployDealClient, deployFilecoinMarketConsumer } from '../scripts/deploy'
import exampleFile from './lighthouse.storage.json'
import { CID } from'multiformats/cid'
//import CID from 'cids'
import { base16 } from "multiformats/bases/base16"
import { DealClient, FilecoinMarketConsumer } from "../typechain-types";
import  {DealRequestStruct } from '../typechain-types/contracts/DealClient'

describe("Deal Client", function () {

  let dealClient: DealClient
  let filecoinMarketConsumer: FilecoinMarketConsumer

  before(async () => {
    dealClient = await ethers.getContractAt(
      "DealClient",
      (await deployDealClient()).dealClientAddr
    )
    filecoinMarketConsumer = await ethers.getContractAt(
      "FilecoinMarketConsumer",
      (await deployFilecoinMarketConsumer()).filecoinMarketConsumerAddr
    )

  })

  it("Should create a deal", async () => {
    // convert exampleFile.pieceCID to Cid Hex
    //https://github.com/multiformats/multicodec/blob/3122fd93aecf1b765df6d9bf2641cbe80f4619b2/table.csv#L140
    const dealRequestStruct: DealRequestStruct = {
      piece_cid: '0x00' + CID.parse(exampleFile.piece_CID).toString(base16).substring(1),
      piece_size: exampleFile.piece_Size,
      verified_deal: true,
      label: "test",
      start_epoch: 0,
      end_epoch: 100,
      storage_price_per_epoch: 0,
      provider_collateral: 0,
      client_collateral: 0,
      extra_params_version: 0,
      extra_params: {
        location_ref: '',
        car_size: 0,
        skip_ipni_announce: false,
        remove_unsealed_copy: false
      }
    }
    let dealProposalId = ''
    const evt = await dealClient.on(
      dealClient.filters.DealProposalCreate,
      (id, size, verified, price) => {
      console.log('id', id)
      console.log('size', size)
      console.log('verified', verified)
      console.log('price', price)
      dealProposalId = id
    })
    const proposalTx = await dealClient.makeDealProposal(dealRequestStruct)
    await proposalTx.wait()

    const dealId = await dealClient.pieceDeals(
      ethers.toUtf8Bytes(dealProposalId)
    )
    console.log('dealId', dealId)
    
    const storeTx = await filecoinMarketConsumer.storeAll(dealId)
    await storeTx.wait()




  })
});
