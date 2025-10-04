const ejs = require("ejs");
const path = require("path");
const transporter = require("../../common/transporter");
const pagination = require("../../common/pagination");
const ProductModel = require("../models/product");
const Danhmuc1Model = require("../models/danh-muc-1");
const Danhmuc2Model = require("../models/danh-muc-2");
const OrderModel = require("../models/order");
const mongoose = require('mongoose');
const TintucModel = require("../models/tintuc");
const DanhgiaModel = require("../models/danh-gia");
const HangModel = require("../models/hang");
const MenuchantrangModel = require("../models/menu-chan-trang");
const ChantrangModel = require("../models/tieu-de-chan-trang");
const BannerModel = require("../models/banner");
//tủ điện ok
const home = async (req, res) => {
  
    const danhmuc = await Danhmuc1Model.find()
    const product = []
    for(item of danhmuc){
          const products = await ProductModel.aggregate([
        { $match: { trangthai: true, danhmuc1_id: item._id } },
      { $sort: { thutuhienthi: 1, updatedAt: -1} },   // sắp xếp tăng dần theo thutuhienthi
      { $limit: 10 } 
    ]);
    const add ={
        product1 : item,
        product2 : products
    }
    product.push(add)
    }
    const banner = await BannerModel.find();

    res.render("site/index", {product, banner});
}


// chuyển đổi keyword sang không dấu
const removeVietnameseTones = (str) => {
    return str.normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d").replace(/Đ/g, "D");
};

