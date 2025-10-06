
const pagination = require("../../common/pagination");
const slug = require("slug");
const fs = require("fs");
const path = require("path");
const Gioi_thieu_trangModel = require("../models/gioi_thieu_trang");
const Thong_tin_trangModel = require("../models/thong_tin_trang");
const Menu_danhmuc_sanphamModel = require("../models/menu_danhmuc_sanpham");
const Menu_nhom_sanphamModel = require("../models/menu_nhom_sanpham");
const ChiaseModel = require("../models/chiase");

const Danhmuc1Model = require("../models/danh-muc-1");
const Danhmuc2Model = require("../models/danh-muc-2");
const ProductModel = require("../models/product");
const TintucModel = require("../models/tintuc");
const HangModel = require("../models/hang");
const ChantrangModel = require("../models/tieu-de-chan-trang");
const MenuchantrangModel = require("../models/menu-chan-trang");
const OrderModel = require("../models/order");
const ImagesModel = require("../models/images");
const BannerModel = require("../models/banner");


// nam thành phát


const upload = (req, res) => {
    // fs.renameSync(files.upload.path, path.resolve("src/public/images", files.upload.originalFilename));
    // const newPath = path.resolve("src/public/images", files.upload.originalFilename);
    // let funcNum = req.query.CKEditorFuncNum;                 
    // let msg = 'Upload successfully';
    // res.status(201).send("<script>window.parent.CKEDITOR.tools.callFunction('"+funcNum+"','"+newPath+"','"+msg+"');</script>");


    try {
        fs.readFile(req.files.upload.path, function (err, data) {
            var newPath = path.resolve("public/images", req.files.upload.originalFilename);
            fs.writeFile(newPath, data, function (err) {
                if (err) console.log({ err: err });
                else {
                    console.log(req.files.upload.originalFilename);
                    //     imgl = '/images/req.files.upload.originalFilename';
                    //     let img = "<script>window.parent.CKEDITOR.tools.callFunction('','"+imgl+"','ok');</script>";
                    //    res.status(201).send(img);

                    let fileName = req.files.upload.name;
                    let url = '/images/' + fileName;
                    let msg = 'Upload successfully';
                    let funcNum = req.query.CKEditorFuncNum;
                    const add = {
                        images: fileName,
                        note: "01"
                    }
                    new ImagesModel(add).save();


                    res.status(201).send("<script>window.parent.CKEDITOR.tools.callFunction('" + funcNum + "','" + url + "','" + msg + "');</script>");
                }
            });
        });
    } catch (error) {
        console.log(error.message);
    }

}



const gioithieutrang = async (req, res) => {
    const gioithieu = await Gioi_thieu_trangModel.find();
    res.render("./admin/thong-tin-trang/gioi-thieu-trang", { gioithieu })
}
const editgioithieutrang = async (req, res) => {
    const id = req.params.id;
    const gioithieu = await Gioi_thieu_trangModel.findById(id);
    res.render("./admin/thong-tin-trang/edit-gioi-thieu-trang", { gioithieu })
}
const updategioithieu = async (req, res) => {
    const id = req.params.id;
    const { files, body } = req;
    const update = {
        linkvideo: body.linkvideo,
        gioithieuchung: body.gioithieuchung,
        content_tamnhin: body.content_tamnhin,
        content_sumenh: body.content_sumenh,
        content_cotloi: body.content_cotloi,
        content_kythuat: body.content_kythuat,
    }
    if (files) {
        update["img_tamnhin"] = files[0].originalname,
            update["img_cotloi"] = files[1].originalname,
            update["img_kythuat"] = files[2].originalname
        for (item of files) {
            fs.renameSync(item.path, path.resolve("src/public/site/images/update", item.originalname));
        }
    }

    await Gioi_thieu_trangModel.updateOne({ _id: id }, { $set: update });
    res.redirect("/admin/gioi-thieu-trang")

}



const thongtintrang = async (req, res) => {
    const thongtintrang = await Thong_tin_trangModel.find();
    res.render("./admin/thong-tin-trang/thong-tin-trang", { thongtintrang })
}
const editthongtintrang = async (req, res) => {
    const id = req.params.id;
    const thongtin = await Thong_tin_trangModel.findById(id);
    res.render("./admin/thong-tin-trang/edit-thong-tin-trang", { thongtin })
}
const updatethongtintrang = async (req, res) => {
    const id = req.params.id;
    const { file, body } = req;
    const update = {
        sdt: body.sdt,
        email: body.email,
        tencongty: body.tencongty,
        diachicty: body.diachicty,
        diachikho: body.diachikho,
        title: body.title,
        description: body.description,
        keywords: body.keywords,
        linkFB: body.linkFB,
        gioithieu: body.gioithieu,
    }
    if (file) {
        fs.renameSync(file.path, path.resolve("src/public/site/images/update", file.originalname));
        update["images"] = file.originalname;
    }
    await Thong_tin_trangModel.updateOne({ _id: id }, { $set: update });
    res.redirect("/admin/thong-tin-trang")
}




