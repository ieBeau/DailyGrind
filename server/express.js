import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compress from "compression";
import cors from "cors";
import helmet from "helmet";

import productRoutes from './routes/product.route.js';

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use(cors({
    origin: [
        'http://localhost:5173', 
        'https://dailygrind-coffee.onrender.com'
    ],
    credentials: true
}));

app.get("/", (req, res) => res.json({ message: "Welcome to Daily Grind." }));
app.use('/api/product', productRoutes);

export default app;
