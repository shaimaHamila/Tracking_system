import React, { useEffect, useState } from "react";
import { RiBugLine, RiTimerLine, RiCheckboxCircleLine, RiCloseCircleLine } from "react-icons/ri";
import "./Dashboard.scss";
import StatCard from "../../components/molecules/StatCard/StatCard";
import { GoProjectRoadmap } from "react-icons/go";
import { useFetchStats } from "../../features/stats/StatsHooks";
const quotes = [
  { text: "“The best way to predict the future is to create it.”", author: "- Peter Drucker" },
  { text: "“Success is not the key to happiness. Happiness is the key to success.”", author: "- Albert Schweitzer" },
  {
    text: "“The only limit to our realization of tomorrow will be our doubts of today.”",
    author: "- Franklin D. Roosevelt",
  },
  { text: "“Don’t watch the clock; do what it does. Keep going.”", author: "- Sam Levenson" },
  { text: "“Action is the foundational key to all success.”", author: "- Pablo Picasso" },
];
const Dashboard: React.FC = () => {
  const { data: satsData } = useFetchStats();

  const stats = satsData?.data
    ? [
        {
          label: "Total Projects",
          value: satsData.data.totalProjects,
          bgColor: "#e3f2fd",
          icon: <GoProjectRoadmap className='stat-card-icon' />,
        },
        {
          label: "Tickets Opened",
          value: satsData?.data?.tickets?.opened,
          bgColor: "#f1f8e9",
          icon: <RiBugLine className='stat-card-icon' />,
        },
        {
          label: "Tickets In Progress",
          value: satsData.data.tickets.inProgress,
          bgColor: "#e8f5e9",
          icon: <RiTimerLine className='stat-card-icon' />,
        },
        {
          label: "Tickets Resolved",
          value: satsData.data.tickets.resolved,
          bgColor: "#fffde7",
          icon: <RiCheckboxCircleLine className='stat-card-icon' />,
        },
        {
          label: "Tickets Closed",
          value: satsData.data.tickets.closed,
          bgColor: "#fbe9e7",
          icon: <RiCloseCircleLine className='stat-card-icon' />,
        },
      ]
    : [];
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 60000); // Update every minute (60000 ms)
    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  const currentQuote = quotes[currentQuoteIndex];

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
            <h3 className='dashboard-quote'>{currentQuote?.text}</h3>
            <p className='dashboard-quote-author'>{currentQuote?.author}</p>
          </div>
        </div>
        {/* <div className='dashboard-image-container'> */}
        <img src='/public/png/dashboardImg.png' className='dashboard-image' alt='Dashboard Illustration' />
        {/* </div> */}
      </div>
    </div>
  );
};

export default Dashboard;
