const express = require("express")
const router = express.Router();

//admin Controller
const AdminController = require("../apps/controllers/admin");
const AuthController = require("../apps/controllers/auth");
const ProductController = require("../apps/controllers/product");

// Middleware
const AuthMiddleware = require ("../../src/apps/middlewares/auth")
const UploadMiddleware = require("../apps/middlewares/upload")
const multipartMiddleware = require("../apps/middlewares/ckeditor")
router.post("/upload", multipartMiddleware, ProductController.upload);


//site
const SiteController =require("../apps/controllers/site")



// Router Admin
router.get("/admin/login", AuthMiddleware.checkLogin, AuthController.getLogin);
router.post("/admin/login",AuthMiddleware.checkLogin, AuthController.postLogin);
router.get("/admin/logout", AuthMiddleware.checkAdmin, AuthController.logout);
router.get("/admin/dashboard", AuthMiddleware.checkAdmin, AdminController.index);




// nam thành phát
router.get("/admin/gioi-thieu-trang", AuthMiddleware.checkAdmin, ProductController.gioithieutrang);
router.get("/admin/edit-gioi-thieu-trang/:id", AuthMiddleware.checkAdmin, ProductController.editgioithieutrang);
router.post("/update-gioi-thieu-trang/:id", AuthMiddleware.checkAdmin,
    UploadMiddleware.array("images", 20), 
    ProductController.updategioithieu);


router.get("/admin/thong-tin-trang", AuthMiddleware.checkAdmin, ProductController.thongtintrang);
router.get("/admin/edit-thong-tin-trang/:id", AuthMiddleware.checkAdmin, ProductController.editthongtintrang);
router.post("/admin/update-thong-tin-trang/:id", AuthMiddleware.checkAdmin,
UploadMiddleware.single("images"),  
    ProductController.updatethongtintrang);



router.get("/admin/nhom-san-pham", AuthMiddleware.checkAdmin, ProductController.nhomsanpham);
router.get("/admin/add-nhom-san-pham",AuthMiddleware.checkAdmin, ProductController.addnhomsanpham);
router.post("/admin/add-nhom-sp", AuthMiddleware.checkAdmin,
    UploadMiddleware.single("images"), 
    ProductController.addnhomsp);



 



// rèm


// Router Site
router.get("/san-pham", SiteController.sanpham);
router.get("/san-pham/:id", SiteController.chitietsanpham);
router.get("/danh-muc/:id", SiteController.danhmuc1);
router.get("/danh-muc/:slug/:id", SiteController.danhmuc2); 
router.get("/gio-hang", SiteController.cart);
router.post("/cart/:id", SiteController.addcart);
router.get("/cart/:id", SiteController.addcart2);
router.post("/update/gio-hang",UploadMiddleware.array("images", 20), SiteController.updatecart);
router.get("/delete/gio-hang/:id",UploadMiddleware.array("images", 20), SiteController.deletecart);
router.get("/thanh-toan", SiteController.thanhtoan);
router.post("/thanh-toan/order",UploadMiddleware.array("images", 20), SiteController.thanhtoan2);
router.get("/", SiteController.home);
router.get("/gioi-thieu", SiteController.gioithieu);
router.get("/search", SiteController.search);
router.get("/search-suggest", SiteController.searchsuggest);
router.get("/tin-tuc", SiteController.tintuc);
router.get("/tin-tuc/:id", SiteController.chitiettintuc);
router.get("/chinh-sach-hoan-tra-va-hoan-tientest", SiteController.chinhsach);
router.get("/chinh-sach-bao-hanhtest", SiteController.baohanh);
router.get("/van-chuyen-giao-hangtest", SiteController.vanchuyen);
router.get("/hinh-thuc-thanh-toantesst", SiteController.hinhthucthanhtoan);
router.get("/thuong-hieu", SiteController.thuonghieu);
router.get("/pages/:slug", SiteController.footer);





// Router Admin




router.get("/admin/hang",AuthMiddleware.checkAdmin, ProductController.hang); 
router.get("/admin/add-hang",AuthMiddleware.checkAdmin, ProductController.addhang);
router.post("/upload-hang",AuthMiddleware.checkAdmin, UploadMiddleware.single("images"), ProductController.uploadhang);
router.get("/admin/edit-hang/:id",AuthMiddleware.checkAdmin, ProductController.edithang);
router.post("/admin/update-hang/:id",AuthMiddleware.checkAdmin, UploadMiddleware.single("images"), ProductController.updatehang);
router.get("/admin/delete-hang/:id",AuthMiddleware.checkAdmin, ProductController.deletehang);

router.get("/admin/danh-muc",AuthMiddleware.checkAdmin, ProductController.danhmuc1); 
router.get("/admin/add-danh-muc",AuthMiddleware.checkAdmin, ProductController.adddanhmuc1);
router.post("/upload-danh-muc-1",AuthMiddleware.checkAdmin, ProductController.uploaddanhmuc1);
router.get("/admin/edit-danh-muc/:id",AuthMiddleware.checkAdmin, ProductController.editdanhmuc1);
router.post("/admin/update-danh-muc/:id",AuthMiddleware.checkAdmin, ProductController.updatedanhmuc1);
router.get("/admin/delete-danh-muc/:id",AuthMiddleware.checkAdmin, ProductController.deletedanhmuc1);

