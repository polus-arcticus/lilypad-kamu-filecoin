const { ethers, accounts } = require('hardhat')

async function filEstimateGas(byteCode:string) {
  const accounts = await ethers.getSigners();
  let url = 'http://127.0.0.1:1234/rpc/v1'; // Your Ethereum node URL
  let method = 'eth_estimateGas';
  let id = 1
  let params = [{
      from: accounts[0].address, // Replace with your address
      data: byteCode  // Replace with corresponding contract data or '0x' if there is no data
  }];
  let response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        jsonrpc: '2.0',
        method,
        params,
        id
      }),
      headers: {
          'Content-Type': 'application/json'
      }
  })
  return await response.json()
}

export async function deployDealClient() {
  console.log('attempting to deploy Deal Client')
  console.log('accounts', accounts)
  const DealClientFactory = await ethers.getContractFactory("DealClient")
  const gas = await filEstimateGas(DealClientFactory.bytecode)
  //let gasEst = await ethers.provider.estimateGas(transactionRequest)


  const dealClient = await ethers.deployContract("DealClient", [], {
    gasLimit: gas.result
  });
  console.log('hi 2')

  //await dealClient.waitForDeployment();

  console.log(
    `Deal Client Deployed at: ${dealClient.target}`
  );

  return { dealClientAddr: await dealClient.getAddress()}
}

export async function deployFilecoinMarketConsumer() {
  console.log('attempting to deploy filecoinmarkeconsumer')
  const FilecoinMarketConsumerFactory = await ethers.getContractFactory("FilecoinMarketConsumer")
  const gas = await filEstimateGas(FilecoinMarketConsumerFactory.bytecode)
  const filecoinMarketConsumer = await ethers.deployContract("FilecoinMarketConsumer", {
    gasLimit: gas.result
  });
  console.log('hi')

  //await filecoinMarketConsumer.waitForDeployment();
  console.log(
    `Deal Client Deployed at: ${filecoinMarketConsumer.target}`
  );

  return { filecoinMarketConsumerAddr: await filecoinMarketConsumer.getAddress()}
}

async function deploy() {
  await deployDealClient()
  await deployFilecoinMarketConsumer()
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
