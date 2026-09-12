import { connectdb } from "./db/index.js";
import app from "./app.js";

connectdb()
  .then(() => {
    app.listen(process.env.PORT || 800, () => {
      console.log(`server running ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(`server making error ${error}`);
  });
