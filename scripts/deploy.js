const main = async () => {
    // compile the contract
    const domainContractFactory = await hre.ethers.getContractFactory("Domains");
    // deploy the contract
    const domainContract = await domainContractFactory.deploy("alfa");
    await domainContract.deployed();

    console.log("Contract deployed to:", domainContract.address);
};


const runMain = async () => {
    try {
	await main();
	process.exit(0);
    } catch (error) {
	console.log(error);
	process.exit(1);
    }
};

runMain();
