import axios from "axios";
import { joinImages } from "join-images";
import argv from "minimist";
process.argv.slice(2);

// define variables
const {
  width = 400,
  height = 500,
  color = "Pink",
  size = 100,
  catUrl = "https://cataas.com/cat/says/",
  textArr = ["Hello", "You"],
} = argv;

/**
 * Returns a list of cats images with given text
 * @param textArr a array of text for fetch cats card page
 * @return a list of cats
 */
const fetchCatListFn = (textArr) => {
  try {
    const catPromiseArr = textArr.map((text) => {
      return axios.get(catUrl + text, {
        params: {
          width,
          height,
          color,
          s: size,
        },
        responseType: "arraybuffer",
      });
    });
    const catData = Promise.all(catPromiseArr)
    .then((cats) => {
      return cats.map((cat) => {
        console.log("Received response with status:" + cat.status);
        return cat.data;
      });
    });
    return catData;
  } catch (e) {
    console.log(e);
  }
};

/**
 * Returns save a joined image.
 * @param catList A list of cats to join
 * @param direction Direction of the merged image (vertical|horizontal) .
 */
const joinImagesFn = (catList, direction) => {
  joinImages(catList, { direction })
    .then((img) => {
      img.toFile("cat-card.jpg");
      console.log("The file was saved!");
    })
    .catch((e) => {
      console.log(e);
    });
};

// create the cat card
try {
  fetchCatListFn(textArr)
  .then((catList) => {
    joinImagesFn(catList, "horizontal");
  });
} catch (e) {
  console.log(e);
}