const banner = async (req, res) => {
    const products = await BannerModel.find();
    const stt = 1;
    res.render("./admin/banner/banner", { products, stt })
}
const addbanner = async (req, res) => {
    res.render("./admin/banner/add-banner",)
}
const uploadbanner = async (req, res) => {
    const { file, body } = req;
    const add = {
        stt: body.stt || 0,
    }
    if (file) {
        const uploadDir = path.resolve("src/public/site/images/update");
        // tạo thư mục đích nếu chưa có
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const targetPath = path.join(uploadDir, file.originalname);
        fs.renameSync(file.path, targetPath);

        add.images = file.originalname;
        const add2 = {
            images: file.originalname,
            note: "02"
        }
        new ImagesModel(add2).save();
    }

    new BannerModel(add).save();
    res.redirect("/admin/banner")
}

const updatebanner = async (req, res) => {
      const id = req.params.id;
    const update = {
        stt : req.query.stt
    }
    await BannerModel.updateOne({ _id: id }, { $set: update });
    res.redirect("/admin/banner")
}
const deletebanner = async (req, res) => {
     const id = req.params.id;
    await BannerModel.deleteOne({ _id: id });
    res.redirect("/admin/banner")
}



const nhomsanpham = async (req, res) => {
    const nhomsanpham = await Menu_nhom_sanphamModel
        .find()
        .populate({ path: "danhmuc_id" })
        .sort({ _id: -1 });
    const stt = 1;
    res.render("./admin/nhom-san-pham/danh-sach-nhom-san-pham", { nhomsanpham, stt })
}
const addnhomsanpham = async (req, res) => {
    const danhmuc = await Menu_danhmuc_sanphamModel.find()
    res.render("./admin/nhom-san-pham/add-nhom-san-pham", { data: {}, danhmuc })
}
const addnhomsp = async (req, res) => {
    const danhmuc = await Menu_danhmuc_sanphamModel.find()
    const { body } = req;
    const sosanh = await Menu_nhom_sanphamModel.find({ tennhomsanpham: body.tennhomsanpham });
    if (sosanh.length < 1) {
        const add = {
            danhmuc_id: body.danhmuc_id,
            tennhomsanpham: body.tennhomsanpham,
            slug: slug(body.tennhomsanpham),
            quytrinh: body.quytrinh
        }
        new Menu_nhom_sanphamModel(add).save();
        res.redirect("/admin/nhom-san-pham");
    }
    else {
        res.render("./admin/nhom-san-pham/add-nhom-san-pham", { data: { error: "Nhóm sản phẩm đã tồn tại" }, danhmuc })
    }

}
const editnhomsanpham = async (req, res) => {
    const id = req.params.id;
    const editnhom = await Menu_nhom_sanphamModel.findById(id);
    const danhmuc = await Menu_danhmuc_sanphamModel.find();
    res.render("./admin/nhom-san-pham/edit-nhom-san-pham", { editnhom, danhmuc })
}














const chiasekhachhang = async (req, res) => {
    const product = await ChiaseModel.find().sort({ _id: -1 });
    const stt = 1;
    res.render("./admin/chia-se-khach-hang/danh-sach-chia-se-KH", { product, stt })
}
const addchiasekhachhang = async (req, res) => {
    res.render("./admin/chia-se-khach-hang/add-chia-se-kh")
}
const uploadchiasekhachhang = async (req, res) => {
    const { file, body } = req;
    const product = {
        name: body.name,
        content: body.content
    }
    if (file) {
        fs.renameSync(file.path, path.resolve("src/public/site/images/update", file.originalname));
        product["images"] = file.originalname;
    }
    new ChiaseModel(product).save();
    res.redirect("/admin/chia-se-khach-hang");
}
const editchiasekhachhang = async (req, res) => {
    const id = req.params.id;
    const product = await ChiaseModel.findById(id);
    res.render("./admin/chia-se-khach-hang/edit-chia-se-KH", { product })
}
const updatechiasekhachhang = async (req, res) => {
    const id = req.params.id;
    const { file, body } = req;
    const product = {
        name: body.name,
        content: body.content
    }
    if (file) {
        fs.renameSync(file.path, path.resolve("src/public/site/images/update", file.originalname));
        product["images"] = file.originalname;
    }
    await ChiaseModel.updateOne({ _id: id }, { $set: product });
    res.redirect("/admin/chia-se-khach-hang");
}
const deletechiasekhachhang = async (req, res) => {
    const id = req.params.id;
    await ChiaseModel.deleteOne({ _id: id });
    res.redirect("/admin/chia-se-khach-hang")
}





// tủ điện

