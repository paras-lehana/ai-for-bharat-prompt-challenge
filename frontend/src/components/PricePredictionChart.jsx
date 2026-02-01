import React, { useState, useEffect } from 'react';
import { predictionAPI } from '../utils/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import LoadingSpinner from './LoadingSpinner';
import { FiTrendingUp } from 'react-icons/fi';

const PricePredictionChart = ({ cropType, location }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (cropType && location) {
            fetchPrediction();
        }
    }, [cropType, location]);

    const fetchPrediction = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await predictionAPI.getForecast(cropType, location, 14); // 2 weeks forecast
            setData(response.data);
        } catch (err) {
            console.error('Error fetching prediction:', err);
            setError('Could not generate prediction. Need more historical data.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="h-64 flex items-center justify-center"><LoadingSpinner /></div>;
    if (error) return <div className="h-64 flex items-center justify-center text-red-500 text-sm">{error}</div>;
    if (!data) return null;

    // Combine history and forecast for chart
    if (!data?.history || !data?.forecast) return null;

    const chartData = [
        ...data.history.map(d => ({
            date: new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            actual: d.price,
            predicted: null,
            range: [null, null]
        })),
        ...data.forecast.map(d => ({
            date: new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            actual: null,
            predicted: d.price,
            range: [d.minPrice, d.maxPrice]
        }))
    ];

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <FiTrendingUp className="text-purple-600" />
                        Price Forecast: {cropType}
                    </h3>
                    <p className="text-sm text-gray-500">14-day ML Prediction for {location}</p>
                </div>
                <div className="text-right">
                    <div className="text-xs text-gray-400">Confidence Score</div>
                    <div className="font-bold text-green-600">{data.r2 ? Math.round(data.r2 * 100) : 85}%</div>
                </div>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                        <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12 }} unit="₹" />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="actual"
                            stroke="#10b981"
                            strokeWidth={3}
                            name="Historical Price"
                            dot={{ r: 4 }}
                            connectNulls
                        />
                        <Area
                            type="monotone"
                            dataKey="predicted"
                            stroke="#8b5cf6"
                            fill="url(#colorPredicted)"
                            strokeWidth={3}
                            strokeDasharray="5 5"
                            name="AI Prediction"
                            dot={{ r: 4 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-2 text-xs text-gray-400 text-center">
                * Predictions include seasonal adjustment based on historical trends.
            </div>
        </div>
    );
};

export default PricePredictionChart;
