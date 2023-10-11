import 'dotenv/config'
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  /*
  typechain: {
    outDir: 'src/types',
    target: 'ethers-v6',
  },
  */
  solidity:{
    version: '0.8.17',
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
        details: { yul: false },
      },
    },
  },
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      chainId: 31337,
      accounts: {
        mnemonic: process.env.MNEMONIC
      }
    },
    localhost: {
      url: 'http://127.0.0.1:8545',
      chainId: 31337,
      accounts: {
        mnemonic: process.env.MNEMONIC
      }
    },
    filTestnet: {
      url: 'http://127.0.0.1:1234/rpc/v1',
      chainId: 31415926,
      accounts: {
        mnemonic: process.env.MNEMONIC
      }
    },
    calibrationnet: {
      chainId: 314159,
      url: "https://api.calibration.node.glif.io/rpc/v1",
      accounts: { mnemonic: process.env.MNEMONIC}
  },
  }
};

export default config;