const hang = async (req, res) => {
    // const product = await HangModel.find({}).sort({ _id: -1 });
    // const stt = 1
    // res.render("./admin/hang/hang", { product, stt })

    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        // Đếm tổng số sản phẩm
        const totalRows = await HangModel.countDocuments();

        // Tính tổng số trang
        const totalPages = Math.ceil(totalRows / limit);

        // Lấy danh sách sản phẩm có phân trang
        const products = await HangModel.find()
            .sort({ _id: -1 })
            .skip(skip)
            .limit(limit);

        // Phân trang
        const paginationData = {
            page,
            totalPages,
            hasNext: page < totalPages,
            next: page + 1,
            hasPrev: page > 1,
            prev: page - 1,
            pages: pagination(page, totalPages)
        };

        res.render("./admin/hang/hang", {
            products,
            stt: 1,
            data: " ",
            ...paginationData
        });
    } catch (err) {
        console.error("Lỗi khi hiển thị danh sách hãng:", err);
        res.status(500).send("Đã xảy ra lỗi khi tải danh sách hãng.");
    }

}
const addhang = async (req, res) => {
    res.render("./admin/hang/add-hang", { data: {} })
}
const uploadhang = async (req, res) => {
    const { file, body } = req;
    const sosanh = await HangModel.find({ name: body.name });
    if (sosanh.length < 1) {
        const add = {
            name: body.name,
            slug: slug(body.name),
            title: body.title,
            description: body.description,
            keywords: body.keywords,
        }
        if (file) {
            const uploadDir = path.resolve("src/public/site/images/update");
            // tạo thư mục đích nếu chưa có
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const targetPath = path.join(uploadDir, file.originalname);
            fs.renameSync(file.path, targetPath);

            add.images = file.originalname;
            const add2 = {
                images: file.originalname,
                note: "02"
            }
            new ImagesModel(add2).save();
        }

        new HangModel(add).save();
        res.redirect("/admin/hang")
    }
    else {
        res.render("./admin/hang/add-hang", {
            data: {
                error: "Hãng đã tồn tại",
                old: body   // giữ lại dữ liệu khách nhập
            }
        })
    }

}
const edithang = async (req, res) => {
    const id = req.params.id;
    const product = await HangModel.findById(id);
    const page = req.query.page;

    res.render("./admin/hang/edit-hang", { product, data: {}, page })
}
const updatehang = async (req, res) => {
    const id = req.params.id;
    const { file, body } = req;
    const add = {
        name: body.name,
        slug: slug(body.name),
        title: body.title,
        description: body.description,
        keywords: body.keywords
    }
    if (file) {
        const uploadDir = path.resolve("src/public/site/images/update");
        // tạo thư mục đích nếu chưa có
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const targetPath = path.join(uploadDir, file.originalname);
        fs.renameSync(file.path, targetPath);

        add.images = file.originalname;
        add.images = file.originalname;
        const add2 = {
            images: file.originalname,
            note: "02"
        }
        new ImagesModel(add2).save();
    }
    await HangModel.updateOne({ _id: id }, { $set: add });
    const page = body.page;
    res.redirect(`/admin/hang?page=${page}`)

}
const deletehang = async (req, res) => {
    try {
        const id = req.params.id;
        await HangModel.deleteOne({ _id: id });

        res.redirect("/admin/hang");
    } catch (error) {
        console.error("Lỗi khi xóa hãng:", error);
        res.status(500).send("Đã xảy ra lỗi khi xóa hãng.");
    }
};



const danhmuc1 = async (req, res) => {
    const product = await Danhmuc1Model.find({});
    const stt = 1
    res.render("./admin/danh-muc-1/danh-muc-1", { product, stt })
}
const adddanhmuc1 = async (req, res) => {
    res.render("./admin/danh-muc-1/add-danh-muc-1", { data: {} })
}
const uploaddanhmuc1 = async (req, res) => {
    let body = req.body;
    const sosanh = await Danhmuc1Model.find({ name: body.name });
    if (sosanh.length < 1) {
        const add = {
            name: body.name,
            slug: slug(body.name),

            title: body.title,
            description: body.description,
            keywords: body.keywords
        }
        new Danhmuc1Model(add).save();
        res.redirect("/admin/danh-muc")
    }
    else {
        res.render("./admin/danh-muc-1/add-danh-muc-1", { data: { error: "Danh mục đã tồn tại" } })
    }

}
const editdanhmuc1 = async (req, res) => {
    const id = req.params.id;
    const product = await Danhmuc1Model.findById(id);
    res.render("./admin/danh-muc-1/edit-danh-muc-1", { product, data: {} })
}
const updatedanhmuc1 = async (req, res) => {
    const id = req.params.id;
    const body = req.body;

    const add = {
        name: body.name,
        slug: slug(body.name),
        title: body.title,
        description: body.description,
        keywords: body.keywords
    }
    await Danhmuc1Model.updateOne({ _id: id }, { $set: add });
    res.redirect("/admin/danh-muc")

}
const deletedanhmuc1 = async (req, res) => {
    try {
        const id = req.params.id;

        // Kiểm tra danh mục 1 có tồn tại không
        const danhmuc1 = await Danhmuc1Model.findById(id);
        if (!danhmuc1) {
            return res.status(404).send("Danh mục cấp 1 không tồn tại");
        }

        // Tìm tất cả danh mục 2 thuộc danh mục 1 này
        const danhmuc2List = await Danhmuc2Model.find({ danhmuc1_id: id });

        // Lấy tất cả _id của danh mục 2 để xóa sản phẩm
        const danhmuc2Ids = danhmuc2List.map(dm => dm._id);

        // Xóa tất cả sản phẩm thuộc các danh mục 2 này
        await ProductModel.deleteMany({ danhmuc2_id: { $in: danhmuc2Ids } });

        // Xóa các danh mục 2
        await Danhmuc2Model.deleteMany({ danhmuc1_id: id });

        // Xóa danh mục 1
        await Danhmuc1Model.deleteOne({ _id: id });

        res.redirect("/admin/danh-muc");
    } catch (error) {
        console.error("Lỗi khi xóa danh mục 1:", error);
        res.status(500).send("Đã xảy ra lỗi khi xóa danh mục.");
    }
};