router.get("/admin/danh-muc",AuthMiddleware.checkAdmin, ProductController.danhmuc1); 
router.get("/admin/add-danh-muc",AuthMiddleware.checkAdmin, ProductController.adddanhmuc1);
router.post("/upload-danh-muc-1",AuthMiddleware.checkAdmin, ProductController.uploaddanhmuc1);
router.get("/admin/edit-danh-muc/:id",AuthMiddleware.checkAdmin, ProductController.editdanhmuc1);
router.post("/admin/update-danh-muc/:id",AuthMiddleware.checkAdmin, ProductController.updatedanhmuc1);
router.get("/admin/delete-danh-muc/:id",AuthMiddleware.checkAdmin, ProductController.deletedanhmuc1);

router.get("/admin/danh-muc-2",AuthMiddleware.checkAdmin, ProductController.danhmuc2);
router.get("/admin/add-danh-muc-2",AuthMiddleware.checkAdmin, ProductController.adddanhmuc2);
router.post("/upload-danh-muc-2",AuthMiddleware.checkAdmin, ProductController.uploaddanhmuc2);
router.get("/admin/edit-danh-muc-2/:id",AuthMiddleware.checkAdmin, ProductController.editdanhmuc2);
router.post("/admin/update-danh-muc-2/:id",AuthMiddleware.checkAdmin, ProductController.updatedanhmuc2);
router.get("/admin/delete-danh-muc-2/:id",AuthMiddleware.checkAdmin, ProductController.deletedanhmuc2);


router.get("/admin/san-pham",AuthMiddleware.checkAdmin, ProductController.sanpham);
router.get("/admin/add-san-pham",AuthMiddleware.checkAdmin, ProductController.addsanpham);
router.post("/admin/upload-san-pham",AuthMiddleware.checkAdmin,UploadMiddleware.array("images", 20), ProductController.uploadsanpham);
router.get("/admin/edit-san-pham/:id",AuthMiddleware.checkAdmin, ProductController.editsanpham);
router.post("/admin/update-san-pham/:id",AuthMiddleware.checkAdmin,UploadMiddleware.array("images", 20), ProductController.updatesanpham);
router.get("/admin/delete-san-pham/:id",AuthMiddleware.checkAdmin, ProductController.deletesanpham);
router.get("/admin/search",AuthMiddleware.checkAdmin, ProductController.search);


router.get("/admin/tin-tuc",AuthMiddleware.checkAdmin, ProductController.tintuc);
router.get("/admin/add-tin-tuc",AuthMiddleware.checkAdmin, ProductController.addtintuc);
router.post("/admin/upload-tin-tuc",AuthMiddleware.checkAdmin, UploadMiddleware.single("images"),  ProductController.uploadtintuc);
router.get("/admin/edit-tin-tuc/:id",AuthMiddleware.checkAdmin, ProductController.edittintuc);
router.post("/admin/update-tin-tuc/:id",AuthMiddleware.checkAdmin, UploadMiddleware.single("images"),  ProductController.updatetintuc);
router.get("/admin/delete-tin-tuc/:id",AuthMiddleware.checkAdmin, ProductController.deletetintuc);
router.get("/admin/view",AuthMiddleware.checkAdmin, ProductController.view);
router.get("/admin/view-tin-tuc",AuthMiddleware.checkAdmin, ProductController.view2);


router.get("/admin/chan-trang",AuthMiddleware.checkAdmin, ProductController.chantrang);
router.get("/admin/add-chan-trang",AuthMiddleware.checkAdmin, ProductController.addchantrang);
router.post("/admin/upload-chan-trang",AuthMiddleware.checkAdmin, UploadMiddleware.single("images"),  ProductController.uploadchantrang);
router.get("/admin/edit-chan-trang/:id",AuthMiddleware.checkAdmin, ProductController.editchantrang);
router.post("/admin/update-chan-trang/:id",AuthMiddleware.checkAdmin, UploadMiddleware.single("images"),  ProductController.updatechantrang);
router.get("/admin/delete-chan-trang/:id",AuthMiddleware.checkAdmin, ProductController.deletechantrang);

router.get("/admin/menu-chan-trang/:id",AuthMiddleware.checkAdmin, ProductController.menuchantrang);
router.get("/admin/add-menu-chan-trang/:id",AuthMiddleware.checkAdmin, ProductController.addmenuchantrang);
router.post("/admin/upload-menu-chan-trang/:id",AuthMiddleware.checkAdmin, UploadMiddleware.single("images"),  ProductController.uploadmenuchantrang);
router.get("/admin/edit-menu-chan-trang/:id",AuthMiddleware.checkAdmin, ProductController.editmenuchantrang);
router.post("/admin/update-menu-chan-trang/:id",AuthMiddleware.checkAdmin, UploadMiddleware.single("images"),  ProductController.updatemenuchantrang);
router.get("/admin/delete-menu-chan-trang/:id",AuthMiddleware.checkAdmin, ProductController.deletemenuchantrang);

router.get("/admin/danh-sach-don-hang", AuthMiddleware.checkAdmin, ProductController.order);
router.post("/admin/edit-don-hang/:id", ProductController.editorder);
router.get("/admin/danh-sach-anh", AuthMiddleware.checkAdmin, ProductController.dsanh);
router.get("/admin/danh-sach-anh/tieu-de", AuthMiddleware.checkAdmin, ProductController.dsanhtieude);
router.get("/admin/danh-sach-anh/content", AuthMiddleware.checkAdmin, ProductController.dsanhconent);
 
module.exports = router;