
import { render, screen, fireEvent, act } from '@testing-library/react';
import { AnalysisProgressModal } from './AnalysisProgressModal';
import { useUIStore } from '@/state/store';

// Mock the store
jest.mock('@/state/store', () => ({
  useUIStore: jest.fn()
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
  },
  useReducedMotion: () => false
}));

describe('AnalysisProgressModal', () => {
  const mockOnCancel = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Setup the store mock
    (useUIStore as jest.Mock).mockReturnValue({
      progress: 50,
      analysisModalOpen: true,
      setAnalysisModalOpen: jest.fn(),
    });
  });

  test('renders the modal with correct content', () => {
    render(<AnalysisProgressModal onCancel={mockOnCancel} jobId="test-123" />);
    
    // Check for main elements
    expect(screen.getByText('Analyzing Contract...')).toBeInTheDocument();
    expect(screen.getByText('This may take a few minutes')).toBeInTheDocument();
    expect(screen.getByText(/Running Mythril Analysis/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
  });

  test('calls onCancel when Cancel button is clicked', () => {
    render(<AnalysisProgressModal onCancel={mockOnCancel} jobId="test-123" />);
    
    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  test('shows different status messages based on progress', () => {
    // Test with 20% progress
    (useUIStore as jest.Mock).mockReturnValue({
      progress: 20,
      analysisModalOpen: true,
      setAnalysisModalOpen: jest.fn(),
    });
    
    const { rerender } = render(<AnalysisProgressModal onCancel={mockOnCancel} jobId="test-123" />);
    expect(screen.getByText(/Running Slither Analysis/)).toBeInTheDocument();
    
    // Test with 70% progress
    (useUIStore as jest.Mock).mockReturnValue({
      progress: 70,
      analysisModalOpen: true,
      setAnalysisModalOpen: jest.fn(),
    });
    
    rerender(<AnalysisProgressModal onCancel={mockOnCancel} jobId="test-123" />);
    expect(screen.getByText(/Checking Avalanche-specific rules/)).toBeInTheDocument();
    
    // Test with 100% progress
    (useUIStore as jest.Mock).mockReturnValue({
      progress: 100,
      analysisModalOpen: true,
      setAnalysisModalOpen: jest.fn(),
    });
    
    rerender(<AnalysisProgressModal onCancel={mockOnCancel} jobId="test-123" />);
    expect(screen.getByText(/Analysis Complete/)).toBeInTheDocument();
  });

  test('auto-dismisses when progress reaches 100%', () => {
    jest.useFakeTimers();
    
    const mockSetAnalysisModalOpen = jest.fn();
    (useUIStore as jest.Mock).mockReturnValue({
      progress: 100,
      analysisModalOpen: true,
      setAnalysisModalOpen: mockSetAnalysisModalOpen,
    });
    
    render(<AnalysisProgressModal onCancel={mockOnCancel} jobId="test-123" />);
    
    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    expect(mockSetAnalysisModalOpen).toHaveBeenCalledWith(false);
    
    jest.useRealTimers();
  });
});
