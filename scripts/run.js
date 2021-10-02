// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require('hardhat');

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const [owner, randoPerson] = await hre.ethers.getSigners();

  // We get the contract to deploy
  const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther('0.1'),
  });
  await waveContract.deployed();
  console.log('Contract deployed to: ', waveContract.address);
  console.log('Contract deployed by', owner.address);

  let waveCount, waveTxn;

  // waveCount = await waveContract.getTotalWaves();
  // console.log('Total waves:', waveCount);

  // waveTxn = await waveContract.wave('Vanakam');
  // await waveTxn.wait();

  // waveCount = await waveContract.getTotalWaves();
  // console.log('Total waves:', waveCount);

  let contractBalance = await hre.ethers.provider.getBalance(
    waveContract.address
  );

  console.log(
    'Contract Balance: ',
    hre.ethers.utils.formatEther(contractBalance)
  );

  waveTxn = await waveContract
    .connect(randoPerson)
    .wave('Veru oruvanin vazhthu 1');
  await waveTxn.wait();

  let allWaves = await waveContract.getAllWaves();
  console.log('All waves:', allWaves);

  waveTxn = await waveContract
    .connect(randoPerson)
    .wave('Veru oruvanin vazhthu 2');
  await waveTxn.wait();

  contractBalance = await hre.ethers.provider.getBalance(waveContract.address);

  console.log(
    'Contract Balance: ',
    hre.ethers.utils.formatEther(contractBalance)
  );

  waveCount = await waveContract.getTotalWaves();
  console.log('Total waves:', waveCount);

  allWaves = await waveContract.getAllWaves();
  console.log('All waves:', allWaves);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
