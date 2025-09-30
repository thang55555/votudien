const Danhmuc1Model = require("../models/danh-muc-1");
const Danhmuc2Model = require("../models/danh-muc-2");
const MenuchantrangModel = require("../models/menu-chan-trang");
const ProductModel = require("../models/product");
const Thong_tin_trangModel = require("../models/thong_tin_trang");
const ChantrangModel = require("../models/tieu-de-chan-trang");
const TintucModel = require("../models/tintuc");


module.exports = async (req, res, next) => {

  const menu1 = await Danhmuc1Model.find().sort({_id: 1});
  const menu = await Promise.all(
    menu1.map(async (item) => {
      const menu2 = await Danhmuc2Model.find({ danhmuc1_id: item._id });
      return {
        menua: item.name,
        slug: item.slug,
        menub: menu2
      };
    })
  );
  res.locals.menu = menu;


  //lấy url hiện tại
  if (req.method === 'GET' && !req.originalUrl.match(/\.(js|css|png|jpg|svg|ico|woff2?)$/) && !req.originalUrl.includes('wc-ajax')) {
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    res.locals.fullUrl = fullUrl;
  }


  res.locals.email = req.session.email;
  const cart = req.session.cart
  res.locals.cart = cart;
  
  res.locals.totalCartItem = req.session.cart.reduce((total, item) => total + item.qty, 0);

  //siderbar
  const spnoibat = await ProductModel.aggregate([
    { $match: { spnoibat: true, trangthai: true } },
    { $sample: { size: 20 } } // 8 sản phẩm ngẫu nhiên, chỉnh số theo nhu cầu
  ]);
  res.locals.spnoibat = spnoibat;

const [tintuc1, tintuc2] = await Promise.all([
    TintucModel.find({ trangthai: true }).sort({ _id: -1 }),
    TintucModel.find({ trangthai: true }).sort({ _id: 1 })
]);

res.locals.tintuc1 = tintuc1;
res.locals.tintuc2 = tintuc2;


  const thongtintrang = await Thong_tin_trangModel.findOne();
  res.locals.thongtintrang = thongtintrang;
  // lấy http://abc.com
  res.locals.origin = req.protocol + '://' + req.get('host')



  const footer1 = await ChantrangModel.find().sort({updatedAt: -1});
  const footer = await Promise.all(
    footer1.map(async (item) => {
      const footer2 = await MenuchantrangModel.find({ chantrang_id: item._id });
      return {
        footera: item.name,
        footerb: footer2
      };
    })
  );
  res.locals.footer =footer;

  next();
}
