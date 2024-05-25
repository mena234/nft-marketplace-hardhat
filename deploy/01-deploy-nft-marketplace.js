const { network, ethers } = require("hardhat");
const {
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const deployer = await ethers.provider.getSigner();
    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS;

    log("----------------------------------------------------");
    const arguments = [];
    const nftMarketplace = await deploy("NftMarketplace", {
        from: deployer.address,
        args: arguments,
        log: true,
        waitConfirmations: waitBlockConfirmations,
    });

    // Verify the deployment
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        log("Verifying...");
        await verify(nftMarketplace.address, arguments);
    }
    log("----------------------------------------------------");
};

module.exports.tags = ["all", "nftmarketplace"];
