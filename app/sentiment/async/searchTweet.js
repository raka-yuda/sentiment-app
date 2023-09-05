const searchTweets = async (data) => {
  let {
    query,
    countCleanTweets = 0,
    cleanTweets = [],
    countCrawlTweets = 0,
    crawlTweets = [],
  } = data;

//   const limitResultTweets = 100;
//   const limitResultCleanTweet = 100;
  const limitResultTweets = 10;
  const limitResultCleanTweet = 10;
  let countCleanData = 0;
  let cleanedTweets = [];

  const paramSearchTweet = {
    query: {
      query: `lang:en ${query}`,
      limitResult: limitResultTweets,
    },
  };
  const responseSearchTweet = await api.search_tweets_v2(paramSearchTweet);

  const tweets = responseSearchTweet.data.data;
  for (let indexTweet in tweets) {
    const dataTweet = tweets[indexTweet];
    const tweet = dataTweet.text.replaceAll(/\s/g, " ");
    if (
      !tweet.includes("…") &&
      dataTweet.lang === "en" &&
      countCleanTweets + countCleanData < limitResultCleanTweet
    ) {
      cleanedTweets.push({
        tweet,
      });
      countCleanData += 1;
    }
  }

  const res = {
    query,
    // originalTweets: {
    //   ...crawlTweets,
    //   responseSearchTweet.data.data,
    // }
    countCrawlTweets: countCrawlTweets + tweets.length,
    countCleanTweets: countCleanTweets + countCleanData,
    cleanTweets: [...cleanTweets, ...cleanedTweets],
  };

  if (countCleanTweets < limitResultCleanTweet) {
    return await searchTweets(res);
  }

  return res;
};

export default searchTweets;
