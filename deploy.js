const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { abi, evm } = require('./compile');

const provider = new HDWalletProvider(
    // FIRST ARGUMENT: METAMASK MNEMONIC
    // SECOND ARGUMENT: INFURA RINKEBY API KEY
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('Attempting to deploy from account', accounts[0])

    const result = await new web3.eth.Contract(JSON.parse(JSON.stringify(abi)))
        .deploy({ data: evm.bytecode.object, arguments: ['Hi there!'] })
        // most recent truffle hd wallet provider
        // .deploy({ data: '0x' + evm.bytecode.object, arguments: ['Hi there!'] })
        .send({ from: accounts[0], gas: '1000000' });

    console.log('Contract deployed to', result.options.address)

};

deploy();

