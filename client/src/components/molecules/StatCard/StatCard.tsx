import React from "react";
import Title from "antd/es/typography/Title";
import "./StatCard.scss";
import { Card } from "antd";
interface StatCardProps {
  title: string;
  value: number;
  icon: JSX.Element;
  backgroundColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, backgroundColor = "white" }) => {
  return (
    <Card className='stat-card' style={{ backgroundColor }}>
      {icon}
      <h3 className='stat-card-value'>{value}</h3>
      <Title className='stat-card-label' level={5}>
        {title}
      </Title>
    </Card>
  );
};

export default StatCard;
