const { Web3 } = require('web3');
const path = require('path');
const fs = require('fs');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

const web3 = new Web3("https://ethnet.isl.edu.gr");

const contractAddress = '0xA0ba5A1E5F46Dfb42DF3b3E278538b61BFC057b2';
const contractJSON = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../contract/tracking.json'), { encoding: 'utf-8' }));
const contractABI = contractJSON.abi;
const contract = new web3.eth.Contract(contractABI, contractAddress);


exports.getPack = catchAsync(async(req, res, next) => {
    const { packId } = req.params;
    console.log(packId)

    if (!packId) {
        return next(
            new AppError(
              'Pack ID is required',
              400
            )
          );
    }

    try {
        const packInfo = await fetchPackInfo(packId);
        console.log(packInfo);

        // Using JSON.stringify with a replacer function
        const serializedPackInfo = JSON.stringify(packInfo, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value // Convert BigInt to string
        );

        res.status(200).send(serializedPackInfo);
    } catch (error) {
        console.error(error);
        return next(
            new AppError(
              'Internal Server Error',
              500
            )
          );
    }
});

async function fetchPackInfo(packId) {
    const packInfo = await contract.methods.viewPack(packId).call();
    
    let packResponse = {
        packHash: packId,
        totalTokens: packInfo[0],
        createdOn: packInfo[2],
        totalPacks: packInfo[3],
        tokens: []
    };

    for (let tokenHash of packInfo[1]) {
        let tokenData = await contract.methods.getTokenData(web3.utils.toHex(tokenHash)).call();
        let pastHolderHashes = await contract.methods.getTokenPastHolders(web3.utils.toHex(tokenHash)).call();

        let parentToken = web3.utils.toHex(tokenData[6]);
        if (!pastHolderHashes.length && parentToken !== '0x0000000000000000000000000000000000000000000000000000000000000000' && parentToken !== web3.utils.toHex(tokenHash)) {
            pastHolderHashes = await contract.methods.getTokenPastHolders(parentToken).call();
            let nTokenData = await contract.methods.getTokenData(parentToken).call();
            let nextParentToken = web3.utils.toHex(nTokenData[6]);
            while (nextParentToken !== parentToken) {
                parentToken = nextParentToken;
                pastHolderHashes.push(...await contract.methods.getTokenPastHolders(parentToken).call());
                nTokenData = await contract.methods.getTokenData(parentToken).call();
            }
        }

        console.log(web3.utils.toHex(tokenHash), pastHolderHashes);
        let pastHolders = [];
        for (let holderHash of pastHolderHashes) {
            let holderData = await contract.methods.getTokenPastHolderData(holderHash).call();
            pastHolders.push({
                holderAddress: holderData[0],
                timestamp: holderData[1]
            });
        }

        let tokenInfo = {
            tokenHash: web3.utils.toHex(tokenHash),
            ingredientID: tokenData[0],
            status: tokenData[1],
            amount: Number(tokenData[2]),
            holder: tokenData[3],
            pendingHolder: tokenData[4],
            mintedOn: tokenData[5],
            pastHolders: pastHolders
        };
        packResponse.tokens.push(tokenInfo);
    }
    
    return packResponse;
}