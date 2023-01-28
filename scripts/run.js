const main = async () => {
    const [owner, randomPerson] = await hre.ethers.getSigners();
    const domainContractFactory = await hre.ethers.getContractFactory("Domains");
    const domainContract = await domainContractFactory.deploy();
    await domainContract.deployed();
    console.log("Contract deployed to:", domainContract.address);
    console.log("Contract deployed by:", owner.address);

    let txn = await domainContract.register("xyz");
    await txn.wait();

    const domainOwner = await domainContract.getAddress("xyz");
    console.log("Owner of the domain:", domainOwner);

    // trying to set a record as non-owner
    txn = await domainContract.connect(randomPerson).setRecord("xyz", "pwned!");
    await txn.await();

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
