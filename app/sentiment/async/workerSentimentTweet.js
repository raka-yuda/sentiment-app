const Api = require('../Api');

const api = new Api()

process.on('message', async data => {
    // Simulate processing time
    console.log(data)
    const { keyTweet, tweet } = data;
    const paramGetSentimentValue = {
        body: {
            text: tweet
        }
    }

    setTimeout(async () => {
        const response = await api.get_sentiment_value(paramGetSentimentValue);
        console.log(response)
        const res = {
            keyTweet,
            tweet,
            score: response?.data?.score_tag
        }
        process.send(res);
    }, 200)
    // Safe for time limit sentiment API: 250 - 500 for 2 worker

});