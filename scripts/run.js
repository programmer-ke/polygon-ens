const main = async () => {
    const [owner, randomPerson] = await hre.ethers.getSigners();
    const domainContractFactory = await hre.ethers.getContractFactory("Domains");

    // pass in the tld when deploying
    const domainContract = await domainContractFactory.deploy("alfa");

    await domainContract.deployed();
    console.log("Contract deployed to:", domainContract.address);
    console.log("Contract owner:", owner.address);

    // pass in second variable as amount payed to contract
    let txn = await domainContract.register("xyz", {value: hre.ethers.utils.parseEther("500")});
    await txn.wait();

    let contractBalance = await hre.ethers.provider.getBalance(domainContract.address);
    console.log("Contract balance before withdrawal:", hre.ethers.utils.formatEther(contractBalance));

    // withdraw funds from contract as non-owner
    try {
	txn = await domainContract.connect(randomPerson).withdraw();
	await txn.wait();
    } catch (error) {
	console.log(error);
	console.log("Could not rob contract");
    }

    // Look at the owner's balance before withdrawing

    let ownerBalance = await hre.ethers.provider.getBalance(owner.address);
    console.log("Balance of owner before withdrawal:", hre.ethers.utils.formatEther(ownerBalance));

    // withdraw funds as owner
    txn = await domainContract.connect(owner).withdraw();
    await txn.wait();

    // show contract and owner balances after withrawing
    contractBalance = await hre.ethers.provider.getBalance(domainContract.address);
    ownerBalance = await hre.ethers.provider.getBalance(owner.address);

    console.log("Contract balance after withdrawal:", hre.ethers.utils.formatEther(contractBalance));
    console.log("Owner balance after withdrawal:", hre.ethers.utils.formatEther(ownerBalance));
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
