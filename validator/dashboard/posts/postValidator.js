const { body } = require("express-validator");
const cheerio = require("cheerio");
module.exports = [
  body("title")
    .not()
    .isEmpty()
    .withMessage("Title Can NOT BE empty")
    .isLength({ max: 100 })
    .withMessage("tItle can not be more than 100 chars")
    .trim(),
  body("body")
    .not()
    .isEmpty()
    .withMessage("Body can not be eempty")
    .custom((value) => {
      let node = cheerio.load(value);
      let text = node.text();

      if (text.length > 5000) {
        throw new Error("Body Can Not be Greater than 500 chars");
      }

      return true;
    }),
];
