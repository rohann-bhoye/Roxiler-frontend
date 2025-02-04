import { Statistic, message, Card, Typography, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS } from "chart.js/auto";

const { Title } = Typography;

export default function Stats({ month, monthText }) {
    let [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    
    const getData = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`https://roxiler-pvpf.onrender.com/combined-data?month=${month}`);
            setLoading(false);
            setData(res.data);
            message.success('Data loaded successfully');
        } catch (error) {
            console.error(error);
            message.error('Error loading data');
        }
    };

    useEffect(() => {
        getData();
        return () => {
            setData(null);
        };
    }, [month]);

    return (
        <Card style={{ margin: 20, padding: 20, borderRadius: 10 }}>
            <Title level={3} style={{ textAlign: 'center', marginBottom: 10 }}>
                Stats for {monthText}
            </Title>
            <Space direction="vertical" style={{ width: "100%", alignItems: "center" }}>
                <Totals stats={data?.statsData} loading={loading} />
                {data && <BarChart data={data?.barChartData} />}
                {data && <PieChart data={data?.pieChartData} />}
            </Space>
        </Card>
    );
}

function Totals({ stats, loading }) {
    return (
        <Card style={{ maxWidth: '900px', padding: '20px', textAlign: 'center' }}>
            <Space size="large" style={{ justifyContent: 'center' }}>
                <Statistic title="Total Sale" value={stats?.totalSale} loading={loading} prefix="₹" />
                <Statistic title="Total Sold Items" value={stats?.soldCount} loading={loading} />
                <Statistic title="Total Unsold Items" value={stats?.unsoldCount} loading={loading} />
            </Space>
        </Card>
    );
}

function BarChart({ data }) {
    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'No of products per price range' }
        },
        scales: {
            x: { stacked: true, title: { display: true, text: 'Price Range' } },
            y: { stacked: true, title: { display: true, text: 'Product Count' }, ticks: { stepSize: 4 } }
        },
        aspectRatio: 1.6
    };

    const chartData = {
        labels: Object.keys(data),
        datasets: [{ label: 'No of products per price range', data: Object.values(data), backgroundColor: 'rgba(0, 105, 100, 0.7)' }]
    };

    return (
        <Card style={{ padding: 20, maxWidth: '900px', width: '100%' }}>
            <Bar data={chartData} options={options} />
        </Card>
    );
}

function PieChart({ data }) {
    const chartData = {
        labels: Object.keys(data),
        datasets: [{ label: '# of Products', data: Object.values(data) }]
    };

    return (
        <Card style={{ padding: 20, maxWidth: '400px', width: '100%' }}>
            <Doughnut data={chartData} />
        </Card>
    );
}
