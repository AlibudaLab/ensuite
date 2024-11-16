// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Strings} from "@openzeppelin-contracts-5.0.1/utils/Strings.sol";

import {Proof} from "vlayer-0.1.0/Proof.sol";
import {Prover} from "vlayer-0.1.0/Prover.sol";
import {RegexLib} from "vlayer-0.1.0/Regex.sol";
import {VerifiedEmail, UnverifiedEmail, EmailProofLib} from "vlayer-0.1.0/EmailProof.sol";

import {AddressParser} from "./utils/AddressParser.sol";

interface IExample {
    function exampleFunction() external returns (uint256);
}

contract EmailProver is Prover {
    using Strings for string;
    using RegexLib for string;
    using AddressParser for string;
    using EmailProofLib for UnverifiedEmail;

    function main(UnverifiedEmail calldata unverifiedEmail) public view returns (Proof memory, address) {
        VerifiedEmail memory email = unverifiedEmail.verify();

        string[] memory captures = email.subject.capture("^Welcome to vlayer, 0x([a-fA-F0-9]{40})!$");
        require(bytes(captures[1]).length > 0, "email header must contain a valid Ethereum address");

        // Capture ENS name from the body
        //string[] memory ensMatches = email.body.capture("^.ensuite.eth$");

        //require(ensMatches.length == 1, "ENS name not found in email body");
        //require(bytes(ensMatches[0]).length > 0, "Invalid ENS name in body");

        // Match the 'From' address domain
        string memory fromPattern = "^sh1001309@gmail.com$";
        require(email.from.matches(fromPattern), "From must be a Gmail address");

        return (proof(), captures[1].parseAddress());
    }
}
