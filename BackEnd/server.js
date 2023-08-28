const koa = require("koa");
const { koaBody } = require("koa-body");
const Router = require("koa-router");
const json = require("koa-json");
const cors = require("@koa/cors");
const UserRouter = require("./src/router/userRoutes");
const connection = require("./src/connection/connection");

const app = new koa();
const router = new Router();
app.use(koaBody());
app.use(cors());
app.use(json());
app.use(router.routes());
app.use(router.allowedMethods());

app.use(async (ctx, next) => {
  ctx.set("Access-Control-Allow-Methods", "POST, GET, DELETE, PUT, OPTION");
  ctx.set("Access-Control-Allow-Credentials", "true");
  ctx.set("Access-Control-Max-Age", "1800");
  ctx.set("Access-Control-Allow-Headers", "*");
  await next();
});

UserRouter.Router(router);

//connection
connection().catch(console.error);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
