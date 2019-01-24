// Going to build a directory path from compile to sol inbox file
// path gives on cross platform compatability
const path = require('path');
const fs = require('fs');
const solc = require('solc');

// dirname is a constant that is the current work directory, home directory to the inbox folder
const inboxPath = path.resolve(__dirname, 'contracts', 'Inbox.sol');
// source code
const source = fs.readFileSync(inboxPath, 'utf8');

// solc.compile(source, 1);

const compilerInput = {
    language: "Solidity",
    sources: {
        'Inbox': { content: source }
    },
    settings: {
      outputSelection: {
        "*": {
          "*": [ "abi", "evm.bytecode" ]
        }
      }
    }
};

const compiledContract = JSON.parse(solc.compile(JSON.stringify(compilerInput))).contracts.Inbox.Inbox;

module.exports = compiledContract
