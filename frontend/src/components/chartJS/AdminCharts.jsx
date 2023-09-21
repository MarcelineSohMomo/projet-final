import React from "react";

const AdminCharts = ({ user, data }) => {
  const { firstname, lastname, role } = user;
  return (
    <div>
      <h4>
        Statistiques pour les services de {lastname + " " + firstname} ({role})
      </h4>
    </div>
  );
};

export default AdminCharts;
