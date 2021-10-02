// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    // the total number of waves this contract recieved
    uint256 totalWaves;
    // the seed used to generate random number
    uint256 private seed;

    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver; // The address of the user who waved
        string message; // The message the user sent while waving
        uint256 timestamp; // The timestamp when the user waved
    }

    Wave[] waves;

    /**
     * A Map of address to timestamp of a waver, to cooldown if they wave frequently
     */
    mapping(address => uint256) public lastWavedAt;

    constructor() payable {
        console.log("Vanakam Makkale, nan oru opantham, arivana opantham");
    }

    function wave(string memory _message) public {
        require(
            lastWavedAt[msg.sender] + 15 minutes < block.timestamp,
            "Wait 15 mins"
        );

        lastWavedAt[msg.sender] = block.timestamp;

        totalWaves += 1;
        waves.push(
            Wave({
                waver: msg.sender,
                timestamp: block.timestamp,
                message: _message
            })
        );

        // generate psuedo random number between 0 and 100
        uint256 randomNumber = (block.difficulty + block.timestamp + seed) %
            100;
        console.log("Random number generated is %s", randomNumber);

        // updating the seed to randomNumber to make the seed random for next execution of the block
        seed = randomNumber;

        if (randomNumber < 50) {
            console.log("%s won!", msg.sender);

            uint256 prizeAmount = 0.0001 ether;

            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more than the contract balance"
            );

            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract");
        }

        emit NewWave(msg.sender, block.timestamp, _message);
        console.log("%s has waved ", msg.sender);
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves: ", totalWaves);
        return totalWaves;
    }
}
