import React from "react";
import "reflect-metadata";
import { plainToClass } from "class-transformer";
import "./App.css";
import TreePanel from "./components/TreePanel";

class User {
  id: number;
  firstName: string;
  lastName: string;

  constructor() {
    this.id = 0;
    this.firstName = "";
    this.lastName = "";
  }
}

const fromPlainUser = {
  unkownProp: "hello there",
  firstName: "Umed",
  lastName: "Khudoiberdiev"
};

console.log("plainToClass == ", plainToClass(User, fromPlainUser));

function App() {
  return <TreePanel />;
}

export default App;
