import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './chartStatistic.scss'

const ChartStatistics = ({ commandsByService }) => {
  const [chartType, setChartType] = useState('bar');
  const [active, setActive] = useState(true);

  if (!commandsByService) {
    return <div>Aucune donnée disponible.</div>;
  }

  const statusData = Object.keys(commandsByService).map((status) => {
    const commands = commandsByService[status];
    const totalPrice = commands.reduce((total, command) => total + command.price, 0);
    return { status, totalPrice };
  });

  const handleChartTypeChange = (type) => {
    setActive(!active)
    setChartType(type);
  };

  const renderChart = () => {
    if (chartType === 'bar') {
      return (
        <BarChart width={600} height={400} data={statusData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="status" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalPrice" fill="#45dfbe6a" />
        </BarChart>
      );
    } else if (chartType === 'line') {
      return (
        <LineChart width={600} height={400} data={statusData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="status" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="totalPrice" stroke="#45dfbe6a" />
        </LineChart> 
      );
    }
  };

  return (
    <div className='graphics'>
      <div className='row '>
        <div className="col d-flex justify-content-center">
          <button className={`change-graphics ${active} ? active-btn : remove-active`} onClick={() => handleChartTypeChange('bar')}>Graphique en barres</button>
          <button className={`change-graphics !${active} ?  remove-active : active-btn`} onClick={() => handleChartTypeChange('line')}>Graphique en ligne</button>
        </div>
      </div>
      {renderChart()}<br />
    </div>
  );
};

export default ChartStatistics;
