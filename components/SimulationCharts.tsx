import React from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { YearlyData } from '../types';

interface SimulationChartsProps {
  data: YearlyData[];
  paybackYear: number;
}

export const SimulationCharts: React.FC<SimulationChartsProps> = ({ data, paybackYear }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-horizon-100">
      <h3 className="text-xl font-bold text-horizon-900 mb-6 flex items-center">
        <svg className="w-6 h-6 mr-2 text-solar-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
        Flux Financier & ROI
      </h3>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="year" tick={{fontSize: 12, fill: '#627d98'}} tickLine={false} axisLine={false} />
            <YAxis tickFormatter={(value) => `${value/1000}k€`} tick={{fontSize: 12, fill: '#627d98'}} tickLine={false} axisLine={false} />
            <Tooltip 
              formatter={(value: number, name: string) => {
                const label = name === 'cumulativeNetGain' ? 'Cashflow Cumulé' : 'Gain Annuel';
                return [`${value.toLocaleString('fr-BE')} €`, label];
              }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontFamily: 'Montserrat' }}
              itemStyle={{ color: '#102a43' }}
            />
            <ReferenceLine y={0} stroke="#9fb3c8" />
            <ReferenceLine 
              x={paybackYear} 
              stroke="#76bc21" 
              strokeDasharray="3 3"
              strokeWidth={2}
              label={{ value: 'Rentabilité', position: 'insideTopLeft', fill: '#76bc21', fontSize: 12, fontWeight: 600 }} 
            />
            {/* Horizon Blue Bars for Annual Gain */}
            <Bar dataKey="annualGain" fill="#243b53" barSize={10} radius={[4, 4, 0, 0]} opacity={0.3} />
            {/* Solar Green Line for Cumulative */}
            <Line 
              type="monotone" 
              dataKey="cumulativeNetGain" 
              stroke="#76bc21" 
              strokeWidth={4}
              dot={false}
              activeDot={{ r: 6, fill: '#76bc21', stroke: '#fff', strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <p className="text-sm text-horizon-500 mt-4 text-center font-medium">
        La ligne <span className="text-solar-600 font-bold">verte</span> représente votre bénéfice net cumulé.
      </p>
    </div>
  );
};