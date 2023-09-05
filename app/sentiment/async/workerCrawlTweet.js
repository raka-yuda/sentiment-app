const Api = require('../Api');

const api = new Api()
const searchTweets = async (data) => {
    let { keyQuery, query, countCleanTweets = 0, cleanTweets = [], countCrawlTweets = 0, crawlTweets = [] } = data;
    console.log("data: ", data)
    const limitResultTweets = 100;
    const limitResultCleanTweet = 100;

    const paramSearchTweet = {
        query: {
        query: `lang:en ${query}`,
        limitResult: limitResultTweets
        }
    }

    const responseSearchTweet = await api.search_tweets_v2(paramSearchTweet);
    const tweets = responseSearchTweet.data.data

    let countCleanData = 0;
    let cleanedTweets = [
        ...cleanTweets
    ]
    for (let indexTweet in tweets) {
        const dataTweet = tweets[indexTweet]
        const tweet = dataTweet.text.replaceAll(/\s/g,' ')
        if (!tweet.includes('…') && dataTweet.lang === "en" && (countCleanTweets + countCleanData) < limitResultCleanTweet) {
            cleanedTweets.push({
                keyTweet: `${keyQuery}-tweet-${cleanedTweets.length}`,
                tweet
            })
            countCleanData += 1
        }
    }

    console.log("countCleanData: ", countCleanData)
    let res = {
        query,
        keyQuery,
        // originalTweets: {
        //   ...crawlTweets,
        //   responseSearchTweet.data.data,
        // }
        countCrawlTweets: countCrawlTweets + tweets.length,
        countCleanTweets: countCleanTweets + countCleanData,
        cleanTweets: [
            ...cleanedTweets
        ]
    }
    console.log("res: ", res)
    if (countCleanTweets < limitResultCleanTweet) {
        console.log("countCleanTweets: ", countCleanTweets)
        console.log("Recursive Called...")
        // res = await searchTweets(res)
        return await searchTweets(res)
        // setTimeout(async () => {
        //   searchTweets(res)
        // }, 1000) 
    } 

    console.log("Final Result...")
    console.log("res: ", res)

    return res
}

process.on('message', async data => {
    // Simulate processing time
    // const {}
    console.log(data)
    // let { name } = data;
    query = data?.name.replace('AND', '')
    const res = await searchTweets({
        keyQuery: data?.keyQuery,
        query
    })
    // const res = await searchTweets({query})
    // setTimeout(async () => {
    // //   // Send processed data back to the parent process
    // //   console.log("Processing Data: ", data)
    //     // setTimeout(() => {
    //     //     console.log("Processing Data: ", data)
    //     // }, 1000)
    //     console.log("Processing Data: ", data)
    //     await new Promise(resolve => setTimeout(resolve, 1000));
    //     process.send(data);
    // }, 2000);
    process.send(res);
});