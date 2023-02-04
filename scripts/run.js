const main = async () => {
    const [owner, randomPerson] = await hre.ethers.getSigners();
    const domainContractFactory = await hre.ethers.getContractFactory("Domains");

    // pass in the tld when deploying
    const domainContract = await domainContractFactory.deploy("alfa");

    await domainContract.deployed();
    console.log("Contract deployed to:", domainContract.address);
    console.log("Contract deployed by:", owner.address);

    // pass in second variable as amount payed to contract
    let txn = await domainContract.register("xyz", {value: hre.ethers.utils.parseEther("0.9")});
    await txn.wait();

    const domainOwner = await domainContract.getAddress("xyz");
    console.log("Owner of the domain:", domainOwner);

    const balance = await hre.ethers.provider.getBalance(domainContract.address);
    console.log("Contract balance:", hre.ethers.utils.formatEther(balance));

    // trying to set a record as non-owner
    txn = await domainContract.connect(randomPerson).setRecord("xyz", "pwned");
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
