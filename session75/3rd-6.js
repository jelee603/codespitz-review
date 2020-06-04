const Parent = class {
  wrap() {
    this.action();
  }
  action() {
    console.log("Parent");
  }
};
const Child = class extends Parent {
  action() {
    console.log("Child");
  }
};
const a = new Child();
console.log(a instanceof Parent);
a.wrap();
