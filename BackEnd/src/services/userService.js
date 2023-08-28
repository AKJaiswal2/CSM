const User = require("../models/user");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

class UserService {
  static async userSignUp(ctx) {
    try {
      const { fullName, email, password } = ctx.request.body;
      await this.isUserExists(email);
      const saltRounds = 10;
      const hash = await bcrypt.hash(password, saltRounds);
      const newUser = new User({
        fullName: fullName,
        email: email,
        password: hash,
      });

      await newUser
        .save()
        .then((result) => {
          ctx.response.body = {
            success: true,
            message: "Signed Up",
            data: result._doc, // You can include additional data if needed
          };
        })
        .catch((error) => {
          throw error;
        });
    } catch (error) {
      throw error;
    }
  }

  static async userSignIn(ctx) {
    try {
      const { email, password } = ctx.request.body;
      let token;
      await User.findOne({ email: email }).then(async (user) => {
        if (user) {
          const hash = user.password;
          const match = await bcrypt.compare(password, hash);
          if (match) {
            token = jwt.sign({ id: user._id }, process.env.PRIVATE_KEY);
            await User.findOneAndUpdate(
              { email },
              { $set: { accessToken: token } },
              { new: true }
            )
              .then((updatedProfile) => {
                ctx.response.body = {
                  success: true,
                  message: "Updated",
                  data: updatedProfile._doc, // You can include additional data if needed
                };
              })
              .catch((error) => {
                throw error;
              });
          } else {
            throw new Error("Wrong Password");
          }
        } else {
          throw new Error("User Does Not Exist");
        }
      });
    } catch (error) {
      throw error;
    }
  }

  static async userUpload(ctx) {
    try {
      const userId = ctx.state.id;
      const user = await User.findById(userId);

      if (!user) {
        throw new Error("User not found");
      }

      const currentTime = new Date();
      const timeDiff =
        (currentTime - user.lastImageUploadTime) / (1000 * 60 * 60); // in hours

      if (user.subscriptionTier === "free") {
        if (user.uploadedImages.length >= 1) {
          throw new Error("Free tier user can only upload 1 image");
        }
        if (timeDiff < 1) {
          throw new Error("Free tier user can upload only 1 image per hour");
        }
      }

      const imageUrl = ctx.file.path;
      user.uploadedImages.push(imageUrl);
      user.lastImageUploadTime = currentTime;
      await user.save();

      ctx.response.body = {
        success: true,
        message: "Image uploaded successfully",
        data: user, // You can include additional data if needed
      };
    } catch (error) {
      throw error;
    }
  }

  static async userSubscribe(ctx) {
    try {
      const { subscriptionTier } = ctx.request.body;
      const userId = ctx.state.id;
      const user = await User.findById(userId);

      if (!user) {
        throw new Error("User not found");
      }

      let customerId = user.stripeCustomerId;
      if (!customerId) {
        // Create a new customer if not already created
        const customerData = {
          email: user.email, // Use the user's email for the customer
        };

        const customer = await stripe.customers.create(customerData);
        customerId = customer.id;
        user.stripeCustomerId = customerId;
        await user.save();
      }

      if (subscriptionTier === "pro") {
        const customer = await stripe.customers.retrieve(user.stripeCustomerId);

        const priceId = process.env.PRICE_ID;

        // const subscription = await stripe.subscriptions.create({
        //   customer: customer.id,
        //   items: [{ price: priceId }],
        // });

        user.subscriptionTier = "pro";
        // user.stripeSubscriptionId = subscription.id;
        await user.save();

        ctx.response.body = {
          success: true,
          message: "User upgraded to pro tier",
          data: user, // You can include additional data if needed
        };
      } else if (subscriptionTier === "free") {
        user.subscriptionTier = "free";
        user.stripeSubscriptionId = null;
        await user.save();

        ctx.response.body = {
          success: true,
          message: "User downgraded to free tier",
          data: user, // You can include additional data if needed
        };
      } else {
        throw new Error("Invalid subscription tier");
      }
    } catch (error) {
      throw error;
    }
  }

  static async fetchImage(ctx) {
    try {
      const userId = ctx.state.id;
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      ctx.response.body = {
        success: true,
        message: "Images Fetched",
        data: user, // You can include additional data if needed
      };
    } catch (error) {
      throw error;
    }
  }

  static async isUserExists(email) {
    try {
      await User.findOne({ email: email }).then((user) => {
        if (user) {
          throw new Error("User Already Exists");
        }
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserService;
