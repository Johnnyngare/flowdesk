const gridColor = 'rgba(26,32,53,0.8)'
const tickColor = '#6b7280'
const tooltipBg = '#0b0f1a'
const tooltipBorder = '#1a2035'

export const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        color: '#9ca3af',
        padding: 20,
        font: { size: 12 },
        usePointStyle: true,
      },
    },
    tooltip: {
      backgroundColor: tooltipBg,
      borderColor: tooltipBorder,
      borderWidth: 1,
      titleColor: '#f1f5f9',
      bodyColor: '#9ca3af',
      padding: 12,
    },
  },
}

export const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: tooltipBg,
      borderColor: tooltipBorder,
      borderWidth: 1,
      titleColor: '#f1f5f9',
      bodyColor: '#9ca3af',
      padding: 12,
    },
  },
  scales: {
    x: {
      grid: { color: gridColor },
      ticks: { color: tickColor, font: { size: 11 } },
    },
    y: {
      grid: { color: gridColor },
      ticks: {
        color: tickColor,
        font: { size: 11 },
        stepSize: 1,
      },
      beginAtZero: true,
    },
  },
}

export const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: tooltipBg,
      borderColor: tooltipBorder,
      borderWidth: 1,
      titleColor: '#f1f5f9',
      bodyColor: '#9ca3af',
      padding: 12,
    },
  },
  scales: {
    x: {
      grid: { color: 'transparent' },
      ticks: { color: tickColor, font: { size: 11 } },
    },
    y: {
      grid: { color: gridColor },
      ticks: {
        color: tickColor,
        font: { size: 11 },
        stepSize: 1,
      },
      beginAtZero: true,
    },
  },
}