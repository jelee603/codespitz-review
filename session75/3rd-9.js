class Search {
  search(v) {}
}
class File extends Search {
  search(v) {
    return this.content.inclcudes(v) ? [this] : [];
  }
}
class Folder extends Search {
  search(v) {
    return this.children.filter((f) => f.search(v).length);
  }
}
