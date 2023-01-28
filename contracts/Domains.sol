// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import { StringUtils } from "./libraries/StringUtils.sol";
import "hardhat/console.sol";

contract Domains {

  string public tld;

  mapping(string => address) public domains;
  mapping(string => string) public records;

  constructor (string memory _tld) payable {
    tld = _tld;
    console.log("%s name service deployed", _tld);
  }

  // Calculate price of based on length
  function price (string calldata name) public pure returns (uint) {
    uint len = StringUtils.strlen(name);
    require(len > 0);
    if (len <= 3) {
      return 5 * 10**17; // 0.5 matic (5 matic = 5 * 10**18)
    } else if (len == 4) {
      return 3 * 10**17; // 0.3 matic
    } else {
      return 1 * 10**17; // 0.1 matic
    }
  }

  function register(string calldata name) public payable {

    // Check that the domain doesn't already exist
    require(domains[name] == address(0), "Domain already exists");

    uint _price = price(name);

    // Check if enough Matic was sent in transaction
    require(msg.value >= _price, "Not enough Matic paid");
    
    domains[name] = msg.sender;
    console.log("%s has registered a domain!", msg.sender);
  }

  function getAddress(string calldata name) public view returns (address) {
    return domains[name];
  }

  function setRecord(string calldata name, string calldata record) public {
    // check that owner of domain 'name' is the transaction sender
    require(domains[name] == msg.sender, "Access denied!");
    records[name] = record;
  }

  function getRecord(string calldata name) public view returns (string memory) {
    return records[name];
  }
}
