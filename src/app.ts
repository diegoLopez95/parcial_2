import express from 'express';
import bodyParser from "body-parser";
import loginRouter from "./login/login";
import protectedRouter from "./login/protected";
import playersRouter from "./api/players";

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send("funciona")
});

app.use(bodyParser.json());
app.use("/", loginRouter);
app.use("/", protectedRouter);
app.use("/", playersRouter);

app.listen(port, () => {
    console.log(`Servidor Express escuchando en el puerto ${port}`)
});