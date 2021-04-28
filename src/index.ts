import express,{Response,Request} from 'express';
import cors from "cors"

const app = express();
app.use(cors());
const PORT = 8000;

app.get('/green', (req:Request, res:Response) => {
    res.send('Je suis un pouce vert');
});
app.get('/red', (req:Request, res:Response) => {
    res.send('Je suis un pouce rouge');
});

app.listen(PORT, () => { console.log(`Listenning on port ${PORT}`); });
