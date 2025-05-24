import axios from 'axios';
import { AnalysisResult } from './analysis';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface ReportOut {
  id: number;
  audit_id: number;
  generated_at: string;
  format: string;
  content: string;
}

export const fetchReports = async (skip = 0, limit = 100): Promise<ReportOut[]> => {
  try {
    const response = await axios.get(`${API_URL}/reports/?skip=${skip}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }
};

export const exportReportsCsv = async (skip = 0, limit = 100): Promise<Blob> => {
  try {
    const response = await axios.get(`${API_URL}/reports/export/csv?skip=${skip}&limit=${limit}`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('Error exporting reports to CSV:', error);
    throw error;
  }
};

export const exportReportsPdf = async (skip = 0, limit = 100): Promise<Blob> => {
  try {
    const response = await axios.get(`${API_URL}/reports/export/pdf?skip=${skip}&limit=${limit}`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('Error exporting reports to PDF:', error);
    throw error;
  }
};
