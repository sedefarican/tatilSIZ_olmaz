import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import Redis from 'ioredis';
import { GoogleGenerativeAI } from '@google/generative-ai';

import { connectProducer, disconnectProducer } from './utils/kafkaClient.js';
import authRoutes from './routes/authRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import hotelRoutes from './routes/hotelRoutes.js';
import currencyRoutes from './routes/currencyRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

let redisClient;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Backend sunucusu çalışıyor.', status: 'OK' });
});

app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/currency', currencyRoutes);

app.post('/api/ask-gemini', async (req, res, next) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ success: false, error: 'Lütfen bir prompt (istek metni) sağlayın.' });
    }

    try {
        const result = await geminiModel.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        res.status(200).json({ success: true, response: text });
    } catch (error) {
        console.error('Gemini API Hatası:', error);
        next(new Error('Gemini API\'den yanıt alınamadı.'));
    }
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Sunucuda beklenmedik bir hata oluştu.';
    
    console.error(`[HATA] ${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    console.error(err.stack);

    res.status(statusCode).json({
        success: false,
        error: {
            message: message,
        },
    });
});

const startServer = async () => {
    try {

        console.log('MongoDB\'ye bağlanılıyor...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB’ye başarıyla bağlanıldı.');

        console.log('Redis\'e bağlanılıyor...');
        redisClient = new Redis(process.env.REDIS_HOST || 'redis://localhost:6379');
        redisClient.on('connect', () => console.log('✅ Redis’e başarıyla bağlanıldı.'));
        redisClient.on('error', (err) => console.error('❌ Redis bağlantı hatası:', err));
        
        console.log('Kafka Producer\'a bağlanılıyor...');
        await connectProducer();
        console.log('✅ Kafka Producer\'a başarıyla bağlanıldı.');

        const server = app.listen(PORT, () => {
            console.log(`\n🚀 Backend sunucusu ${PORT} portunda çalışıyor`);
        });

        const signals = ['SIGINT', 'SIGTERM'];
        signals.forEach((signal) => {
            process.on(signal, async () => {
                console.log(`\n${signal} sinyali alındı. Kapatma işlemi başlıyor...`);

                server.close(async () => {
                    console.log('HTTP sunucusu kapatıldı.');

                    await disconnectProducer();
                    console.log('Kafka Producer bağlantısı kapatıldı.');
                    
                    if (redisClient) {
                        await redisClient.quit();
                        console.log('Redis bağlantısı kapatıldı.');
                    }
                    
                    await mongoose.connection.close(false);
                    console.log('MongoDB bağlantısı kapatıldı.');
                    
                    console.log('Tüm bağlantılar kapatıldı. Uygulama sonlandırılıyor.');
                    process.exit(0);
                });
            });
        });

    } catch (error) {
        console.error('❌ Sunucu başlatılırken kritik bir hata oluştu:', error);
        process.exit(1);
    }
};

startServer();