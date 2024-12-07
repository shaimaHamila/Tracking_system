import React from "react";
import { RiProjectorLine, RiBugLine, RiTimerLine, RiCheckboxCircleLine, RiCloseCircleLine } from "react-icons/ri";
import "./AdminDashboard.scss";
import StatCard from "../../components/molecules/StatCard/StatCard";
import { GoProjectRoadmap } from "react-icons/go";

const AdminDashboard: React.FC = () => {
  const stats = [
    {
      label: "Total Projects",
      value: 10,
      bgColor: "#e3f2fd",
      icon: <GoProjectRoadmap className='stat-card-icon' />,
    },
    {
      label: "Tickets Opened",
      value: 40,
      bgColor: "#f1f8e9",
      icon: <RiBugLine className='stat-card-icon' />,
    },
    {
      label: "Tickets In Progress",
      value: 31,
      bgColor: "#e8f5e9",
      icon: <RiTimerLine className='stat-card-icon' />,
    },
    {
      label: "Tickets Resolved",
      value: 740,
      bgColor: "#fffde7",
      icon: <RiCheckboxCircleLine className='stat-card-icon' />,
    },
    {
      label: "Tickets Closed",
      value: 205,
      bgColor: "#fbe9e7",
      icon: <RiCloseCircleLine className='stat-card-icon' />,
    },
  ];

  return (
    <div className='admin-dashboard'>
      <div className='dashboard-stat-cards-container'>
        {stats.map((stat, index) => (
          <StatCard key={index} title={stat.label} value={stat.value} icon={stat.icon} backgroundColor={stat.bgColor} />
        ))}
      </div>
      <div className='dashboard-quote-container'>
        <div className='dashboard-quote-div'>
          <div className='dashboard-quote-section'>
            <h3 className='dashboard-quote'>“The best way to predict the future is to create it.”</h3>
            <p className='dashboard-quote-author'>- Peter Drucker</p>
          </div>
        </div>
        {/* <div className='dashboard-image-container'> */}
        <img src='/public/png/dashboardImg.png' className='dashboard-image' alt='Dashboard Illustration' />
        {/* </div> */}
      </div>
    </div>
  );
};

export default AdminDashboard;
