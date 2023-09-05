const { fork } = require('child_process');
const { performance, memory } = require('perf_hooks');

class RunnerCrawlTweet {
  constructor(numWorkers) {
    this.dataQueue = [];
    this.numWorkers = numWorkers;
    this.workers = [];
    this.isProcessing = false;
    this.startTime = null;
    this.resultTweets = []
  }

  insertData (data) {
    this.dataQueue.push(...data);
    this.processData();
  }

  async getResultTweets() {
    return new Promise((resolve, reject) => {
      const checkResult = () => {
        if (this.dataQueue.length === 0 && this.workers.every(worker => !worker.isBusy)) {
          resolve(this.resultTweets);
        } else {
          setTimeout(checkResult, 100); // Check again after 100ms
        }
      };
  
      checkResult();
    });
  }

  processData() {
    // console.log("Start Processing...");

    if (this.isProcessing) {
      return; // Already processing data
    }

    if (this.dataQueue.length === 0) {
      console.log("Empty Data");
    }

    this.isProcessing = true;

    const availableWorkers = this.workers.filter(worker => !worker.isBusy);

    if (availableWorkers.length === 0) {
      this.isProcessing = false;
      return; // All workers are busy, wait for next round
    }

    while (availableWorkers.length > 0 && this.dataQueue.length > 0) {
      const worker = availableWorkers.shift();
      const data = this.dataQueue.shift();
      worker.isBusy = true;
      worker.worker.send(data);
    }

    // Check if all data items are processed
    if (this.dataQueue.length === 0 && this.workers.every(worker => !worker.isBusy)) {
      console.log('All data items processed. Terminating workers.');
      this.workers.forEach(worker => worker.worker.kill());
      
      // console.log("this.resultTweets: ", this.resultTweets)

      const endTime = performance.now();
      const executionTime = endTime - this.startTime;
      console.log('Total execution time:', executionTime, 'ms');

      const memUsage = process.memoryUsage();
      console.log('Memory usage:', formatMemoryUsage(memUsage));
    }

    this.isProcessing = false;
  }

  async runAsyncProcess() {
    const numWorkers = this.numWorkers;

    console.log("Start Processing...");
    this.start = performance.now();

    for (let i = 0; i < numWorkers; i++) {
      const worker = fork('./modules/scrape/workerCrawlTweet.js');

      worker.on('message', data => {
        console.log(`Worker ${i + 1} received: ${data}`);
        this.resultTweets.push(data)
        // console.log("this.resultTweets: ", this.resultTweets)
        this.workers[i].isBusy = false;
        this.processData(); // Process the next data item
      });

      this.workers.push({ worker, isBusy: false, id: i });
    }
    this.processData(); // Start processing data
  }
}

function formatMemoryUsage(memoryUsage) {
  const format = (bytes) => (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  return {
    rss: format(memoryUsage.rss),
    heapTotal: format(memoryUsage.heapTotal),
    heapUsed: format(memoryUsage.heapUsed),
    external: format(memoryUsage.external),
  };
}

// const runner = new RunnerCrawl(2);

// const data = Array.from(Array(1000+1).keys()).slice(1)  
// // const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
// runner.insertData(data);
// runner.runAsyncProcess();

module.exports.RunnerCrawlTweet = RunnerCrawlTweet

// Cleaned data per trend 100
// Worker 2
// All data items processed. Terminating workers.
// Total execution time: 47903.531625032425 ms
// Memory usage: {
//   rss: '46.03 MB',
//   heapTotal: '13.44 MB',
//   heapUsed: '11.29 MB',
//   external: '1.09 MB'
// }

// Cleaned data per trend 100
// Worker 5
// All data items processed. Terminating workers.
// Total execution time: 19594.783625125885 ms
// Memory usage: {
//   rss: '45.14 MB',
//   heapTotal: '12.94 MB',
//   heapUsed: '12.10 MB',
//   external: '1.10 MB'
// }