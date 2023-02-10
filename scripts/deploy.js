const main = async () => {
    // compile the contract
    const domainContractFactory = await hre.ethers.getContractFactory("Domains");
    // deploy the contract
    const domainContract = await domainContractFactory.deploy("alfa");
    await domainContract.deployed();

    console.log("Contract deployed to:", domainContract.address);
    
    // register domain using some ether
    let txn = await domainContract.register("aeterno", {value: hre.ethers.utils.parseEther("0.1")});
    await txn.wait();
    console.log("Minted domain aeterno.alfa");

    // set a record for the domain
    txn = await domainContract.setRecord("aeterno", "Was, is and forever will be");
    await txn.wait();
    console.log("Record set for aeterno.alfa");

    // Get the owner of the domain
    const address = await domainContract.getAddress("aeterno");
    console.log("Owner of aeterno is:", address);

    // Get the contract balance
    const balance = await hre.ethers.provider.getBalance(domainContract.address);
    console.log("Contract balance:", hre.ethers.utils.formatEther(balance));
    
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
