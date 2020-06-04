const Table = ((_) => {
  const Private = Symbol();
  return class {
    constructor(parent) {
      if (typeof parent != "string" || !parent) throw "invalid params";
      this[Private] = { parent };
    }
    async load(url) {
      const response = await fetch(url);
      if (!response.ok) throw "invalid response";

      const { title, header, items } = await response.json();
      if (!items.length) throw "no items";
      Object.assign(this[Private], { title, header, items });
      this.render();
    }
    render() {
      // 부모, 데이터 체크
      const { parent, title, header, items } = this[Private];
      const parentEl = document.querySelector(parent);
      if (!parentEl) throw "invalid parent element";
      if (!items || !items.length) {
        parentEl.innerHTML = "no data";
        return;
      } else {
        parentEl.innerHTML = "";
      }
      // 테이블 생성
      // 타이틀은 caption으로
      const table = document.createElement("table");
      const caption = document.createElement("caption");
      caption.innerHTML = title;
      table.appendChild(caption);
      // 헤더는 thead로
      table.appendChild(
        header.reduce((thead, data) => {
          const th = document.createElement("th");
          th.innerHTML = data;
          thead.appendChild(th);
          return thead;
        }, document.createElement("thead"))
      );
      // 아이템은 tr로
      table.append(
        ...items.map((item) =>
          item.reduce((tr, data) => {
            const td = document.createElement("td");
            td.innerHTML = data;
            tr.appendChild(td);
            return tr;
          }, document.createElement("tr"))
        )
      );
      // 부모에 테이블 삽입
      parentEl.appendChild(table);
    }
  };
})();
const table = new Table("#data");
table.load("75_1.json");
