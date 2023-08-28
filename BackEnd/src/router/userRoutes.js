const UserController = require("../controller/userController");
const multer = require("@koa/multer");

const upload = multer({ dest: "uploads/" });
const middleware = require("../middleware/authMiddleware");

class UserRouter {
  static Router(router) {
    router.post("/user/signup", UserController.userSignUpController);
    router.post("/user/signin", UserController.userSignInController);
    router.post(
      "/user/upload",
      middleware.authenticateToken,
      upload.single("avatar"),
      UserController.userUploadController
    );
    router.post(
      "/user/subscribe",
      middleware.authenticateToken,
      UserController.userSubscribeController
    );
    router.get(
      "/user/images",
      middleware.authenticateToken,
      UserController.fetchImageController
    );
  }
}

module.exports = UserRouter;
