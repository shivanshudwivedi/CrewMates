// src/components/StatisticsDashboard.tsx

import React from 'react';
import {
  Paper,
  Grid,
  Typography,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { Crewmate } from '../types';

interface StatisticsDashboardProps {
  crewmates: Crewmate[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const StatisticsDashboard = ({ crewmates }: StatisticsDashboardProps) => {
  const getRoleStats = () => {
    const stats = crewmates.reduce((acc: { [key: string]: number }, curr) => {
      acc[curr.role] = (acc[curr.role] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(stats).map(([name, value]) => ({ name, value }));
  };

  const getExperienceStats = () => {
    const stats = crewmates.reduce((acc: { [key: string]: number }, curr) => {
      acc[curr.experience] = (acc[curr.experience] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(stats).map(([name, value]) => ({ name, value }));
  };

  const getSpecialtyDistribution = () => {
    const stats = crewmates.reduce((acc: { [key: string]: number }, curr) => {
      acc[curr.specialty] = (acc[curr.specialty] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(stats).map(([name, value]) => ({
      name,
      count: value,
      percentage: (value / crewmates.length) * 100,
    }));
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Team Statistics
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Role Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={getRoleStats()}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    label
                  >
                    {getRoleStats().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Experience Levels
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={getExperienceStats()}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Specialty Distribution
              </Typography>
              {getSpecialtyDistribution().map((specialty) => (
                <div key={specialty.name}>
                  <Typography variant="body2" color="textSecondary">
                    {specialty.name} ({specialty.count})
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={specialty.percentage}
                    sx={{ mb: 1, height: 8, borderRadius: 5 }}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default StatisticsDashboard;