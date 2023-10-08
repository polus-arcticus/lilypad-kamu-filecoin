import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs"
import { expect } from "chai"
import { ethers } from "hardhat"
import { deployDealClient, deployFilecoinMarketConsumer, filEstimateGas } from '../scripts/deploy'
import exampleFile from './lighthouse.storage.json'
import { CID } from 'multiformats/cid'
//import CID from 'cids'
import { base16 } from "multiformats/bases/base16"
import { DealClient, FilecoinMarketConsumer } from "../typechain-types";
import { DealRequestStruct, ExtraParamsV1Struct } from '../typechain-types/contracts/DealClient'
import { bytes } from "multiformats/index";

describe("Deal Client", function () {
  let accounts: ethers.Signer[]
  let dealClient: DealClient
  let filecoinMarketConsumer: FilecoinMarketConsumer

  before(async () => {
    accounts = await ethers.getSigners()
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

    const extraParams: ExtraParamsV1Struct = {
      location_ref: exampleFile.car_Link,
      car_size: exampleFile.car_Size,
      skip_ipni_announce: false,
      remove_unsealed_copy: false
    }
    const dealRequestStruct: DealRequestStruct = {
      piece_cid: '0x00' + CID.parse(exampleFile.piece_CID).toString(base16).substring(1),
      piece_size: exampleFile.piece_Size,
      verified_deal: true,
      label: exampleFile.piece_CID,
      start_epoch: 0,
      end_epoch: 100,
      storage_price_per_epoch: 0,
      provider_collateral: 0,
      client_collateral: 0,
      extra_params_version: 1,
      extra_params: extraParams
    }
    let dealProposalId = ''
    const evt = await dealClient.on(
      dealClient.filters.DealProposalCreate,
      async (id, size, verified, price) => {
        console.log('id', id)
        console.log('size', size)
        console.log('verified', verified)
        console.log('price', price)
        dealProposalId = id
        const dealId = await dealClient.pieceDeals(
          ethers.toUtf8Bytes(dealProposalId)
        )
        console.log('dealId', dealId)
        const storeTx = await filecoinMarketConsumer.storeAll(dealId)
        await storeTx.wait()
      })
    /*
    const gas = await filEstimateGas(
      dealClient.interface.encodeFunctionData("makeDealProposal", [dealRequestStruct])
    )
    */
    //const nonce = await ethers.provider.getTransactionCount(accounts[0].address)
    //console.log('nonce', nonce)
    //encode dealRequestStruct as calldata for dealClient.makeDealProposal
    
  const abi = [
    {
      "components": [
        { name: 'piece_cid', type: "bytes" },
        { name: 'piece_size', type: "uint64" },
        { name: 'verified_deal', type: "bool" },
        { name: 'label', type: "string" },
        { name: 'start_epoch', type: "uint64" },
        { name: 'end_epoch', type: "uint64" },
        { name: 'storage_price_per_epoch', type: "uint256" },
        { name: 'provider_collateral', type: "uint256" },
        { name: 'client_collateral', type: "uint256" },
        { name: 'extra_params_version', type: "uint64" },
        {
          "components": [
            { name: 'location_ref', type: "string" },
            { name: 'car_size', type: "uint64" },
            { name: 'skip_ipni_announce', type: "bool" },
            { name: 'remove_unsealed_copy', type: "bool" }
          ],
          name: 'extra_params',
          type: 'tuple'
        }
      ],
      name: "deal",
      type: "tuple"
    }
  ]
  const input = [
    {
      piece_cid: dealRequestStruct.piece_cid,
      piece_size: dealRequestStruct.piece_size,
      verified_deal: dealRequestStruct.verified_deal,
      label: dealRequestStruct.label,
      start_epoch: dealRequestStruct.start_epoch,
      end_epoch: dealRequestStruct.end_epoch,
      storage_price_per_epoch: dealRequestStruct.storage_price_per_epoch,
      provider_collateral: dealRequestStruct.provider_collateral,
      client_collateral: dealRequestStruct.client_collateral,
      extra_params_version: dealRequestStruct.extra_params_version,
      extra_params: {
          location_ref: dealRequestStruct.extra_params.location_ref,
          car_size: dealRequestStruct.extra_params.car_size,
          skip_ipni_announce: dealRequestStruct.extra_params.skip_ipni_announce,
          remove_unsealed_copy: dealRequestStruct.extra_params.remove_unsealed_copy
      }
    }
  ]
  let asArray = Object.values(dealRequestStruct)
  asArray[asArray.length-1] = Object.values(asArray[asArray.length -1])
  console.log(asArray)
    const encoded = new ethers.AbiCoder().encode(abi, input)
    console.log('encoded', encoded)
  const proposalTx = await dealClient.makeDealProposal(asArray, {
    gasLimit: 1000000000,
    //nonce: nonce
  })
  await proposalTx.wait()
  const deal = await dealClient.getDealByIndex(ethers.toBigInt(0))
  console.log('deal', deal)
  //await proposalTx.wait()







})
});
