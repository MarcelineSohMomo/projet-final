import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminCharts = ({ user, data, role }) => {
  const { firstname, lastname } = user;

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: role
          ? "Les Statistiques de vos Services"
          : `Statistiques pour les services de ${lastname + " " + firstname} (${
              user.role
            })`,
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
      },
      {
        label: "Nombres de Favoris",
        data: data.map((service) => service.noLikes),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        yAxisID: "y1",
      },
      {
        label: "Nombres de Commandes",
        data: data.map((service) => service.noCommandes),
        borderColor: "rgb(69, 223, 190)",
        backgroundColor: "rgb(69, 223, 190, 0.5)",
        yAxisID: "y2",
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
      <Bar data={statsData} options={options} />
    </div>
  );
};

export default AdminCharts;
