const { fork } = require('child_process');
const { performance, memory } = require('perf_hooks');

class RunnerSentimentTweet {
  constructor(numWorkers, data) {
    this.dataQueue = [];
    this.numWorkers = numWorkers;
    this.workers = [];
    this.isProcessing = false;
    this.startTime = null;
    this.resultTweets = data
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

  setDataQueue () {
    const result = [];

    this.resultTweets.forEach(trend => {
      trend.cleanTweets.forEach(tweet => {
        result.push(tweet);
      });
    });

    this.dataQueue = [
      ...this.dataQueue,
      ...result
    ];
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
      const worker = fork('./modules/scrape/workerSentimentTweet.js');

      worker.on('message', data => {
        console.log(`Worker ${i + 1} received: ${data}`);
        const keySplit = data?.keyTweet.split('-')
        const keyQuery = keySplit[1]
        const keyTweet = keySplit[3]
        // this.resultTweets = [
        //   ...this.resultTweets,
        //   ...this.resultTweets[`${keyQuery}`].cleanTweets[`${keyTweet}`]
        // ]
        this.resultTweets[`${keyQuery}`].cleanTweets[`${keyTweet}`].score = data?.score || ''
        
        // this.resultTweets.push(data)
        // console.log("this.resultTweets: ", this.resultTweets)
        this.workers[i].isBusy = false;
        this.processData(); // Process the next data item
      });

      this.workers.push({ worker, isBusy: false, id: i });
    }
    this.setDataQueue();
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

module.exports.RunnerSentimentTweet = RunnerSentimentTweet