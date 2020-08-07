const mongoose = require('mongoose');
const mongooseService = require('../config/lib/mongoose');
const seed = require('../config/lib/mongo-seed');
const fs = require('fs');


mongooseService.connect((db) => {
  mongooseService.loadModels();

  fs.readFile('scripts/product.json', (err, data) => {
    const obj = JSON.parse(data);

    const Product = mongoose.model('Product');

    obj.forEach((item) => {

      const product = new Product(item);

      if (product.productType === 'kakaoTalk') {
        return;
      }

      switch (product.nation) {
        case 'bulgaria':
          product.nationCode = 'BG';
          break;
        case 'philippines':
          product.nationCode = 'PH';
          break;
        default:
          product.nationCode = 'US';
          break;
      }

      if (product.month === 1) {
        if (product.times === 2) {
          product.postponeCount = 2;
          product.lessonCount = 8;
        } else if (product.times === 3) {
          product.postponeCount = 2;
          product.lessonCount = 12;
        } else {
          product.postponeCount = 4;
          product.lessonCount = 20;
        }
      } else if (product.month === 3) {
        if (product.times === 2) {
          product.postponeCount = 6;
          product.lessonCount = 24;
        } else if (product.times === 3) {
          product.postponeCount = 6;
          product.lessonCount = 36;
        } else {
          product.postponeCount = 4;
          product.lessonCount = 60;
        }
      } else if (product.month === 6) {
        if (product.times === 2) {
          product.postponeCount = 12;
          product.lessonCount = 48;
        } else if (product.times === 3) {
          product.postponeCount = 12;
          product.lessonCount = 72;
        } else {
          product.postponeCount = 24;
          product.lessonCount = 120;
        }
      } else if (product.month === 12) {
        if (product.times === 2) {
          product.postponeCount = 24;
          product.lessonCount = 96;
        } else if (product.times === 3) {
          product.postponeCount = 24;
          product.lessonCount = 144;
        } else {
          product.postponeCount = 48;
          product.lessonCount = 240;
        }
      }

      product.providers = ['onestopedu'];
      product.subPrice = product.price;

      product.save((err, saveProduct) => {

        if (err) {
          console.log(err);
        } else {
          console.log(saveProduct);
        }
      });
    });
  });
});