const search = async (req, res) => {
    const keyword = req.query.s?.trim() || "";
    const keywordNoAccent = removeVietnameseTones(keyword.toLowerCase());
    const orderBy = req.query.orderby || "";
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const sortOptions = {
        "price": (a, b) => a.pricesale - b.pricesale,
        "price-desc": (a, b) => b.pricesale - a.pricesale,
        "date": (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
        "popularity": (a, b) => b._id.toString().localeCompare(a._id.toString()),
        "default": (a, b) => a._id.toString().localeCompare(b._id.toString())
    };

    const sortFunc = sortOptions[orderBy] || sortOptions["default"];

    const filter = { trangthai: true };

    // Lấy tất cả sản phẩm để lọc theo từ khóa không dấu
    const allProducts = await ProductModel.find(filter);

    // Lọc theo tên không dấu
    const matchedProducts = allProducts.filter(product => {
        const nameNoAccent = removeVietnameseTones(product.name.toLowerCase());
        return nameNoAccent.includes(keywordNoAccent);
    });

    // Sắp xếp ưu tiên bắt đầu bằng từ khóa
    matchedProducts.sort((a, b) => {
        const aStarts = removeVietnameseTones(a.name.toLowerCase()).startsWith(keywordNoAccent);
        const bStarts = removeVietnameseTones(b.name.toLowerCase()).startsWith(keywordNoAccent);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return 0;
    });

    // Áp dụng bộ lọc sắp xếp
    matchedProducts.sort(sortFunc);

    const totalRows = matchedProducts.length;
    const totalPages = Math.ceil(totalRows / limit);
    const products = matchedProducts.slice(skip, skip + limit);

    const seo = {
        title: totalRows > 0
            ? `Kết quả tìm kiếm cho "${keyword}"`
            : `Không tìm thấy sản phẩm phù hợp với "${keyword}"`,
        description: totalRows > 0
            ? `Tìm thấy ${totalRows} sản phẩm phù hợp với từ khóa "${keyword}".`
            : `Không có sản phẩm phù hợp với từ khóa "${keyword}".`,
        keywords: keyword,
        image: "rem-vai-phong-khach-1-2.jpg",
        pricesale: "350000",
        name: keyword,
        _id: "search",
        view: "9785"
    };

    res.render("site/search", {
        keyword,
        keyword2: orderBy,
        product: products,
        seo,
        page,
        totalPages,
        totalRows,
        next: page + 1,
        hasNext: page < totalPages,
        prev: page - 1,
        hasPrev: page > 1,
        pages: pagination(page, totalPages),
    });
};

//gợi ý tìm kiếm
const searchsuggest = async (req, res) => {
    const keyword = req.query.keyword?.trim() || "";
    if (!keyword) return res.json([]);

    const regex = new RegExp(keyword, 'i');
    const results = await ProductModel.find({
        name: regex,
        trangthai: true,
    }).limit(10).select("name");

    res.json(results);
};


const sanpham = async (req, res) => {
    const id = req.query.id;
    const keyword = req.query.orderby || "";
    const page = parseInt(req.query.page) || 1;
    const limit = 50;
    const skip = (page - 1) * limit;

    const a = await ProductModel.findOne({ trangthai: true });
    if (a) {
        a.image = a.images[0].name;
    }
    const seo = a;

    // Điều kiện lọc mặc định
    let filter = { trangthai: true };
    let sortOption = {};

    switch (keyword) {
        case "spmoi":
            filter.spmoi = true;
            sortOption = { updatedAt: -1 };
            break;
        case "price":
            sortOption = { pricesale: 1 };
            break;
        case "price-desc":
            sortOption = { pricesale: -1 };
            break;
        case "date":
            sortOption = { updatedAt: -1 };
            break;
        case "popularity":
        default:
            sortOption = { _id: 1 };
            break;
    }

    let product = [];
    let totalRows = 0;
    let totalPages = 0;

    if (id) {
        // 🔹 Lấy theo Hãng
        const hang = await HangModel.find({ _id: id });

        productArrays = await Promise.all(
            hang.map(async (h) => {
                const count = await ProductModel.find({ hang_id: h._id, trangthai: true });
                return product = count;
            })
        );
        product = productArrays.flat()

        totalRows = product.length;
        totalPages = 1; // vì trả về danh sách hãng thôi
    } else {
        // 🔹 Lấy tất cả sản phẩm
        totalRows = await ProductModel.countDocuments(filter);
        totalPages = Math.ceil(totalRows / limit);

        product = await ProductModel.find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(limit);
    }

    const next = page + 1;
    const hasNext = page < totalPages;
    const prev = page - 1;
    const hasPrev = page > 1;

    res.render("site/san-pham", {
        product,
        keyword,
        seo,
        page,
        totalRows,
        totalPages,
        next,
        hasNext,
        prev,
        hasPrev,
        pages: pagination(page, totalPages),
    });
};




const chitietsanpham = async (req, res) => {
    const id = req.params.id;

    // Kiểm tra ID có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.redirect('/404');
    }

    // Nếu hợp lệ, mới tiếp tục truy vấn
    const product = await ProductModel.findById(id)
        .populate('danhmuc1_id')
        .populate('danhmuc2_id');

    if (!product) {
        return res.redirect('/404');
    }

    const spmoi = await ProductModel.aggregate([
        {
            $match: {
                spmoi: true,
                trangthai: true,
                danhmuc2_id: { $in: product.danhmuc2_id }
            }
        },
        { $sample: { size: 10 } } // Lấy ngẫu nhiên 10 sản phẩm
    ]);

    const spcungloai = await ProductModel.aggregate([
        {
            $match: {
                spnoibat: true,
                trangthai: true,
                danhmuc2_id: { $in: product.danhmuc2_id }
            }
        },
        { $sample: { size: 10 } } // 🔹 Lấy ngẫu nhiên 10 sản phẩm
    ]);

    const seo = product;
    await ProductModel.updateOne({ _id: id }, { $inc: { view: 1 } });
    const tintuc = await TintucModel.aggregate([
        { $match: { trangthai: true } },
        { $sample: { size: 5 } }
    ]);

    const msg = req.query.msg;

    res.render("site/chi-tiet-san-pham", {
        product,
        spmoi,
        spcungloai,
        seo, tintuc, data: { msg }
    });
};