const danhmuc2 = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = page * limit - limit;
    const totalRows = await Danhmuc2Model.find().countDocuments();
    const totalPages = Math.ceil(totalRows / limit)
    const product = await Danhmuc2Model
        .find({})
        .populate('danhmuc1_id')
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit);

    const next = page + 1;
    const hasNext = page < totalPages ? true : false;
    const prev = page - 1;
    const hasPrev = page > 1 ? true : false;
    const stt = 1;
    res.render("./admin/menu-danh-muc-2/danh-sach-menu-danh-muc", {
        product, stt,
        page,
        totalPages,
        next,
        hasNext,
        prev,
        hasPrev,
        pages: pagination(page, totalPages)
    })
}
const adddanhmuc2 = async (req, res) => {
    const product = await Danhmuc1Model.find({});
    res.render("./admin/menu-danh-muc-2/add-menu-danh-muc", { product })
}
const uploaddanhmuc2 = async (req, res) => {
    let body = req.body;
    const add = {
        name: body.name,
        slug: slug(body.name),
        danhmuc1_id: body.danhmuc_id,
        title: body.title,
        description: body.description,
        keywords: body.keywords
    }
    new Danhmuc2Model(add).save();
    res.redirect("/admin/danh-muc-2")


}
const editdanhmuc2 = async (req, res) => {
    const id = req.params.id;
    const product = await Danhmuc2Model.findById(id);
    const danhmuc = await Danhmuc1Model.find();

    res.render("./admin/menu-danh-muc-2/edit-menu-danh-muc", { product, danhmuc })
}
const updatedanhmuc2 = async (req, res) => {
    const id = req.params.id;
    let body = req.body;
    const add = {
        name: body.name,
        slug: slug(body.name),
        danhmuc1_id: body.danhmuc_id,
        title: body.title,
        description: body.description,
        keywords: body.keywords
    }
    await Danhmuc2Model.updateOne({ _id: id }, { $set: add });
    res.redirect("/admin/danh-muc-2")

}
const deletedanhmuc2 = async (req, res) => {
    try {
        const id = req.params.id;

        // Kiểm tra xem danh mục 2 có tồn tại không
        const danhmuc2 = await Danhmuc2Model.findById(id);
        if (!danhmuc2) {
            return res.status(404).send("Danh mục cấp 2 không tồn tại");
        }

        // Xóa tất cả sản phẩm thuộc danh mục 2 này
        await ProductModel.deleteMany({ danhmuc2_id: id });

        // Xóa danh mục 2
        await Danhmuc2Model.deleteOne({ _id: id });

        res.redirect("/admin/danh-muc-2");
    } catch (error) {
        console.error("Lỗi khi xóa danh mục 2:", error);
        res.status(500).send("Đã xảy ra lỗi khi xóa danh mục.");
    }
};





const sanpham = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        // Đếm tổng số sản phẩm
        const totalRows = await ProductModel.countDocuments();

        // Tính tổng số trang
        const totalPages = Math.ceil(totalRows / limit);

        // Lấy danh sách sản phẩm có phân trang
        const products = await ProductModel.find()
            .sort({ _id: -1 })
            .populate('danhmuc2_id')
            .populate('danhmuc1_id')
            .skip(skip)
            .limit(limit);

        // Phân trang
        const paginationData = {
            page,
            totalPages,
            hasNext: page < totalPages,
            next: page + 1,
            hasPrev: page > 1,
            prev: page - 1,
            pages: pagination(page, totalPages)
        };

        res.render("./admin/products/product", {
            products,
            stt: 1,
            data: " ",
            ...paginationData
        });
    } catch (err) {
        console.error("Lỗi khi hiển thị sản phẩm:", err);
        res.status(500).send("Đã xảy ra lỗi khi tải danh sách sản phẩm.");
    }
};

