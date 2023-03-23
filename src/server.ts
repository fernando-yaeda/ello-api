import app, { close, init } from "@/app";

const port = +process.env.PORT || 80;

init()
  .then(() => {
    app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server is listening on port ${port}.`);
    });
  })
  .catch(async (error) => {
    // eslint-disable-next-line no-console
    console.log(error);
    await close();
  });
