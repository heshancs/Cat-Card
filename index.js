(async() => {

    let axios = require('axios');
    let argv = require('minimist')(process.argv.slice(2));
    let {joinImages} = require('join-images');

    // define variables
    let {
        greeting = 'Hello', who = 'You',
        width = 400, height = 500, color = 'Pink', size = 100,
        catUrl = 'https://cataas.com/cat/'
    } = argv;

    // define request urls
    let reqArr = [
        `${catUrl}says/${greeting}?width=${width}&height=${height}&color${color}&s=${size}`,
        `${catUrl}says/${who}?width=${width}&height=${height}&color${color}&s=${size}`
    ];

    /**
        * Returns a list of cats from the given url.
        * @param reqArr a array of urls for fetch cats
        * @return a list of cats
    */
    const fetchCatListFn = async(reqArr) => {

        const catArr = [];
        try {
            for (let i = 0; i < reqArr.length; ++i) {
                const res = await axios.get(reqArr[i], {responseType:'arraybuffer'});
                catArr.push(res.data);
                console.log('Received response with status:' + res.status);
            }
            return catArr;

        } catch (e) {
            console.log(e);
        }
    }

    /**
        * Returns save a joined image.
        * @param catList A list of cats to join
        * @param direction Direction of the merged image (vertical|horizontal) .
    */
    const joinImagesFn = async(catList, direction) => {
        
        await joinImages(catList, {direction})
        .then((img) => {
            img.toFile('cat-card.jpg');
            console.log("The file was saved!");
        })
        .catch((e) => {
            console.log(e);
        })
    }

    // create the cat card
    try {
        const catList = await fetchCatListFn(reqArr);
        await joinImagesFn(catList, 'horizontal');
    } catch (e) {
        console.log(e);
    }

})();



