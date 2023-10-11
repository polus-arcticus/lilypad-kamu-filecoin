import hre from 'hardhat'
export async function filEstimateGas(data: string) {
  const accounts = await hre.ethers.getSigners();
  let url:any = hre.network.config.url; // Your Ethereum node URL
  let method = 'eth_estimateGas';
  let id = 1
  let params = [{
    from: accounts[0].address, // Replace with your address
    data: data  // Replace with corresponding contract data or '0x' if there is no data
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
  const accounts = await hre.ethers.getSigners();
  console.log('attempting to deploy Deal Client')
  const DealClientFactory = await hre.ethers.getContractFactory("DealClient")
  if (hre.network.name === 'hardhat') {
    const dealClient = await hre.ethers.deployContract("DealClient");
    console.log(
      `Deal Client Deployed at: ${dealClient.target}`
    );
    return { dealClientAddr: await dealClient.getAddress() }

  } else {
    const gas = await filEstimateGas(DealClientFactory.bytecode)
    const nonce = await hre.ethers.provider.getTransactionCount(accounts[0].address)
    console.log('nonce', nonce)
    const dealClient = await hre.ethers.deployContract("DealClient", [], {
      gasLimit: gas.result,
      nonce: nonce
    });
    console.log(
      `Deal Client Deployed at: ${dealClient.target}`
    );

    return { dealClientAddr: await dealClient.getAddress() }

  }

  //await dealClient.waitForDeployment();

}

export async function deployFilecoinMarketConsumer() {
  const accounts = await hre.ethers.getSigners();
  console.log('attempting to deploy filecoinmarkeconsumer')
  const FilecoinMarketConsumerFactory = await hre.ethers.getContractFactory("FilecoinMarketConsumer")
  console.log('name', hre.network.name)
  if (hre.network.name == 'hardhat') {
    const filecoinMarketConsumer = await hre.ethers.deployContract("FilecoinMarketConsumer");
    //await filecoinMarketConsumer.waitForDeployment();
    console.log(
      `Deal Client Deployed at: ${filecoinMarketConsumer.target}`
    );

    return { filecoinMarketConsumerAddr: await filecoinMarketConsumer.getAddress() }

  } else {
    console.log('network name', hre.network.name)
    const gas = await filEstimateGas(FilecoinMarketConsumerFactory.bytecode)
    const nonce = await hre.ethers.provider.getTransactionCount(accounts[0].address)
    const filecoinMarketConsumer = await hre.ethers.deployContract("FilecoinMarketConsumer", {
      gasLimit: gas.result,
      nonce: nonce
    });

    //await filecoinMarketConsumer.waitForDeployment();
    console.log(
      `Deal Client Deployed at: ${filecoinMarketConsumer.target}`
    );

    return { filecoinMarketConsumerAddr: await filecoinMarketConsumer.getAddress() }

  }
}
export async function deployEthereumDIDRegistry() {
  const accounts = await hre.ethers.getSigners();
  console.log('attempting to deploy filecoinmarkeconsumer')
  const EthereumDIDRegistry = await hre.ethers.getContractFactory("EthereumDIDRegistry")
  if (hre.network.name == 'hardhat') {
    const ethereumDIDRegistry = await hre.ethers.deployContract("EthereumDIDRegistry");
    //await filecoinMarketConsumer.waitForDeployment();
    console.log(
      `Deal Client Deployed at: ${ethereumDIDRegistry.target}`
    );

    return { ethereumDIDRegistryAddr: await ethereumDIDRegistry.getAddress() }

  } else {
    console.log('network name', hre.network.name)
    const gas = await filEstimateGas(EthereumDIDRegistry.bytecode)
    const nonce = await hre.ethers.provider.getTransactionCount(accounts[0].address)
    const ethereumDIDRegistry = await hre.ethers.deployContract("EthereumDIDRegistry", {
      gasLimit: gas.result,
      nonce: nonce
    });

    //await filecoinMarketConsumer.waitForDeployment();
    console.log(
      `Deal Client Deployed at: ${ethereumDIDRegistry.target}`
    );

    return { ethereumDIDRegistryAddr: await ethereumDIDRegistry.getAddress() }

  }
}

async function deploy() {
  // prevent duplicate run if using in npx hardhat test
  console.log(process.argv)
  if (process.argv[1].includes('deploy.ts')) {
    await deployEthereumDIDRegistry()
    await deployDealClient()
    await deployFilecoinMarketConsumer()
  }
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
