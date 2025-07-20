// components/Dashboard.js
import React, { useState, useEffect } from "react";

const ITEMS_PER_PAGE = 5;

const Dashboard = ({ user, onLogout }) => {
  const [intakes, setIntakes] = useState([]);
  const [amount, setAmount] = useState("");
  const [page, setPage] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [diff, setDiff] = useState(null);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users"));
    setIntakes(users[user]?.intakes || []);
  }, [user]);

  const saveIntakes = (newIntakes) => {
    const users = JSON.parse(localStorage.getItem("users"));
    users[user].intakes = newIntakes;
    localStorage.setItem("users", JSON.stringify(users));
    setIntakes(newIntakes);
  };

  const handleAddIntake = () => {
    const today = new Date().toISOString().split("T")[0];
    const alreadyAdded = intakes.some((entry) => entry.date === today);
    if (alreadyAdded) return alert("Entry for today already exists");
    const newIntake = {
      date: today,
      time: new Date().toLocaleTimeString(),
      amount: Number(amount),
      id: Date.now(),
    };
    saveIntakes([newIntake, ...intakes]);
    setAmount("");
  };

  const handleDelete = (id) => {
    saveIntakes(intakes.filter((entry) => entry.id !== id));
  };

  const handleEdit = (id, newAmount) => {
    const updated = intakes.map((entry) =>
      entry.id === id ? { ...entry, amount: Number(newAmount) } : entry
    );
    saveIntakes(updated);
  };

  const handleCompare = () => {
    const filtered = intakes.filter(
      (i) => i.date >= startDate && i.date <= endDate
    );
    const total = filtered.reduce((acc, curr) => acc + curr.amount, 0);
    setDiff(total);
  };

  const paginated = intakes.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  );

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">
        <img
          src="https://readme-typing-svg.herokuapp.com/?font=Righteous&size=35&center=true&vCenter=true&width=500&height=70&duration=4000&lines=Hi+There!+👋;+I'm+HydroTrack!;"
          alt="typing"
          className="img-fluid"
        />
      </h1>

      <div className="row justify-content-center">
        <div className="col-md-6">

          {/* Intake Form */}
          <div className="card p-3 mb-3 shadow-sm">
            <h5 className="text-center">Add Daily Water Intake</h5>
            <div className="input-group mt-2">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="form-control"
                placeholder="Enter amount in ml"
              />
              <button onClick={handleAddIntake} className="btn btn-primary">
                Add
              </button>
            </div>
          </div>

          {/* Intake List */}
          <div className="card p-3 mb-3 shadow-sm">
            <h5 className="text-center">Your Intakes</h5>
            {paginated.map((entry) => (
              <div
                key={entry.id}
                className="d-flex justify-content-between align-items-center border-bottom py-2"
              >
                <div>
                  {entry.date} {entry.time} - {entry.amount} ml
                </div>
                <div>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="btn btn-sm btn-danger me-2"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      const newAmount = prompt("Edit amount:", entry.amount);
                      if (newAmount) handleEdit(entry.id, newAmount);
                    }}
                    className="btn btn-sm btn-secondary"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
            <div className="mt-3 text-center">
              {Array.from({
                length: Math.ceil(intakes.length / ITEMS_PER_PAGE),
              }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className="btn btn-outline-primary btn-sm me-1"
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Compare Between Dates */}
          <div className="card p-3 shadow-sm">
            <h5 className="text-center">Compare Intake Between Dates</h5>
            <div className="row mb-2">
              <div className="col">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="col">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="col">
                <button onClick={handleCompare} className="btn btn-info w-100">
                  Compare
                </button>
              </div>
            </div>
            {diff !== null && (
              <div className="alert alert-success text-center">
                Total Intake: {diff} ml
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
