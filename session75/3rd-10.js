const Visitor = class {
    folder(task) { throw 'override'; }
    parent(v, task) {throw 'override'; }
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

const Renderer = class {
    constructor (visitor) {this.visitor = visitor;}
    render({task, list}) {
        const v = this.visitor.folder(task);
        this.subTask(this.visitor.parent(v, task), list);
    }
    subTask(parent, list) {
        list.forEach(({task, list})=> {
            cosnt v = this.visitor.task(parent, task);
            this.subTask(this.visitor.parent(v, this), list);
        });
    }
};


const folder = new Task('s3-4');
folder.add('2강교안작성');
folder.add('3강교안작성');
const {list} = folder.list('title');
list[1].task.add('ppt정리');
list[1].task.add('코드정리');
const {list:sublist} = list[i].task.list('title');
list[1].task.add('슬라이드마스터 정리');
list[1].task.add('디자인개선');

const renderer = new renderer(new DomVisitor('#p'));
renderer.render(folder.list('title'));