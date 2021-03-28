class Page {
  constructor(process, index) {
    this.process = process;
    this.index = index;
    this.memory = 0;
    this.position = 0;
  }
  //Getters
  get getProcess() {
    return this.process;
  }
  get getIndex() {
    return this.index;
  }
  get getMemory() {
    return this.memory;
  }
  get getPosition() {
    return this.position;
  }
  //Setters
  set setProcess(process) {
    this.process = process;
  }
  set setIndex(index) {
    this.index = index;
  }
  set setMemory(memory) {
    this.memory = memory;
  }
  set setPosition(position) {
    this.position = position;
  }
}

class Process {
  constructor(
    id = "P_" + Math.random().toString(36).substr(2, 9),
    pageSize = 512,
    size = Math.random() * 4096
  ) {
    this.id = id;
    this.pageSize = pageSize;
    this.size = size;
    this.status = 1;
    this.pages = Math.ceil(this.size / this.pageSize);
    this.tablePages = [];
    this.buildTablePages();
  }

  //Getters
  get getId() {
    return this.id;
  }
  get getPageSize() {
    return this.pageSize;
  }
  get getSize() {
    return this.size;
  }
  get getStatus() {
    return this.status;
  }
  get getPages() {
    return this.pages;
  }
  get getTablePages() {
    return this.tablePages;
  }

  //Setters
  set setId(id) {
    this.id = id;
  }
  set setPageSize(pageSize) {
    this.pageSize = pageSize;
  }
  set setSize(size) {
    this.size = size;
  }
  set setStatus(status) {
    this.status = status;
  }
  set setPages(pages) {
    this.pages = pages;
  }
  set setTablePages(tablePages) {
    this.tablePages = tablePages;
  }

  //Methods
  buildTablePages() {
    for (let i = 0; i < this.pages; i++) {
      this.tablePages.push(new Page(this.id, i));
    }
  }
}

class Memory {
  constructor(ramSize, virtualSize, frameSize = 512) {
    this.ramSize = ramSize;
    this.virtualSize = virtualSize;
    this.framesRamSize = Math.ceil(ramSize / frameSize);
    this.framesVirtualSize = Math.ceil(virtualSize / frameSize);
    this.framesRamTotal = [];
    this.framesVirtualTotal = [];
    this.framesRamAvailable = [];
    this.framesVirtualAvailable = [];
    this.executeProcesses = [];
    this.waitProcesses = [];
    this.finishProcesses = [];
    this.fillFramesMemory();
  }

  //Getters
  get getRamSize() {
    return this.ramSize;
  }
  get getVirtualSize() {
    return this.virtualSize;
  }
  get getFramesRamSize() {
    return this.framesRamSize;
  }
  get getFramesVirtualSize() {
    return this.framesVirtualSize;
  }
  get getFramesRamTotal() {
    return this.framesRamTotal;
  }
  get getFramesVirtualTotal() {
    return this.framesVirtualTotal;
  }
  get getFramesRamAvailable() {
    return this.framesRamAvailable;
  }
  get getFramesVirtualAvailable() {
    return this.framesVirtualAvailable;
  }

  //Setters
  set setRamSize(ramSize) {
    this.ramSize = ramSize;
  }
  set setVirtualSize(virtualSize) {
    this.virtualSize = virtualSize;
  }
  set setFramesRamSize(framesRamSize) {
    this.framesRamSize = framesRamSize;
  }
  set setFramesVirtualSize(framesVirtualSize) {
    this.framesVirtualSize = framesVirtualSize;
  }
  set setFramesRamTotal(framesRamTotal) {
    this.framesRamTotal = framesRamTotal;
  }
  set setFramesVirtualTotal(framesVirtualTotal) {
    this.framesVirtualTotal = framesVirtualTotal;
  }
  set setFramesRamAvailable(framesRamAvailable) {
    this.framesRamAvailable = framesRamAvailable;
  }
  set setFramesVirtualAvailable(framesVirtualAvailable) {
    this.framesVirtualAvailable = framesVirtualAvailable;
  }

  //Methods
  fillFramesMemory() {
    for (let i = 0; i < this.framesRamSize; i++) {
      this.framesRamTotal.push({
        position: i,
        page: null,
      });
    }
    for (let i = 0; i < this.framesVirtualSize; i++) {
      this.framesVirtualTotal.push({
        position: i,
        page: null,
      });
    }
  }

