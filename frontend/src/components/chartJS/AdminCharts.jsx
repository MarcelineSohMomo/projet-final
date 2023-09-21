import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const AdminCharts = ({ user, data }) => {
  const { firstname, lastname, role } = user;

  const options = {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: `Statistiques pour les services de ${
          lastname + " " + firstname
        } (${role})`,
      },
    },
    scales: {
      y: {
        display: true,
        position: "left",
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
        },
      },
      y1: {
        display: true,
        position: "right",
        min: 0,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          stepSize: 5,
        },
      },
      y2: {
        display: false,
        position: "right",
        min: 0,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          stepSize: 5,
        },
      },
    },
  };

  const statsData = {
    labels: data.map((service) => service.name),
    datasets: [
      {
        label: "Notes",
        data: data.map((service) => service.avgRating),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        yAxisID: "y",
        tension: 0.5,
      },
      {
        label: "Nombres de Favoris",
        data: data.map((service) => service.noLikes),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        yAxisID: "y1",
        tension: 0.5,
      },
      {
        label: "Nombres de Commandes",
        data: data.map((service) => service.noCommandes),
        borderColor: "rgb(69, 223, 190)",
        backgroundColor: "rgb(69, 223, 190, 0.5)",
        yAxisID: "y2",
        tension: 0.5,
      },
    ],
  };

  return (
    <div
      style={{
        width: "50%",
        height: "50vh",
        margin: "0 auto",
      }}
    >
      <Line data={statsData} options={options} />
    </div>
  );
};

export default AdminCharts;
