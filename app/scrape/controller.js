const puppeteer = require('puppeteer')
const { writeJsonData, readJsonData } = require('../../utils/helper');

const LIST_DATA_SEMINAR_CATEGORIES = [
    {
        'category': 'seni',
        'urlTarget': 'https://eventkampus.com/search?keyword=seni'
    },
    {
        'category': 'teknologi',
        'urlTarget': 'https://eventkampus.com/search?keyword=technology&type=event'
    },
]

const LIST_DATA_COMPTITION_CATEGORIES = [
    {
        'category': 'uncategorized',
        'urlTarget': 'https://planbe.id/info-acara/?s&filter-title=lomba'
    },
]


const processScrapeSeminar = async () => {

    let tempResult = {
        'timeScrapping': new Date(),
        'dataSeminar': []
    };

    for (const dataSeminar of LIST_DATA_SEMINAR_CATEGORIES) {
        const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
        const page = await browser.newPage()
        const url = dataSeminar.urlTarget
        await page.goto(url)

        if (dataSeminar.category === "seni" || dataSeminar.category === "teknologi") {

            const selector = "div.cd-beasiswa.d-flex.flex-column"

            await page.waitForSelector(selector);

            let tempDataSeminarSeni = [];
            const dataSeminarSeni = await page.$$eval(selector, (cardTemp) => {
                return cardTemp.map((node) => {
                    const judulSeminar = node.querySelector("div.cd-beasiswa__judul > a").innerText;
                    const imageSrcSeminar = node.querySelector("div.cd-beasiswa__foto.img-full > a > img").getAttribute("data-src");
                    const linkSeminar = node.querySelector("div.cd-beasiswa__judul > a[href]").getAttribute("href");
                    return {
                        judulSeminar,
                        imageSrcSeminar,
                        linkSeminar
                    };
                });
            });

            tempDataSeminarSeni = [...tempDataSeminarSeni, ...dataSeminarSeni]
            tempResult.dataSeminar.push(
                {
                    category: dataSeminar.category,
                    length: tempDataSeminarSeni.length,
                    data: tempDataSeminarSeni,
                }
            )
        }

        await browser.close()
    }
    return tempResult;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const getPagination = async (url) => {
    let listUrlPagination = []

    const hostname = new URL(url).hostname;
    if (hostname === "planbe.id") {
        let maxPagination = 2;

        // const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
        // const page = await browser.newPage()
        // const url = "https://planbe.id/info-acara/?s&filter-title=lomba"
        // await page.goto(url)

        // const selector = "a.page-numbers"

        // await page.waitForSelector(selector);


        // const listPagination = await page.$$eval(selector, (cardTemp) => {
        //     return cardTemp.map((node) => {
        //         return node.innerText
        //     });
        // });

        // maxPagination = Math.max(...listPagination.map((numPage) => Number(numPage)))

        if (maxPagination !== 0) {
            for(let i = 1; i <= maxPagination; i++) {
                const urlPagination = `https://planbe.id/info-acara/page/${i}/?s&filter-title=lomba`;
                listUrlPagination.push(urlPagination)
            }
        }
        
        // await browser.close()
    }

    return listUrlPagination;

}

const processScrapeCompetition = async () => {

    let tempResult = {
        'timeScrapping': new Date(),
        'dataCompetition': []
    };


    for (const dataCompetition of LIST_DATA_COMPTITION_CATEGORIES) {
        if (dataCompetition.category === "uncategorized") {
            const listUrlPagination = await getPagination(dataCompetition.urlTarget);

            if (listUrlPagination) {

                let tempListDataCompetition = [];

                for (const urlDataCompetition of listUrlPagination) {
                    const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
                    const page = await browser.newPage()
                    const url = urlDataCompetition
                    await page.goto(url)

                    const selector = "div.item-job.col-sm-12.col-md-12.col-xs-12.lg-clearfix.md-clearfix"
                
                    const listDataCompetition = await page.$$eval(selector, (cardTemp) => {
                        return cardTemp.map((node) => {
                            const titleCompetition = node.querySelector("h2.job-title > a").innerText;
                            const imageSrcCompetition = node.querySelector("div.employer-logo > a > img").getAttribute("src");
                            const linkCompetition = node.querySelector("div.employer-logo > a[href]").getAttribute("href");
                            return {
                                titleCompetition,
                                imageSrcCompetition,
                                linkCompetition,
                            };
                        });
                    });

                    console.log(`Success scrape ${listDataCompetition.length} data...`)

                    tempListDataCompetition = [...tempListDataCompetition, ...listDataCompetition]

                    await browser.close()
                    
                }

                tempResult.dataCompetition.push(
                    {
                        category: dataCompetition.category,
                        length: tempListDataCompetition.length,
                        data: tempListDataCompetition,
                    }
                )
                
            } 
        }  
    }
    return tempResult;
}

const processScrapeSeminarNew = async () => {

    let tempResult = {
        timeScrapping: new Date(),
        length: 0,
        dataSeminar: []
    };

    for (const dataSeminar of LIST_DATA_SEMINAR_CATEGORIES) {
        const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
        const page = await browser.newPage()
        const url = dataSeminar.urlTarget
        await page.goto(url)

        if (dataSeminar.category === "seni" || dataSeminar.category === "teknologi") {

            const selector = "div.cd-beasiswa.d-flex.flex-column"

            await page.waitForSelector(selector);

            let tempDataSeminarSeni = [];

            const dataSeminarSeni = await page.$$eval(selector, (cardTemp) => {
                return cardTemp.map((node) => {
                    const judulSeminar = node.querySelector("div.cd-beasiswa__judul > a").innerText;
                    const imageSrcSeminar = node.querySelector("div.cd-beasiswa__foto.img-full > a > img").getAttribute("data-src");
                    const linkSeminar = node.querySelector("div.cd-beasiswa__judul > a[href]").getAttribute("href");
                    return {
                        judulSeminar,
                        imageSrcSeminar,
                        linkSeminar,
                    };
                });
            });

            tempDataSeminarSeni = [...tempDataSeminarSeni, ...dataSeminarSeni];

            tempResult = {
                ...tempResult,
                dataSeminar: [...tempResult.dataSeminar, ...tempDataSeminarSeni].map((data) => { 
                    return {
                        ...data, 
                        categorySeminar: dataSeminar.category
                    }
                }),
            }

            // tempResult.dataSeminar.map(())

            tempResult.length = tempResult.dataSeminar.length;

            // tempResult.dataSeminar.push(
            //     {
            //         category: dataSeminar.category,
            //         length: tempDataSeminarSeni.length,
            //         data: tempDataSeminarSeni,
            //     }
            // )
        }

        await browser.close()
    }
    return tempResult;
}


module.exports = {
    scrappingSeminar: async (req, res) => {
        try {
            const data = await processScrapeSeminar();
            await writeJsonData("data-seminar", data)
            res.status(200).json({ message: "Data Already Scrapped" })
        } catch (error) {
            console.log(error)
        }
    },

    getDataSeminar: async (req, res) => {
        try {
            const data = readJsonData("data-seminar")
            res.status(200).json({ data })
        } catch (err) {
            res.status(400).json({ message: err.message })
        }
    },

    scrappingCompetition: async (req, res) => {
        try {
            const data = await processScrapeCompetition();
            await writeJsonData("data-competition", data)
            res.status(200).json({ message: "Data Already Scrapped" })
        } catch (error) {
            console.log(error)
        }
    },

    getDataCompetition: async (req, res) => {
        try {
            const data = readJsonData("data-competition")
            res.status(200).json({ data })
        } catch (err) {
            res.status(400).json({ message: err.message })
        }
    },

    scrappingSeminarNew: async (req, res) => {
        try {
            const data = await processScrapeSeminarNew();
            await writeJsonData("data-seminar-new", data)
            res.status(200).json({ message: "Data Already Scrapped" })
        } catch (error) {
            console.log(error)
        }
    },

    getDataSeminarNew: async (req, res) => {
        try {
            const { page = 1, limit = 10 } = req.query;

            if(page && limit) {
                console.log("page: ", page)
                console.log("limit: ", limit)
            }

            const data = readJsonData("data-seminar-new");

            const maxPage = Math.ceil(data.length / limit)

            if (Number(limit) > 20) {
                throw new Error("Please set limit below 20")
            }

            if (Number(page) > maxPage) {
                throw new Error(`Max page based on data in server ${maxPage}`)
            }
            
            const dataSeminar = data.dataSeminar.slice(((page - 1) * limit), (page * limit))

            const newData = {
                ...data,
                page,
                limit,
                dataSeminar,
                length: dataSeminar.length
            };
            

            res.status(200).json({ data: newData })
        } catch (err) {
            res.status(400).json({ message: err.message })
        }
    },

    getListDataCompetition: async (req, res) => {
        try {
            const dataCompetition = readJsonData("data-competition");
            
            const { draw = 1, start = 1, length = 10, search} = req.query;

            // console.log("searchValue: ", req.query);
            // console.log("start: ", start);
            // console.log("length: ", Number(start) + Number(length));
            // console.log(dataCompetition.dataCompetition[0].length)

            let tempDataSearch = dataCompetition;
            
            if (search.value) {
                tempDataSearch = dataCompetition.dataCompetition[0].data.filter((data) => {
                    if (data.titleCompetition.includes(search.value)) {
                        return data
                    }
                }).slice(start, Number(start) + Number(length))

                const data = {
                    draw: draw + 1,
                    recordsTotal: tempDataSearch.length,
                    recordsFiltered: tempDataSearch.length,
                    data: tempDataSearch.map((competition, index) => {
                        return [
                            index + 1,
                            capitalizeFirstLetter(dataCompetition.dataCompetition[0].category),
                            competition.titleCompetition,
                            `<a href=${competition.linkCompetition}>${competition.linkCompetition}<a>`,
                        ]
                    })
                }
                
                res.status(200).json(data)
            }

            const dataCompetitionPagination = dataCompetition.dataCompetition[0].data.slice(start, Number(start) + Number(length))

            const data = {
                draw: draw + 1,
                recordsTotal: dataCompetition.dataCompetition[0].length,
                recordsFiltered: dataCompetition.dataCompetition[0].length,
                data: dataCompetitionPagination.map((competition, index) => {
                    return [
                        index + 1,
                        capitalizeFirstLetter(dataCompetition.dataCompetition[0].category),
                        competition.titleCompetition,
                        `<a href=${competition.linkCompetition}>${competition.linkCompetition}<a>`,
                    ]
                })
            }
            // console.log("start: ", start);
            // console.log("length: ", Number(start) + Number(length));
            // console.log(data)
            res.status(200).json(data)
            
        } catch (err) {
            res.status(400).json({ message: err.message })
        }
    },
    readJsonData
}