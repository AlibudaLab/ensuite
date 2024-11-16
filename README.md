# Ensuite
<img width="1264" alt="Screenshot 2024-11-17 at 3 58 30 AM" src="https://github.com/user-attachments/assets/165b597a-8302-423f-b2f6-5e42fd1a7389">


## About

ENSuite is a cutting-edge on-chain corporate spending management system that combines the power of ENS, Vlayer, Gnosis Pay, and the Coinbase Developer Platform to deliver a streamlined, secure, and transparent solution for modern organizations.

What ENSuite Does:
ENSuite empowers companies to manage their expenses efficiently. It allows businesses to create dedicated vaults for various spending purposes, such as DevOps, operations, and travel, while providing employees with ENS subnames for easy and traceable transactions. The system eliminates the need for complex manual processes and traditional finance tools by bringing everything on-chain.

## Tech Stack

**ENS**: We leverage `durin` feature, which includes `registry` and `registrar` contracts to store the mapping of subname, maintain the ownership of ens tokens and manage the access roles. This not only enables us to seamlessly generate a subname on a Layer2, which base is used,  but also provides a convenient tools to maintain and manage the subname of the company. Here is the part ENS is used: [registar and registry smart contract with Durin](https://github.com/AlibudaLab/ensuite/tree/durin/durin), [claim ENS name](https://github.com/AlibudaLab/ensuite/blob/main/src/app/api/registerEns/route.ts)

**Vlayer**: Employees receive an email sent by the company. We utilized Vlayer's Email proof as a form of verification. The vlayer `Prover` contracts receive the `.eml` files sent by the employees and generate proofs. Then, through the `Verifier` on-chain smart contract, we verify these proofs. Upon successful verification, employees can mint subnames from ENS. Here is the part Vlayer is used: [prover, verifier smart contracts](https://github.com/AlibudaLab/ensuite/tree/main/contracts/src/vlayer), [generate proof with vlayer sdk](https://github.com/AlibudaLab/ensuite/blob/main/src/service/vlayer.ts)

**Gnosis**: We utilized the Gnosis Safe Smart Account as a means for the company to control the Vault. The company's admin creates the Vault through `Safe.init` and `createSafeDeploymentTransaction`. Using `createAddOwnerTx`, `createRemoveOwnerTx`, and `createChangeThresholdTx`, the company’s admin add or remove individuals who can access the Vault according to each department's needs. By adjusting different threshold values, we determine how many people are required for multi-signature approvals. Here is the part Gnosis is used: [vaults and balance managements](https://github.com/AlibudaLab/ensuite/blob/b15903da4342d276be0f97cebbf135a5996f3f6c/src/app/dashboard/page.tsx), 

**Coinbase/Base**: We utilized the Coinbase Onchain Kit to build the frontend of our project. Components like `ConnectWallet`, `Wallet`, `WalletDropdown`, and `WalletDropdownDisconnect` from the Wallet module enable users to seamlessly interact with their wallets and our project. We also use  Transaction module components like `TransactionError`, `TransactionResponse`. Additionally, components like `EthBalance` , `Address`  and  `ENS avatars` from the Identity module allow us to provide users with a friendly and feature-rich blockchain identity display and interaction.

## Link

- [Demo App](https://ensuite-alibuda.vercel.app/)
- [Demo Video](https://www.youtube.com)
