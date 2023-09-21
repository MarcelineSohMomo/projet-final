import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../../api";
import ServerMessage from "../../components/serverMessage/ServerMessage";
import { Row, Col, Carousel } from "react-bootstrap";
import Loading from "../../components/loading/Loading";
import { useTable } from "react-table";
import { getToken, getUser } from "../../util";
import AdminCharts from "../../components/chartJS/AdminCharts";

const Statistics = () => {
  const [error, setError] = useState();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [auser, setAuser] = useState();
  const [stats, setStats] = useState();
  const token = getToken();
  const userID = getUser()._id;

  const getUsers = async () => {
    setLoading(true);
    try {
      const res = await api.getUsers({
        headers: {
          Authorization: `Bearer ${token}`,
          id: userID,
        },
      });
      const usersWithRole = res.data.map((user) => ({
        ...user,
        role: user.roles[0].name,
      }));
      setUsers(usersWithRole);
    } catch (error) {
      error.response
        ? setError(error.response.data.message)
        : setError("Une erreur s'est produite!");
    } finally {
      setLoading(false);
    }
  };

  const getStatistics = async (id) => {
    setLoading(true);
    try {
      const res = await api.getStats({
        headers: {
          Authorization: `Bearer ${token}`,
          id,
        },
      });
      setStats(res.data);
    } catch (error) {
      error.response
        ? setError(error.response.data.message)
        : setError("Une erreur s'est produite!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div
      className="service-dashboard"
      style={{ height: "90vh", overflowY: "scroll" }}
    >
      {error && <p className="text-danger">{error}</p>}
      {/* get all users who are not customers on click of user, hit endpoint to get chart data and display charts for that user's services */}
      <table className="table">
        <thead>
          <tr className="title">
            <th>First name</th>
            <th>Last name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users
            .filter((user) => user.role !== "customer")
            .map((user) => (
              <tr key={user._id}>
                <td className="text-table">{user.firstname}</td>
                <td className="text-table">{user.lastname}</td>
                <td className="text-table">{user.phone}</td>
                <td className="text-table">{user.email}</td>
                <td className="text-table">{user.role}</td>
                <td className="">
                  <button
                    onClick={() => {
                      getStatistics(user._id);
                      setAuser(user);
                      const element = document.getElementById("graphs");
                      if (element) {
                        // 👇 Will scroll smoothly to the top of the next section
                        element.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="btn btn-secondary"
                  >
                    Statistiques
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div id="graphs" className="mt-4">
        {stats && <AdminCharts data={stats} user={auser} />}
      </div>
      {loading && <Loading />}
    </div>
  );
};

export default Statistics;
