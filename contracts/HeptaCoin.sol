// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;


contract HeptaCoin {

    string public name = "HeptaCoin";
    string public symbol = "HPC";
    uint8 public decimals = 18;
    uint256 public totalSuply = 1000 * 10 ** decimals;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    mapping (address => uint256) private _balances;
    mapping (address => mapping (address => uint256)) private _allowances;

    constructor(){
        _balances[msg.sender] = totalSuply;
    }

    function balanceOf(address _owner) public view returns (uint256 balance){

        return _balances[_owner];

    }

    function transfer(address _to, uint256 _value) public returns (bool success){
        require (balanceOf(msg.sender) >= _value, "Insufficient funds");
        _balances[msg.sender] -= _value;
        _balances[_to] += _value;

        emit Transfer (msg.sender, _to, _value);

        return true;


    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success){
        require (balanceOf(_from) >=_value,"Insufficient funds");
        require (allowance(_from, msg.sender) >=_value,"Insufficient funds allowance");

        _balances[_from] -= _value;
        _allowances[_from][msg.sender] -= _value;
        _balances[_to] += _value;
        
        return true;
    }


    function approve(address _spender, uint256 _value) public returns (bool success){
        _allowances[msg.sender][_spender] = _value;

        emit Approval(msg.sender, _spender, _value);
        return true;

    }

    function allowance(address _owner, address _spender) public view returns (uint256 remaining){
        return _allowances[_owner][_spender];
        
    }

  
}
