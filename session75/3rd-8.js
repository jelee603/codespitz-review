const Task = class {
  constructor(title, date) {
    (this._title = title), (this._date = date), (this._isComplete = false);
    this._list = [];
  }
  isComplete() {
    return this._isComplete;
  }
  toggle() {
    this._isComplete = !this._isComplete;
  }
  add(title, date = null) {
    this._list.push(new Task(title, date));
  }
  remove(task) {
    const list = this._list;
    if (list.includes(task)) list.splice(list.indexOf(task), 1);
  }
  byTitle(stateGroup = true) {
    return this.list("title", stateGroup);
  }
  byDate(stateGroup = true) {
    return this.list("date", stateGroup);
  }
  list(sort, stateGroup = true) {
    const list = this._list,
      f = (a, b) => a[sort] > b[sort];
    const map = (task) => task.list(sort, stateGroup);
    return {
      task: this,
      list: !stateGroup
        ? [...list].sort(f).map(map)
        : [
            ...list
              .filter((v) => !v.isComplete())
              .sort(f)
              .map(map),
            ...list
              .filter((v) => v.isComplete())
              .sort(f)
              .map(map),
          ],
      //   list: !stateGroup
      //     ? [...list].sort(f)
      //     : [
      //         ...list.filter((v) => !v.isComplete()).sort(f),
      //         ...list.filter((v) => v.isComplete()).sort(f),
      //       ],
    };
  }
};

const el = (tag, attr = {}) =>
  Object.entries(attr).reduce((el, v) => {
    typeof el[v[0]] == "function" ? el[v[0]](v[1]) : (el[v[0]] = v[1]);
    return el;
  }, document.createElement(tag));

const DomRenderer = class {
  constructor(parent) {
    this._parent = parent;
  }
  renderer(data) {
    const {
      task: { _title: title },
      list,
    } = data;
    const parent = document.querySelector(this._parent);
    parent.innerHTML = "";
    parent.appendChild(el("h1", { innerHTML: title }));
    parent.appendChild(this._render(el("ul"), list));
  }
  _render(parent, list) {
    list.forEach(({ task, list }) => {
      const li = parent.appendChild(el("li"));
      li.appendChild(el("div", { innerHTML: task._title })),
        li.appendChild(this._render(el("ul"), list));
    });
    return parent;
  }
};

const folder = new Task("비사이드");
folder.add("지라설치");
folder.add("지라클라우드접속");

const { list } = folder.list("title");
list[1].task.add("ppt 정리");
list[1].task.add("코드정리");

const { list: sublist } = list[1].task.list("title");
sublist[1].task.add("슬라이드마스터 정리");
sublist[1].task.add("디자인개선");
const todo = new DomRenderer("#a");
todo.renderer(folder.list("title"));
console.log(folder.list("title"));
