// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SchoolSystemModule = buildModule("SchoolSystemModule", (m) => {

  const school = m.contract("SchoolSystem");

  return { school };
});

export default SchoolSystemModule;
