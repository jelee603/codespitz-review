const Visitor = class {
    folder(task) { throw 'override'; }
    task(v, task) { throw 'override'; }
}

const ConsoleVisitor = class extends Visitor {
    folder({_title: title}) {
        console.log('-----------------');
        console.log('folder', title)
        return '';
    }
    parent(v, list) {
        return v;
    }
    task(v, {_title: title}){
        console.log(v, title);
        return v + '-';
    }
}