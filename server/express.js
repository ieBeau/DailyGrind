import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compress from "compression";
import cors from "cors";
import helmet from "helmet";

import customerRoutes from './routes/customer.route.js';
import productRoutes from './routes/product.route.js';
import basketRoutes from './routes/basket.route.js';
import shippingRoutes from './routes/shipping.route.js';
import taxRoutes from './routes/tax.route.js';
import reportRoutes from './routes/report.route.js';

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
app.use('/api/customer', customerRoutes);
app.use('/api/product', productRoutes);
app.use('/api/basket', basketRoutes);
app.use('/api/shipping', shippingRoutes);
app.use('/api/tax', taxRoutes);
app.use('/api/report', reportRoutes);

export default app;