const danhmuc1 = async (req, res) => {
    const orderBy = req.query.orderby || "";
    const keyword = req.params.id || " ";
    const page = parseInt(req.query.page) || 1;
    const limit = 50;
    const skip = (page - 1) * limit;

    const products = await Danhmuc1Model.findOne({ slug: keyword });

    if (!products) return res.redirect('/404');

    const filter = { trangthai: true, danhmuc1_id: products._id };

    const sortOptions = {
        price: { pricesale: 1 },
        "price-desc": { pricesale: -1 },
        date: { updatedAt: -1 },
        popularity: { _id: 1 },
    };
    const sort = sortOptions[orderBy] || { _id: 1 };

    const [product, totalRows] = await Promise.all([
        ProductModel.find(filter).sort(sort).skip(skip).limit(limit),
        ProductModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalRows / limit);
    products.image = "rem-vai-phong-khach-1-2.jpg";
    products.pricesale = "350000";
    products.view = "3262";
    await Danhmuc1Model.updateOne({ _id: products._id }, { $inc: { view: 1 } });

    res.render("site/danh-muc-1", {
        product, orderBy,
        keyword,
        products,
        seo: products,
        page,
        totalRows,
        totalPages,
        next: page + 1,
        hasNext: page < totalPages,
        prev: page - 1,
        hasPrev: page > 1,
        pages: pagination(page, totalPages),
    });
};



const danhmuc2 = async (req, res) => {
    const orderBy = req.query.orderby || "";
    const keyword = req.params.id || "";
    const page = parseInt(req.query.page) || 1;
    const limit = 50;
    const skip = (page - 1) * limit;
    const id = req.query.id;

    const products = await Danhmuc2Model.findById(id).populate('danhmuc1_id');
    if (!products) return res.redirect('/404');
    const filter = { trangthai: true, danhmuc2_id: { $in: [products._id] } };

    const sortOptions = {
        price: { pricesale: 1 },
        "price-desc": { pricesale: -1 },
        date: { updatedAt: -1 },
        popularity: { _id: -1 },
    };
    const sort = sortOptions[orderBy] || { _id: 1 };

    const [product, totalRows] = await Promise.all([
        ProductModel.find(filter).sort(sort).skip(skip).limit(limit),
        ProductModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalRows / limit);

    products.image = "rem-vai-phong-khach-1-2.jpg";
    products.pricesale = "350000";
    products.view = "9833";
    await Danhmuc2Model.updateOne({ _id: products._id }, { $inc: { view: 1 } });

    res.render("site/danh-muc-2", {
        product, orderBy,
        keyword,
        products,
        seo: products,
        page,
        totalRows,
        totalPages,
        next: page + 1,
        hasNext: page < totalPages,
        prev: page - 1,
        hasPrev: page > 1,
        pages: pagination(page, totalPages),
    });
};



const cart = async (req, res) => {
    const cart = req.session.cart;
    let tongtien = 0
    for (var i = 0; i < cart.length; i++) {
        const tongtien1 = cart[i].price * cart[i].qty;
        tongtien = tongtien + tongtien1
    }
    const thongtintrang = res.locals.thongtintrang;
    const seo = {
        title: "Rèm Cửa Cao Cấp Anh Thư | Thiết Kế Đẹp, Giá Tốt",
        description: `Rèm cửa Anh Thư chuyên cung cấp các loại rèm vải cao cấp, rèm tự động, rèm sáo gỗ... Thi công chuyên nghiệp, bảo hành lâu dài. Gọi ngay: ${thongtintrang.sdt}`,
        keywords: "rèm cửa, rèm cửa cao cấp, rèm vải, rèm tự động, rèm cửa Anh Thư, rèm sáo gỗ",
        image: "rem-vai-phong-khach-1-2.jpg",
        pricesale: "350000",
        name: "Rèm Cửa Cao Cấp Anh Thư | Thiết Kế Đẹp, Giá Tốt",
        _id: "cart",
        view: "7322",
    };
    const product = await ProductModel.aggregate([
        {
            $match: {
                spcaocap: true,
                trangthai: true,
            }
        },
        { $sample: { size: 10 } } // 🔹 Lấy ngẫu nhiên 10 sản phẩm
    ]);
    const msg = req.query.msg || null;
    const id = req.query.id || null;
    const quantity = req.query.quantity || null;
    res.render("site/cart", { tongtien, seo, product, data: { msg }, id, quantity });
}


const addcart = async (req, res) => {
    const id = req.params.id;
    const qty = parseInt(req.body.quantity) || parseInt(req.query.quantity) || 1;

    const items = req.session.cart;
    let isProductExists = false;

    items.map((item) => {
        if (item.id === id) {
            item.qty += qty || 1;
            isProductExists = true;
        }
        return item;
    });
    if (!isProductExists) {
        const product = await ProductModel.findById(id);
        items.push({
            id,
            name: product.name,
            thumbnail: product.images[0].name,
            price: product.pricesale,
            qty: qty || 1
        });
    }
    const thongbao = await ProductModel.findById(id);
    res.redirect(`/san-pham/${id}?msg=${encodeURIComponent(thongbao.name)}`);
}
const addcart2 = async (req, res) => {
    const id = req.params.id;
    const qty = parseInt(req.body.quantity) || parseInt(req.query.quantity) || 1;

    const items = req.session.cart;
    let isProductExists = false;

    items.map((item) => {
        if (item.id === id) {
            item.qty += qty || 1;
            isProductExists = true;
        }
        return item;
    });
    if (!isProductExists) {
        const product = await ProductModel.findById(id);
        items.push({
            id,
            name: product.name,
            thumbnail: product.images[0].name,
            price: product.pricesale,
            qty: qty || 1
        });
    }
    res.redirect(`/gio-hang`);
}
const updatecart = async (req, res) => {
    const items = req.session.cart;
    const products = {
        ...req.body.product
    };
    const newItems = items.map((item) => {
        item.qty = parseInt(products[item.id]["qty"]);
        return item;
    });
    req.session.cart = newItems;
    res.redirect('/gio-hang');
}
const deletecart = async (req, res) => {
    const { id } = req.params;
    let items = req.session.cart;
    const newItems = items.filter((item) => item.id != id);
    req.session.cart = newItems;
    const thongbao = await ProductModel.findById(id);
    const quantity = req.query.quantity;

    res.redirect(`/gio-hang?msg=${encodeURIComponent(thongbao.name)}&id=${id}&quantity=${quantity}`); // Express sẽ tự lấy từ `Referer`
}

const thanhtoan = async (req, res) => {
    const cart = req.session.cart;
    let tongtien = 0
    for (var i = 0; i < cart.length; i++) {
        const tongtien1 = cart[i].price * cart[i].qty;
        tongtien = tongtien + tongtien1
    }
    const thongtintrang = res.locals.thongtintrang;
    const seo = {
        title: "Rèm Cửa Cao Cấp Anh Thư | Thiết Kế Đẹp, Giá Tốt",
        description: `Rèm cửa Anh Thư chuyên cung cấp các loại rèm vải cao cấp, rèm tự động, rèm sáo gỗ... Thi công chuyên nghiệp, bảo hành lâu dài. Gọi ngay: ${thongtintrang.sdt}`,
        keywords: "rèm cửa, rèm cửa cao cấp, rèm vải, rèm tự động, rèm cửa Anh Thư, rèm sáo gỗ",
        image: "rem-vai-phong-khach-1-2.jpg",
        pricesale: "350000",
        name: "Rèm Cửa Cao Cấp Anh Thư | Thiết Kế Đẹp, Giá Tốt",
        _id: "thanhtoan1",
        view: "4837"
    };
    
    res.render("site/thanh-toan-1", { tongtien, seo });
}


const thanhtoan2 = async (req, res) => {
    const { body, session, protocol } = req;
    const cart = session.cart || [];

    // Nếu giỏ hàng trống, chuyển về trang chủ hoặc báo lỗi
    if (cart.length === 0) {
        return res.redirect("/gio-hang"); // hoặc res.render("site/cart-empty")
    }

    // Tính tổng tiền
    const tongtien = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    // Tạo mã đơn và ngày hiện tại
    const madon = Math.floor(100000 + Math.random() * 900000);
    const now = new Date();
    const formattedDate = now.toLocaleDateString('vi-VN'); // ex: 03/07/2025

    // Chuẩn hóa dữ liệu đơn hàng
    const orderData = {
        name: `${body.billing_last_name || ""} ${body.billing_first_name || ""} `.trim(),
        cty: body.billing_company || "",
        add1: body.billing_address_1 || "",
        add2: body.billing_city || "",
        phone: body.billing_phone || "",
        mail: body.billing_email || "",
        note: body.order_comments || "",
        thanhtoan: body.payment_method || "Chưa chọn",
        madon,
        date: formattedDate,
        item: cart,
        trangthai : false,
    };

    // Lưu đơn hàng vào MongoDB
    await new OrderModel(orderData).save();

    // Gửi email xác nhận
    const origin = `${protocol}://${req.get("host")}`;
    const thongtintrang = res.locals.thongtintrang;

    const html = await ejs.renderFile(
        path.join(req.app.get("views"), "site/email-order.ejs"),
        { order2: orderData, tongtien, origin, thongtintrang, }
    );

    await transporter.sendMail({
        from: '"Rèm Cửa Anh Thư" <kinhdoanh.deevisco@gmail.com>',
        to: orderData.mail,
        subject: `Xác nhận mã đơn hàng ${madon} từ Rèm Cửa Anh Thư`,
        html
    });

    // Reset giỏ hàng
    session.cart = [];

    res.render("site/thanh-toan-2", {
        tongtien,
        order: orderData,
    });
};




const gioithieu = async (req, res) => {
    const thongtintrang = res.locals.thongtintrang;
    const seo = {
        title: "Rèm Cửa Cao Cấp Anh Thư | Thiết Kế Đẹp, Giá Tốt",
        description: `Rèm cửa Anh Thư chuyên cung cấp các loại rèm vải cao cấp, rèm tự động, rèm sáo gỗ... Thi công chuyên nghiệp, bảo hành lâu dài. Gọi ngay: ${thongtintrang.sdt}`,
        keywords: "rèm cửa, rèm cửa cao cấp, rèm vải, rèm tự động, rèm cửa Anh Thư, rèm sáo gỗ",
        image: "rem-vai-phong-khach-1-2.jpg",
        pricesale: "350000",
        name: "Rèm Cửa Cao Cấp Anh Thư | Thiết Kế Đẹp, Giá Tốt",
        _id: "gioithieu",
        view: "7392"
    };
    res.render("site/gioi-thieu", { seo });
}

const tintuc = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;
    const [product, totalRows] = await Promise.all([
        TintucModel.find({ trangthai: true }).sort({ _id: 1 }).skip(skip).limit(limit),
        TintucModel.countDocuments(),
    ]);
    const totalPages = Math.ceil(totalRows / limit);

    const thongtintrang = res.locals.thongtintrang;
    const seo = {
        title: "Rèm Cửa Cao Cấp Anh Thư | Thiết Kế Đẹp, Giá Tốt",
        description: `Rèm cửa Anh Thư chuyên cung cấp các loại rèm vải cao cấp, rèm tự động, rèm sáo gỗ... Thi công chuyên nghiệp, bảo hành lâu dài. Gọi ngay: ${thongtintrang.sdt}`,
        keywords: "rèm cửa, rèm cửa cao cấp, rèm vải, rèm tự động, rèm cửa Anh Thư, rèm sáo gỗ",
        image: "rem-vai-phong-khach-1-2.jpg",
        pricesale: "350000",
        name: "Rèm Cửa Cao Cấp Anh Thư | Thiết Kế Đẹp, Giá Tốt",
        _id: "tintuc",
        view: "24954"
    };
    res.render("site/tin-tuc", {
        product, seo,
        page,
        totalRows,
        totalPages,
        next: page + 1,
        hasNext: page < totalPages,
        prev: page - 1,
        hasPrev: page > 1,
        pages: pagination(page, totalPages),
    });

}

const chitiettintuc = async (req, res) => {
    const id = req.params.id;
    // Kiểm tra ID có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.redirect('/404');
    }

    // Nếu hợp lệ, mới tiếp tục truy vấn
const product = await TintucModel.findOne({ _id: id, trangthai: true }).lean();

    if (!product) {
        return res.redirect('/404');
    }

    const tag = await Danhmuc2Model.find({
        danhmuc1_id: "685d22173481148a60ca6ba6"
    }).populate('danhmuc1_id');

    const spmoi = await ProductModel.find({
        spmoi: true,
        trangthai: true,
        danhmuc1_id: "685d22173481148a60ca6ba6"
    }).sort({ _id: -1 });
    product.pricesale = "350000";
    const seo = product;
    await TintucModel.updateOne({ _id: product._id }, { $inc: { view: 1 } });

    res.render("site/chi-tiet-tin-tuc", {
        product,
        tag,
        spmoi,
        seo,
    });
}



