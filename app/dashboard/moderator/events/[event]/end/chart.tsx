'use client'
import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);


const options: ChartOptions<'doughnut'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
            position: 'bottom',
            labels: {
                padding: 20,
                font: {
                    size: 14,
                    family: "'Inter', sans-serif"
                },
                usePointStyle: true,
                pointStyle: 'circle',
                color: 'rgba(107, 114, 128, 1)' // Default gray-500
                }
            },
        tooltip: {
            backgroundColor: 'rgb(30, 41, 59)', // slate-800
            titleColor: 'rgb(248, 250, 252)', // slate-50
            bodyColor: 'rgb(226, 232, 240)', // slate-200
            titleFont: {
                size: 16,
                weight: 'bold'
            } as const,
            bodyFont: {
                size: 14
            } as const,
                padding: 12,
                cornerRadius: 8,
                displayColors: false
            }
        },
        cutout: '70%',
        animation: {
            animateScale: true,
            animateRotate: true
        }
    };

export function DoughnutChart({data}:{data:{present:number,absent:number}}) {
const data2 = {
  labels: ['Present', 'Absent'],
  datasets: [
    {
      label: 'Attendance',
      data: [data.present, data.absent],
      backgroundColor: [
        'rgba(75, 192, 192, 0.8)',
        'rgba(255, 99, 132, 0.8)',
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 99, 132, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-md dark:shadow-gray-900/50 p-6 w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Attendance Overview</h3>
      </div>
      
      <div className="relative h-64">
        <Doughnut data={data2} options={options} />
      </div>
      
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Present</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{data.present}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Students</div>
        </div>
        
        <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Absent</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{data.absent}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Students</div>
        </div>
      </div>
    </div>
  )
}