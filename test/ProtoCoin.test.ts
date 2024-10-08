import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";

describe("HeptaCoin", function () {

  async function deployFixture() {
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const HeptaCoin = await hre.ethers.getContractFactory("HeptaCoin");
    const heptaCoin = await HeptaCoin.deploy();

    return { heptaCoin, owner, otherAccount };
  }

  it("Should have correct name", async function () {
    const {heptaCoin, owner, otherAccount } = await loadFixture(deployFixture);
    const name = await heptaCoin.name();

    expect(name).to.equal("HeptaCoin");
  });
  
  it("Should have correct symbol", async function () {
    const {heptaCoin, owner, otherAccount } = await loadFixture(deployFixture);
    const symbol = await heptaCoin.symbol();

    expect(symbol).to.equal("HPC");
  });

  it("Should have correct decimals", async function () {
    const {heptaCoin, owner, otherAccount } = await loadFixture(deployFixture);
    const decimals = await heptaCoin.decimals();

    expect(decimals).to.equal(18);
  });

  it("Should have correct total Supply", async function () {
    const {heptaCoin, owner, otherAccount } = await loadFixture(deployFixture);
    const totalSupply = await heptaCoin.totalSuply();

    expect(totalSupply).to.equal(1000n * 10n ** 18n);
  });


  
  it("Should get balance", async function () {
    const {heptaCoin, owner, otherAccount } = await loadFixture(deployFixture);
    const totalSupply = await heptaCoin.balanceOf(owner.address);

    expect(totalSupply).to.greaterThan(0);
  });

    
  it("Should transfer", async function () {
    const {heptaCoin, owner, otherAccount } = await loadFixture(deployFixture);

    const balanceOwnerBefore = await heptaCoin.balanceOf(owner.address);
    const balanceOtherAccountBefore = await heptaCoin.balanceOf(otherAccount.address);

    await heptaCoin.transfer(otherAccount.address, 1n);
    
    const balanceOwnerAfter = await heptaCoin.balanceOf(owner.address);
    const balanceOtherAccountAfter = await heptaCoin.balanceOf(otherAccount.address);

    expect(balanceOwnerAfter).to.equal(balanceOwnerBefore - 1n);
    expect(balanceOtherAccountAfter).to.equal(balanceOtherAccountBefore + 1n);
  });


  
  it("Should transfer error", async function () {
    const {heptaCoin, owner, otherAccount } = await loadFixture(deployFixture);

    const instance = heptaCoin.connect(otherAccount);

    await expect(instance.transfer(owner, 20n)).to.be.rejectedWith("Insufficient funds");
  });


  
  it("Should aprove", async function () {
    const {heptaCoin, owner, otherAccount } = await loadFixture(deployFixture);

    await heptaCoin.approve(otherAccount.address, 1n);

    const value = await heptaCoin.allowance(owner.address, otherAccount.address);

    await expect(value).to.be.equal(1n);
  });


  it("Should transfer from ", async function () {
    const {heptaCoin, owner, otherAccount } = await loadFixture(deployFixture);

    const balanceOwnerBefore = await heptaCoin.balanceOf(owner.address);
    const balanceOtherAccountBefore = await heptaCoin.balanceOf(otherAccount.address);

    await heptaCoin.approve(otherAccount.address, 10n);

    const instance = heptaCoin.connect(otherAccount);

    await instance.transferFrom(owner.address, otherAccount.address, 5n);

    const balanceOwnerAfter = await heptaCoin.balanceOf(owner.address);
    const balanceOtherAccountAfter = await heptaCoin.balanceOf(otherAccount.address);

    const allowance = await instance.allowance(owner.address, otherAccount.address);

    expect(balanceOwnerAfter).to.equal(balanceOwnerBefore - 5n);
    expect(balanceOtherAccountAfter).to.equal(balanceOtherAccountBefore + 5n);
    expect(allowance).to.equal(5n);
  });


  
  it("Should NOT transfer from by NOT ALLOWANCE ", async function () {
    const {heptaCoin, owner, otherAccount } = await loadFixture(deployFixture);

    const instance = heptaCoin.connect(otherAccount);

    await expect(instance.transferFrom(owner.address,otherAccount.address, 1n)).to.be.rejectedWith("Insufficient funds allowance");

  });


  
  it("Should NOT transfer from by NOT FUNDS", async function () {
    const {heptaCoin, owner, otherAccount } = await loadFixture(deployFixture);

    const instance = heptaCoin.connect(otherAccount);

    await expect(instance.transferFrom(otherAccount.address,otherAccount.address, 20n)).to.be.rejectedWith("Insufficient funds");

  });

});
