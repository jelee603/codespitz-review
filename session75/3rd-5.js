const Loader = class {
  constructor(data) {
    this.data = data;
  }
  load(cb) {
    cb(new JsonData(this.data));
  }
};

const Data = class {
  async getData() {
    const json = await this._getData();
    return new Info(json);
  }
  async _getData() {
    throw "_getData must override ";
  }
};

const JsonData = class extends Data {
  constructor(data) {
    super();
    this._data = data;
  }
  async _getData() {
    let json;
    if (typeof this._data == "string") {
      const response = await fetch(this._data);
      json = await response.json();
    } else json = this._data;
    return new Info(json);
  }
};

const Renderer = class {
  constructor() {}
  async render() {
    if (!(this.data instanceof Data)) throw "invalid data type";
    this._info = await this.data.getData();
    this._render();
  }

  setData(data) {
    this.data = data;
  }

  _render() {
    throw "_render must override";
  }
};

const TableRenderer = class extends Renderer {
  constructor(parent) {
    if (typeof parent != "string" || !parent) throw "invalid param";
    super();
    this._parent = parent;
  }
  _render() {
    const parent = document.querySelector(this._parent);
    if (!parent) throw "invalid parent";
    parent.innerHTML = "";
    const { title, header, items } = this._info;
    const [table, caption, thead] = "table,caption,thead"
      .split(",")
      .map((v) => document.createElement(v));
    caption.innerHTML = title;
    table.append(
      ...[
        caption,
        header.reduce(
          (_, v) => (
            (thead.appendChild(document.createElement("th")).innerHTML = v),
            thead
          ),
          header[0]
        ),
        ...items.map((item) =>
          item.reduce(
            (tr, v) => (
              (tr.appendChild(document.createElement("td")).innerHTML = v), tr
            ),
            document.createElement("tr")
          )
        ),
      ]
    );
    parent.appendChild(table);
  }
};

const Info = class {
  constructor(json) {
    const { title, header, items } = json;
    if (typeof title != "string" || !title) throw "invalid title";
    if (!Array.isArray(header) || !header.length) throw "invalid header";
    if (!Array.isArray(items) || !items.length) throw "invalid items";
    this._private = { title, header, items };
  }
  get title() {
    return this._private.title;
  }
  get header() {
    return this._private.header;
  }
  get items() {
    return this._private.items;
  }
};

// main
const loader = new Loader("75_1.json");
loader.load((json) => {
  const renderer = new TableRenderer("#data");
  renderer.setData(json);
  renderer.render();
});
