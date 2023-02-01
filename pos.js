const { use, setProofApi } = require('@maticnetwork/maticjs');
const {Web3ClientPlugin} = require('@maticnetwork/maticjs-web3');
const {FxPortalClient} = require('@fxportal/maticjs-fxportal');

const HDWalletProvider = require('@truffle/hdwallet-provider');

use(Web3ClientPlugin)

setProofApi('https://apis.matic.network/');

const getFxPortalClient = async (network = 'testnet', version = 'mumbai') => {
    try {
        const fxPortalClient = new FxPortalClient();
        return await fxPortalClient.init({
            network: network,
            version: version,
            parent: {
                provider: new HDWalletProvider(
                    'private_key',
                    'goerli-rpc'
                ),
                defaultConfig:{
                    from: '0xE418d5314Ff34CDdD10E12899aC0bf95E9688aEE'
                }
            },
            child:{
                provider: new HDWalletProvider(
                    'private_key',
                    'mumbai-rpc'
                ),
                defaultConfig:{
                    from: '0xE418d5314Ff34CDdD10E12899aC0bf95E9688aEE'
                },
            },
        })
        
    } catch (error) {
        console.log("fxportal", error);
    }
}

const approve = async () => {
    const fxClient = await getFxPortalClient()
    const erc20Token = fxClient.erc20("0x4E80421F37e5a9f2fad29F19a718ffaF4369d88e", true)

    const txResult = await erc20Token.approve(1000)
    const txHash = await txResult.getTransactionHash()
    console.log("txHash", txHash);
}

const deposit = async () => {
    const fxClient = await getFxPortalClient()
    const erc20Token = fxClient.erc20("0x4E80421F37e5a9f2fad29F19a718ffaF4369d88e", true)
    const allowance = await erc20Token.getAllowance("0xE418d5314Ff34CDdD10E12899aC0bf95E9688aEE")
    const txResult = await erc20Token.deposit(1000, "0xE418d5314Ff34CDdD10E12899aC0bf95E9688aEE")
    const txHash = await txResult.getTransactionHash()
    console.log("txHash", txHash);
}

const main = async () => {
    // await approve()
    await deposit()
}
main()