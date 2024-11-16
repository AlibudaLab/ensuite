// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {EmailProver} from "../src/vlayer/EmailProver.sol";
import {EmailProofVerifier} from "../src/vlayer/EmailProofVerifier.sol";

contract EmailProofVerifierScript is Script {
    EmailProver public prover;
    EmailProofVerifier public verifier;

    function setUp() public {}

    function run() public {
        // Get private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);

        // Deploy EmailProver first
        prover = new EmailProver();
        console.log("EmailProver deployed at:", address(prover));

        // Deploy EmailProofVerifier with prover address
        verifier = new EmailProofVerifier(address(prover));
        console.log("EmailProofVerifier deployed at:", address(verifier));

        vm.stopBroadcast();
    }
}