const addsanpham = async (req, res) => {
    const product = await Danhmuc2Model.find({});
    const hang = await HangModel.find({});
    res.render("./admin/products/add_product", { product, hang })
}
const uploadsanpham = async (req, res) => {
    const { files, body } = req;
    // Lấy tất cả danh mục 2
    const danhmuc2List = await Danhmuc2Model.find({ _id: { $in: body.danhmuc2_id } })
        .select("danhmuc1_id");
    // Lấy mảng id danh mục 1
    const danhmuc1Ids = danhmuc2List
        .filter(item => item.danhmuc1_id) // tránh lỗi undefined
        .map(item => item.danhmuc1_id.toString());

    // Loại bỏ trùng
    const uniqueDanhmuc1Ids = [...new Set(danhmuc1Ids)];
    // gắn hang_id rỗng
    const defaultHangId = "68d7add80f2de0ba7828aeda";

    const add = {
        name: body.name,
        masanpham: body.masanpham,
        thutuhienthi: body.thutuhienthi,
        slug: slug(body.name),
        price: body.price,
        pricesale: body.pricesale,
        danhmuc2_id: body.danhmuc2_id,
        danhmuc1_id: uniqueDanhmuc1Ids,
        hang_id: body.hang_id ? body.hang_id : defaultHangId,
        trangthai: body.trangthai == "on",
        spmoi: body.spmoi == "on",
        spnoibat: body.spnoibat == "on",
        spcaocap: body.spcaocap == "on",
        content: body.content,
        content2: body.content2,
        title: body.title,
        description: body.description,
        keywords: body.keywords,
        view: "0"

    }
    if (files) {
        const uploadimg = [];
        for (item of files) {
            uploadimg.push(item.originalname);
            fs.renameSync(item.path, path.resolve("src/public/site/images/update", item.originalname));
            const add2 = {
                images: item.originalname,
                note: "02"
            }
            new ImagesModel(add2).save();
        }

        const image = [];
        for (var i = 0; i < files.length; i++) {
            img = {
                stt: i,
                name: uploadimg[i],
            }
            image.push(img)
        }
        add["images"] = image;

    }

    new ProductModel(add).save();
    res.redirect("/admin/san-pham")
}

const editsanpham = async (req, res) => {
    const id = req.params.id;
    const page = req.query.page;
    const product = await ProductModel.findById(id);
    const danhmuc = await Danhmuc2Model.find();
    const hang = await HangModel.find();
    product.danhmuc2_id = product.danhmuc2_id.map(id => id.toString());
    res.render("./admin/products/edit_product", { product, danhmuc, page, hang })
}
const updatesanpham = async (req, res) => {
    const id = req.params.id;
    const { files, body } = req;
    // Lấy tất cả danh mục 2
    const danhmuc2List = await Danhmuc2Model.find({ _id: { $in: body.danhmuc2_id } })
        .select("danhmuc1_id");
    // Lấy mảng id danh mục 1
    const danhmuc1Ids = danhmuc2List
        .filter(item => item.danhmuc1_id) // tránh lỗi undefined
        .map(item => item.danhmuc1_id.toString());

    // Loại bỏ trùng
    const uniqueDanhmuc1Ids = [...new Set(danhmuc1Ids)];
    // gắn hang_id rỗng
    const defaultHangId = "68d7add80f2de0ba7828aeda";

    const add = {
        name: body.name,
        masanpham: body.masanpham,
        thutuhienthi: body.thutuhienthi,
        slug: slug(body.name),
        price: body.price,
        pricesale: body.pricesale,
        danhmuc2_id: body.danhmuc2_id,
        danhmuc1_id: uniqueDanhmuc1Ids,
        hang_id: body.hang_id ? (Array.isArray(body.hang_id) ? body.hang_id : [body.hang_id]) : [defaultHangId],
        trangthai: body.trangthai == "on",
        spmoi: body.spmoi == "on",
        spnoibat: body.spnoibat == "on",
        spcaocap: body.spcaocap == "on",
        content: body.content,
        content2: body.content2,
        title: body.title,
        description: body.description,
        keywords: body.keywords
    }
    if (files.length > 0) {
        const uploadimg = [];
        for (item of files) {
            uploadimg.push(item.originalname);
            fs.renameSync(item.path, path.resolve("src/public/site/images/update", item.originalname));
            const add2 = {
                images: item.originalname,
                note: "02"
            }
            new ImagesModel(add2).save();
        }

        const image = [];
        for (var i = 0; i < files.length; i++) {
            img = {
                stt: i,
                name: uploadimg[i],
            }
            image.push(img)
        }
        add["images"] = image;

    }
    await ProductModel.updateOne({ _id: id }, { $set: add });
    res.redirect('/admin/san-pham?page=' + req.query.page);

}
const deletesanpham = async (req, res) => {
    const id = req.params.id;
    await ProductModel.deleteOne({ _id: id });
    res.redirect('/admin/san-pham?page=' + req.query.page);

}

