let count = 0;

class Page {
  constructor(process, index) {
    this.process = process;
    this.index = index;
    this.memory = null;
    this.position = null;
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
  constructor(pageSize = 512,size = Math.random() * 4096) {
    this.id = "Proceso_"+count++;
    this.pageSize = pageSize;
    this.size = size;
    this.status = 0;
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
  refresAvailablePages(){
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
  }

  checkAvailablePages(pages) {
    this.refresAvailablePages();
    if (pages <= this.framesRamAvailable.length) {
      return 1;
    } else if (pages <= this.framesRamAvailable.length + this.framesVirtualAvailable.length) {
      return 2;
    } else {
      return 3;
    }
  }

  addExecute(process, type) {
    
    //Load in frames ram and virtual
    switch (type) {
      case 1:
        this.refresAvailablePages();
        for (let i = 0; i < process.getPages; i++) {
          this.framesRamTotal[this.framesRamAvailable[i]].page = process.getId;
          process.getTablePages[i].setPosition = this.framesRamAvailable[i];
          process.getTablePages[i].setMemory = 0;
        }

        if(process.getStatus===2){
          process.getTablePages.forEach((page, index) => {
            document.querySelector(`#frameRam${page.getPosition}`).className ="frame_wait";
            document.querySelector(`#frameRam${page.getPosition}`).innerHTML = `${index} - ${process.getId}`;
          });
        }else{
          process.getTablePages.forEach((page, index) => {
            document.querySelector(`#frameRam${page.getPosition}`).className ="frame_execute";
            document.querySelector(`#frameRam${page.getPosition}`).innerHTML = `${index} - ${process.getId}`;
          });
        }
        setTimeout(()=>{
          this.deleteExecute(process);
        },Math.round(Math.random() * (10000 - 3000) + 3000));
        break;
      case 2:
        this.refresAvailablePages();
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

        if(process.getStatus===2)
        {
          process.getTablePages.forEach((page, index) => {
            if(page.getMemory===0){
              document.querySelector(`#frameRam${page.getPosition}`).className ="frame_wait";
              document.querySelector(`#frameRam${page.getPosition}`).innerHTML = `${index} - ${process.getId}`;
            }else{
              document.querySelector(`#frameVirtual${page.getPosition}`).className ="frame_wait";
              document.querySelector(`#frameVirtual${page.getPosition}`).innerHTML = `${index} - ${process.getId}`;
            }
          })
        }else{
          process.setStatus=1;
          process.getTablePages.forEach((page, index) => {
            if(page.getMemory===0){
              document.querySelector(`#frameRam${page.getPosition}`).className ="frame_execute";
              document.querySelector(`#frameRam${page.getPosition}`).innerHTML = `${index} - ${process.getId}`;
            }else{
              document.querySelector(`#frameVirtual${page.getPosition}`).className ="frame_execute";
              document.querySelector(`#frameVirtual${page.getPosition}`).innerHTML = `${index} - ${process.getId}`;
            }
          })
        };
        //Load in execute process.
        this.executeProcesses.push(process);
        //Timeout from finish process
        setTimeout(()=>{
          this.deleteExecute(process);
        },Math.round(Math.random() * (10000 - 3000) + 3000));
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
    this.refresAvailablePages();
  }
  
  deleteExecute(process){
    // Delete process from this.executeProcess
    let pos;
    this.executeProcesses.forEach((item,index)=>{
      if(item.id===process.getId){
        pos = index;
        return;
      }
    });
    
    this.executeProcesses.splice(pos,1);
    process.setStatus=0;

    // Delete process from this.framesRamTotal and this.framesVirtualTotal
    process.getTablePages.forEach((page)=>{
      if(page.getMemory===0){
        this.framesRamTotal[page.getPosition].page=null;
      }else{
        this.framesVirtualTotal[page.getPosition].page=null;
      }
    });
    this.refresAvailablePages();
    // Delete process from view
    document.querySelector(`#${process.getId}`).remove();
    process.getTablePages.forEach((page) => {
        if(page.getMemory===0){
          document.querySelector(`#frameRam${page.getPosition}`).className ="frame";
          document.querySelector(`#frameRam${page.getPosition}`).innerHTML = "";
          page.setMemory=null;
        }else{
          document.querySelector(`#frameVirtual${page.getPosition}`).className ="frame";
          document.querySelector(`#frameVirtual${page.getPosition}`).innerHTML = "";
          page.setMemory=null;
        }
    });

    this.addFinish(process);
    this.waitToExecute();
  }

  addWait(process) {
    //Change status of process
    process.setStatus=2;
    //Load in execute process.
    this.waitProcesses.push(process);
    //Load in execute frame.
    const waitFrame = document.querySelector("#wait");
    let element = document.createElement("div");
    let text = document.createTextNode(`${process.id}`);
    element.id = process.id;
    element.className = "item";
    element.focus();
    element.appendChild(text);
    waitFrame.appendChild(element);
  }
  deleteWait(process){
    //Delete from frame wait
    document.querySelector(`#${process.getId}`).remove();
    this.loadProcess(process);
  }
  waitToExecute(){
    if(this.waitProcesses.length>0){
      let amount = this.waitProcesses.length;
      for(let i=0;i<amount;i++ ){
        this.deleteWait(this.waitProcesses[i]);
      };
      // Delete process from this.waitProcess
      for(let i=0;i<amount;i++ ){
        this.waitProcesses.splice(i,1);
      };
    }
  }

  addFinish(process) {
    //Change status of process
    process.setStatus=0;
    //Load in execute process.
    this.finishProcesses.push(process);
    //Load in execute frame.
    const finishFrame = document.querySelector("#finish");
    let element = document.createElement("div");
    let text = document.createTextNode(`${process.id}`);
    element.id = process.id;
    element.className = "item";
    element.focus();
    element.appendChild(text);
    finishFrame.appendChild(element);
  }
}

const memory = new Memory(6144, 6144);
let interval;

const init=()=>{
  memory.createProcess();
  interval = setInterval(()=>{
    memory.createProcess();
  },Math.round(Math.random() * (2000 - 1000) + 1000));
}

const finish=()=>{
  clearInterval(interval);
}