const chinhsach = async (req, res) => {
    const thongtintrang = res.locals.thongtintrang;
    const seo = {
        title: "Chính Sách Hoàn Trả & Hoàn Tiền – Rèm Anh Thư",
        description: `Rèm cửa Anh Thư chuyên cung cấp các loại rèm vải cao cấp, rèm tự động, rèm sáo gỗ... Thi công chuyên nghiệp, bảo hành lâu dài. Gọi ngay: ${thongtintrang.sdt}`,
        keywords: "rèm cửa, rèm cửa cao cấp, rèm vải, rèm tự động, rèm cửa Anh Thư, rèm sáo gỗ",
        image: "rem-vai-phong-khach-1-2.jpg",
        pricesale: "350000",
        name: "Rèm Cửa Cao Cấp Anh Thư | Thiết Kế Đẹp, Giá Tốt",
        _id: "chinh-sach",
        view: "6373"
    };
    res.render("site/chinh-sach", { seo });
}
const baohanh = async (req, res) => {
    const thongtintrang = res.locals.thongtintrang;
    const seo = {
        title: "Chính Sách Bảo Hành – Rèm Anh Thư",
        description: `Rèm cửa Anh Thư chuyên cung cấp các loại rèm vải cao cấp, rèm tự động, rèm sáo gỗ... Thi công chuyên nghiệp, bảo hành lâu dài. Gọi ngay: ${thongtintrang.sdt}`,
        keywords: "rèm cửa, rèm cửa cao cấp, rèm vải, rèm tự động, rèm cửa Anh Thư, rèm sáo gỗ",
        image: "rem-vai-phong-khach-1-2.jpg",
        pricesale: "350000",
        name: "Rèm Cửa Cao Cấp Anh Thư | Thiết Kế Đẹp, Giá Tốt",
        _id: "bao-hanh",
        view: "7323"
    };
    res.render("site/bao-hanh", { seo });
}
const vanchuyen = async (req, res) => {
    const thongtintrang = res.locals.thongtintrang;
    const seo = {
        title: "Chính Sách Vận Chuyển – Giao Hàng | Rèm Anh Thư",
        description: `Rèm cửa Anh Thư chuyên cung cấp các loại rèm vải cao cấp, rèm tự động, rèm sáo gỗ... Thi công chuyên nghiệp, bảo hành lâu dài. Gọi ngay: ${thongtintrang.sdt}`,
        keywords: "rèm cửa, rèm cửa cao cấp, rèm vải, rèm tự động, rèm cửa Anh Thư, rèm sáo gỗ",
        image: "rem-vai-phong-khach-1-2.jpg",
        pricesale: "350000",
        name: "Rèm Cửa Cao Cấp Anh Thư | Thiết Kế Đẹp, Giá Tốt",
        _id: "van-chuyen",
        view: "8834"
    };
    res.render("site/van-chuyen", { seo });
}
const hinhthucthanhtoan = async (req, res) => {
    const thongtintrang = res.locals.thongtintrang;
    const seo = {
        title: "Chính Sách & Hình Thức Thanh Toán – Rèm Anh Thư",
        description: `Rèm cửa Anh Thư chuyên cung cấp các loại rèm vải cao cấp, rèm tự động, rèm sáo gỗ... Thi công chuyên nghiệp, bảo hành lâu dài. Gọi ngay: ${thongtintrang.sdt}`,
        keywords: "rèm cửa, rèm cửa cao cấp, rèm vải, rèm tự động, rèm cửa Anh Thư, rèm sáo gỗ",
        image: "rem-vai-phong-khach-1-2.jpg",
        pricesale: "350000",
        name: "Rèm Cửa Cao Cấp Anh Thư | Thiết Kế Đẹp, Giá Tốt",
        _id: "thanh-toan",
        view: "7324"
    };
    res.render("site/thanh-toan", { seo });
}
const footer = async (req, res) => {
    const id = req.query.id; 
    const product = await MenuchantrangModel.findById(id);
   
    res.render("site/footer-chan-trang", { product});
}

const thuonghieu = async (req, res) => {
    const hang = await HangModel.find();
    const products = await Promise.all(
        hang.map(async (h) => {
            const count = await ProductModel.countDocuments({ hang_id: h._id });
            return {
                name: h.name,
                id: h.id,
                images: h.images,
                total: count
            };
        })
    );

    res.render("site/thuong-hieu", { products }); // Express sẽ tự lấy từ `Referer`
}

module.exports = {
    home, search, searchsuggest, sanpham, danhmuc1, danhmuc2, cart, thanhtoan, thanhtoan2, chitietsanpham,
    addcart, addcart2, updatecart, deletecart, gioithieu, tintuc, chitiettintuc,
    chinhsach, baohanh, vanchuyen, hinhthucthanhtoan, footer, thuonghieu
}