const viewsanpham = async (req, res) => {
    const id = req.params.id;



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
                danhmuc2_id: { $in: product.danhmuc2_id }
            }
        },
        { $sample: { size: 10 } } // Lấy ngẫu nhiên 10 sản phẩm
    ]);

    const spcungloai = await ProductModel.aggregate([
        {
            $match: {
                spnoibat: true,
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



const search = async (req, res) => {
    const keyword = req.query.keyword || "";
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    // 1. Tìm tất cả sản phẩm phù hợp theo keyword
    const products = await ProductModel.find({
        name: { $regex: keyword, $options: "i" }
    }).populate('danhmuc2_id');

    // 2. Sắp xếp theo thời gian tạo gần nhất (nếu muốn)
    products.sort((a, b) => b.createdAt - a.createdAt); // hoặc xóa dòng này nếu không cần

    // 3. Phân trang
    const totalRows = products.length;
    const totalPages = Math.ceil(totalRows / limit);
    const pagedProducts = products.slice(skip, skip + limit);

    const next = page + 1;
    const hasNext = page < totalPages;
    const prev = page - 1;
    const hasPrev = page > 1;

    const data = `Tìm kiếm: "${keyword}" có ${totalRows} kết quả.`;

    res.render("./admin/products/product", {
        products: pagedProducts,
        page,
        totalPages,
        next,
        hasNext,
        prev,
        hasPrev,
        pages: pagination(page, totalPages),
        data,
        stt: skip + 1
    });
};




const tintuc = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        // Đếm tổng số sản phẩm
        const totalRows = await TintucModel.countDocuments();

        // Tính tổng số trang
        const totalPages = Math.ceil(totalRows / limit);

        // Lấy danh sách sản phẩm có phân trang
        const products = await TintucModel.find()
            .sort({ _id: -1 })
            .skip(skip)
            .limit(limit);

        // Phân trang
        const paginationData = {
            page,
            totalPages,
            hasNext: page < totalPages,
            next: page + 1,
            hasPrev: page > 1,
            prev: page - 1,
            pages: pagination(page, totalPages)
        };

        res.render("./admin/tin-tuc/danh-sach", {
            products,
            stt: 1,
            ...paginationData
        });
    } catch (err) {
        console.error("Lỗi khi hiển thị sản phẩm:", err);
        res.status(500).send("Đã xảy ra lỗi khi tải danh sách sản phẩm.");
    }
};

const addtintuc = async (req, res) => {
    res.render("./admin/tin-tuc/add-tin-tuc",)
}
const uploadtintuc = async (req, res) => {
    const { file, body } = req;
    const add = {
        name: body.name,
        slug: slug(body.name),
        trangthai: body.trangthai == "on",
        content: body.content,
        content2: body.content2,
        title: body.title,
        description: body.description,
        keywords: body.keywords

    }
    if (file) {
        const targetPath = path.resolve("src/public/site/images/update", file.originalname);
        fs.renameSync(file.path, targetPath);
        add.image = file.originalname;
        const add2 = {
            images: file.originalname,
            note: "02"
        }
        new ImagesModel(add2).save();
    }
    new TintucModel(add).save();
    res.redirect("/admin/tin-tuc")


}
const edittintuc = async (req, res) => {
    const id = req.params.id;
    const page = req.query.page || "1";
    const product = await TintucModel.findById(id);
    res.render("./admin/tin-tuc/edit-tin-tuc", { product, page })
}
const updatetintuc = async (req, res) => {
    const id = req.params.id;
    const { file, body } = req;
    const add = {
        name: body.name,
        slug: slug(body.name),
        trangthai: body.trangthai == "on",
        content: body.content,
        content2: body.content2,
        title: body.title,
        description: body.description,
        keywords: body.keywords

    }
    if (file) {
        const targetPath = path.resolve("src/public/site/images/update", file.originalname);
        fs.renameSync(file.path, targetPath);
        add.image = file.originalname;
        const add2 = {
            images: file.originalname,
            note: "02"
        }
        new ImagesModel(add2).save();
    }
    await TintucModel.updateOne({ _id: id }, { $set: add });
    res.redirect('/admin/tin-tuc?page=' + req.query.page);



}
const deletetintuc = async (req, res) => {
    const id = req.params.id;
    await TintucModel.deleteOne({ _id: id });
    res.redirect('/admin/tin-tuc?page=' + req.query.page);

}
const viewtintuc = async (req, res) => {
    const id = req.params.id;
    // Kiểm tra ID có hợp lệ không

    // Nếu hợp lệ, mới tiếp tục truy vấn
    const product = await TintucModel.findById(id).lean();

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


const view = async (req, res) => {
    const orderBy = req.query.orderby || "";
    const keyword = req.params.id || " ";
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const sortOptions = {
        view: { view: -1 },
        date: { updatedAt: -1 },

    };
    const sort = sortOptions[orderBy] || { _id: 1 };

    const [product, totalRows] = await Promise.all([
        ProductModel.find().sort(sort).skip(skip).limit(limit),
        ProductModel.countDocuments(),
    ]);

    const totalPages = Math.ceil(totalRows / limit);

    res.render("./admin/view/view", {
        product, orderBy, stt: 1,
        keyword,
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
const view2 = async (req, res) => {

    const orderBy = req.query.orderby || "";
    const keyword = req.params.id || " ";
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const sortOptions = {
        view: { view: -1 },
        date: { updatedAt: -1 },

    };
    const sort = sortOptions[orderBy] || { _id: 1 };

    const [product, totalRows] = await Promise.all([
        TintucModel.find().sort(sort).skip(skip).limit(limit),
        TintucModel.countDocuments(),
    ]);

    const totalPages = Math.ceil(totalRows / limit);

    res.render("./admin/view/view-tin-tuc", {
        product, orderBy, stt: 1,
        keyword,
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






const chantrang = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        // Đếm tổng số sản phẩm
        const totalRows = await ChantrangModel.countDocuments();

        // Tính tổng số trang
        const totalPages = Math.ceil(totalRows / limit);

        // Lấy danh sách sản phẩm có phân trang
        const product = await ChantrangModel.find()
            .sort({ _id: -1 })
            .skip(skip)
            .limit(limit);

        // Phân trang
        const paginationData = {
            page,
            totalPages,
            hasNext: page < totalPages,
            next: page + 1,
            hasPrev: page > 1,
            prev: page - 1,
            pages: pagination(page, totalPages)
        };

        res.render("./admin/menu-chan-trang/chan-trang", {
            product,
            stt: 1,
            ...paginationData
        });
    } catch (err) {
        console.error("Lỗi khi hiển thị sản phẩm:", err);
        res.status(500).send("Đã xảy ra lỗi khi tải danh sách sản phẩm.");
    }
};

const addchantrang = async (req, res) => {
    res.render("./admin/menu-chan-trang/add-chan-trang", { data: {} })
}
const uploadchantrang = async (req, res) => {
    const add = {
        name: req.body.name
    }
    new ChantrangModel(add).save();
    res.redirect("/admin/chan-trang")
}
const editchantrang = async (req, res) => {
    const id = req.params.id;
    const page = req.query.page || "1";
    const product = await ChantrangModel.findById(id);
    res.render("./admin/menu-chan-trang/edit-chan-trang", { product, page })
}
const updatechantrang = async (req, res) => {
    const id = req.params.id;
    const add = {
        name: req.body.name,
    }
    await ChantrangModel.updateOne({ _id: id }, { $set: add });
    res.redirect('/admin/chan-trang?page=' + req.query.page);



}
const deletechantrang = async (req, res) => {
    try {
        const id = req.params.id;

        // Xóa tất cả menu con thuộc chantrang này
        await MenuchantrangModel.deleteMany({ chantrang_id: id });

        // Xóa luôn chính chantrang
        await ChantrangModel.deleteOne({ _id: id });

        res.redirect('/admin/chan-trang?page=' + (req.query.page || 1));
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi khi xóa chân trang");
    }
};



const menuchantrang = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        const id = req.params.id;
        const chantrang = await ChantrangModel.findById(id);
        // Đếm tổng số sản phẩm
        const totalRows = await MenuchantrangModel.countDocuments({ chantrang_id: id });

        // Tính tổng số trang
        const totalPages = Math.ceil(totalRows / limit);

        // Lấy danh sách sản phẩm có phân trang
        const products = await MenuchantrangModel.find({ chantrang_id: id })
            .sort({ _id: -1 })
            .skip(skip)
            .limit(limit);

        // Phân trang
        const paginationData = {
            page, chantrang,
            totalPages,
            hasNext: page < totalPages,
            next: page + 1,
            hasPrev: page > 1,
            prev: page - 1,
            pages: pagination(page, totalPages)
        };

        res.render("./admin/menu-chan-trang/menu-chan-trang/danh-sach", {
            products,
            stt: 1,
            ...paginationData
        });
    } catch (err) {
        console.error("Lỗi khi hiển thị sản phẩm:", err);
        res.status(500).send("Đã xảy ra lỗi khi tải danh sách sản phẩm.");
    }
};

const addmenuchantrang = async (req, res) => {
    const idchantrang = req.params.id;

    res.render("./admin/menu-chan-trang/menu-chan-trang/add-menu-chan-trang", { idchantrang })
}
const uploadmenuchantrang = async (req, res) => {
    const { body } = req;
    const add = {
        chantrang_id: body.idchantrang,
        name: body.name,
        slug: slug(body.name),
        trangthai: body.trangthai == "on",
        content: body.content,
        title: body.title,
        description: body.description,
        keywords: body.keywords,
    }

    new MenuchantrangModel(add).save();
    res.redirect(`/admin/menu-chan-trang/${body.idchantrang}`)
}
const editmenuchantrang = async (req, res) => {
    const id = req.params.id;
    const page = req.query.page || "1";
    const product = await MenuchantrangModel.findById(id);
    res.render("./admin/menu-chan-trang/menu-chan-trang/edit-menu-chan-trang", { product, page })
}
const updatemenuchantrang = async (req, res) => {
    const id = req.params.id;
    const { body } = req;
    const add = {
        chantrang_id: body.idchantrang,
        name: body.name,
        slug: slug(body.name),
        trangthai: body.trangthai == "on",
        content: body.content,
        title: body.title,
        description: body.description,
        keywords: body.keywords,
    }

    await MenuchantrangModel.updateOne({ _id: id }, { $set: add });
    res.redirect(`/admin/menu-chan-trang/${body.idchantrang}?page=` + req.query.page);
}
const deletemenuchantrang = async (req, res) => {
    try {
        const id = req.params.id;
        const menu = await MenuchantrangModel.findById(id);

        if (!menu) {
            return res.status(404).send("Menu chân trang không tồn tại");
        }

        // Xóa luôn document
        await MenuchantrangModel.findByIdAndDelete(id);

        // Redirect về trang cha (chantrang_id của menu này)
        res.redirect(`/admin/menu-chan-trang/${menu.chantrang_id}?page=${req.query.page || 1}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi khi xóa menu chân trang");
    }
};

const order = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        // Đếm tổng số sản phẩm
        const totalRows = await OrderModel.countDocuments();

        // Tính tổng số trang
        const totalPages = Math.ceil(totalRows / limit);

        // Lấy danh sách sản phẩm có phân trang
        const products = await OrderModel.find()
            .sort({ _id: -1 })
            .skip(skip)
            .limit(limit);

        // Phân trang
        const paginationData = {
            page,
            totalPages,
            hasNext: page < totalPages,
            next: page + 1,
            hasPrev: page > 1,
            prev: page - 1,
            pages: pagination(page, totalPages)
        };

        res.render("./admin/order/order", {
            products,
            stt: 1,
            data: " ",
            ...paginationData
        });
    } catch (err) {
        console.error("Lỗi khi hiển thị danh sách hãng:", err);
        res.status(500).send("Đã xảy ra lỗi khi tải danh sách hãng.");
    }






}
const editorder = async (req, res) => {
    const id = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const product = {
        trangthai: req.body.trangthai == "true"
    }
    await OrderModel.updateOne({ _id: id }, { $set: product });
    res.redirect(`/admin/danh-sach-don-hang?page=${page}`)
}



const dsanh = async (req, res) => {
    const tieude = await ImagesModel.find({ note: '02' });
    const content = await ImagesModel.find({ note: '01' });
    res.render("./admin/danh-sach-anh/menu-danh-sach", { tieude, content })
}

const dsanhtieude = async (req, res) => {
    const image = await ImagesModel.find({ note: '02' }).sort({ _id: -1 });
    res.render("./admin/danh-sach-anh/danh-sach-anh-tieu-de", { image })
}
const dsanhconent = async (req, res) => {
    const image = await ImagesModel.find({ note: '01' }).sort({ _id: -1 });
    res.render("./admin/danh-sach-anh/danh-sach-anh-content", { image })
}


module.exports = {

    upload,
    gioithieutrang,
    editgioithieutrang,
    updategioithieu,
    thongtintrang,
    editthongtintrang,
    updatethongtintrang,
    nhomsanpham,
    addnhomsanpham,
    addnhomsp,
    editnhomsanpham,
    chiasekhachhang,
    addchiasekhachhang,
    uploadchiasekhachhang,
    editchiasekhachhang,
    updatechiasekhachhang,
    deletechiasekhachhang, search,

    banner, addbanner, uploadbanner, updatebanner, deletebanner,
    hang, addhang, edithang, uploadhang, updatehang, deletehang,
    danhmuc1, adddanhmuc1, editdanhmuc1, uploaddanhmuc1, updatedanhmuc1, deletedanhmuc1,
    danhmuc2, adddanhmuc2, editdanhmuc2, uploaddanhmuc2, updatedanhmuc2, deletedanhmuc2,
    sanpham, addsanpham, editsanpham, uploadsanpham, updatesanpham, deletesanpham, viewsanpham,
    tintuc, addtintuc, edittintuc, uploadtintuc, updatetintuc, deletetintuc, view, view2, viewtintuc,
    chantrang, addchantrang, editchantrang, uploadchantrang, updatechantrang, deletechantrang,
    menuchantrang, addmenuchantrang, editmenuchantrang, uploadmenuchantrang, updatemenuchantrang, deletemenuchantrang,
    editorder, order, dsanh, dsanhtieude, dsanhconent,
}