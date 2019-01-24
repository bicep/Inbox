const assert = require('assert');
// local ethereum test network
const ganache = require('ganache-cli');
// caps because constructor, used to create instances of the web3 library. constructor functions are capitalized (it is the class)
const Web3 = require('web3');
// why are we creating an instance of web3?
// versioning issues with web3. Web3 communciates between a js app and the 
// 2 versions of web3 in the wild
    // v0.x.x - "primitive" interface callbacks
    // v1.x.x - support for promises + async and await
// purpose of an instance of one web3 is to connect to a network
// provider is communication layer between network and web3
const provider = ganache.provider();
const web3 = new Web3(provider);
const { abi, evm } = require('../compile');

let accounts;
let inbox;
let INITIAL_STRING = 'Hi there!';
let CHANGE_STRING = 'Bye';

beforeEach(async () => {
    // Get a list of all accounts
    // every funcztion that is called with web3 is going to return a promise
    accounts = await web3.eth.getAccounts();

    // Use one of those accounts to deploy the contract- teaches web3 about what methods an Inbox contract has
    // inbox is js representation of contract. Represents what exists on a blockchain. Call functions directly
    inbox = await new web3.eth.Contract(JSON.parse(JSON.stringify(abi)))
        // constructor function could accept multiple arguments. Deploy creates an object, send communicates the transaction
        .deploy({ data: evm.bytecode.object, arguments: [INITIAL_STRING] })
        // instructs web3 to send out a tx
        .send({ from: accounts[0], gas: '1000000' });

    inbox.setProvider(provider);

});

describe('Inbox', () => {
    it ('deploys a contract', () => {
        // console.log(inbox)
        assert.ok(inbox.options.address);
    });

    it ('has a default message', async () => {
        // calling a function vs sending a tx to the function
        const message = await inbox.methods.message().call();
        assert.equal(message, INITIAL_STRING);
    });

    it ('can change the message', async () => {
        await inbox.methods.setMessage(CHANGE_STRING).send({ from: accounts[0] })
        const message = await inbox.methods.message().call();
        assert.equal(message, CHANGE_STRING);
    });
});

// web3 not just for deploying contracts
// get access to contracts that have already been deployed on the network vs creating a contract
// for both ^ you need the ABI. 
// for accessing already deployed contracts you need address of deployed contract, don't need it for creating a contract
// Bytecode for contract creation

// contract can be deployed unlimited number of times