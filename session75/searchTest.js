class Search {
  search(v) {}
}
class File extends Search {
  search(v) {
    return this.content.includes(v) ? [this] : {};
  }
}
class Folder extends Search {
  serach(v) {
    return this.children.filter((f) => f.serach(v).length);
  }
}