  createProcess() {
    this.loadProcess(new Process());
  }

  loadProcess(process) {
    switch (this.checkAvailablePages(process.getPages)) {
      case 1:
        this.addExecute(process, 1);
        break;
      case 2:
        this.addExecute(process, 2);
        break;
      case 3:
        this.addWait(process);
        break;
      default:
        break;
    }
  }

  checkAvailablePages(pages) {
    this.framesRamAvailable = [];
    this.framesVirtualAvailable = [];
    this.framesRamTotal.forEach((frame) => {
      if (frame.page === null) {
        this.framesRamAvailable.push(frame.position);
      }
    });
    this.framesVirtualTotal.forEach((frame) => {
      if (frame.page === null) {
        this.framesVirtualAvailable.push(frame.position);
      }
    });

    if (pages <= this.framesRamAvailable.length) {
      return 1;
    } else if (pages <= this.framesRamAvailable.length + this.framesVirtualAvailable.length) {
      return 2;
    } else {
      return 3;
    }
  }

  addExecute(process, type) {
    //Load in execute process.
    this.executeProcesses.push(process);
    //Load in frames ram and virtual
    switch (type) {
      case 1:
        for (let i = 0; i < process.getPages; i++) {
          this.framesRamTotal[this.framesRamAvailable[i]].page = process.getId;
          process.getTablePages[i].setPosition = this.framesRamAvailable[i];
          process.getTablePages[i].setMemory = 0;
        }

        process.getTablePages.forEach((page, index) => {
          document.querySelector(`#marcoRam${page.getPosition}`).className ="marco_execute";
          document.querySelector(`#marcoRam${page.getPosition}`).innerHTML = `${index} - ${process.getId}`;
        });
        break;
      case 2:
        for (let i = 0; i < this.framesRamAvailable.length; i++) {
          this.framesRamTotal[this.framesRamAvailable[i]].page = process.getId;
          process.getTablePages[i].setPosition = this.framesRamAvailable[i];
          process.getTablePages[i].setMemory = 0;
        }

        for (let i = this.framesRamAvailable.length; i < (process.getPages-this.framesRamAvailable.length)+this.framesRamAvailable.length; i++) {
          this.framesVirtualTotal[this.framesVirtualAvailable[i-this.framesRamAvailable.length]].page = process.getId;
          process.getTablePages[i].setPosition = this.framesVirtualAvailable[i-this.framesRamAvailable.length];
          process.getTablePages[i].setMemory = 1;
        }
        process.getTablePages.forEach((page, index) => {
          if(page.getMemory===0){
            document.querySelector(`#marcoRam${page.getPosition}`).className ="marco_execute";
            document.querySelector(`#marcoRam${page.getPosition}`).innerHTML = `${index} - ${process.getId}`;
          }else{
            document.querySelector(`#marcoVirtual${page.getPosition}`).className ="marco_execute";
            document.querySelector(`#marcoVirtual${page.getPosition}`).innerHTML = `${index} - ${process.getId}`;
          }
        });

        break;
      default:
        break;
    }
    //Load in execute frame.
    const executeFrame = document.querySelector("#execute");
    let element = document.createElement("div");
    let text = document.createTextNode(`${process.id}`);
    element.id = process.id;
    element.className = "item";
    element.focus();
    element.appendChild(text);
    executeFrame.appendChild(element);
  }

  addWait(process) {
    //Change status of process
    process.setStatus=2;
    console.log(process);
    //Load in execute process.
    this.waitProcesses.push(process);
    //Load in execute frame.
    const executeFrame = document.querySelector("#wait");
    let element = document.createElement("div");
    let text = document.createTextNode(`${process.id}`);
    element.id = process.id;
    element.className = "item";
    element.focus();
    element.appendChild(text);
    executeFrame.appendChild(element);
  }

  addFinish(process) {
    //Change status of process
    process.setStatus=0;
    console.log(process);
    //Load in execute process.
    this.waitProcesses.push(process);
    //Load in execute frame.
    const executeFrame = document.querySelector("#finish");
    let element = document.createElement("div");
    let text = document.createTextNode(`${process.id}`);
    element.id = process.id;
    element.className = "item";
    element.focus();
    element.appendChild(text);
    executeFrame.appendChild(element);
  }
}

const memory = new Memory(6144, 6144);

// setInterval(()=>{
//   memory.createProcess();
// },5000);



