const UserService = require("../services/userService");

class UserController {
  static async userSignUpController(ctx) {
    try {
      await UserService.userSignUp(ctx);
    } catch (error) {
      ctx.body = error.message;
      ctx.response.status = 400;
    }
  }

  static async userSignInController(ctx) {
    try {
      await UserService.userSignIn(ctx);
    } catch (error) {
      ctx.body = error.message;
      ctx.response.status = 400;
    }
  }

  static async userUploadController(ctx) {
    try {
      await UserService.userUpload(ctx);
    } catch (error) {
      ctx.response.body = error.message;
      ctx.response.status = 400;
    }
  }

  static async userSubscribeController(ctx) {
    try {
      await UserService.userSubscribe(ctx);
    } catch (error) {
      ctx.body = error.message;
      ctx.response.status = 400;
    }
  }

  static async fetchImageController(ctx) {
    try {
      await UserService.fetchImage(ctx);
    } catch (error) {
      ctx.body = error.message;
      ctx.response.status = 400;
    }
  }
}

module.exports = UserController;
