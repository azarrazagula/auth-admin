import { render, screen, fireEvent } from '@testing-library/react';
import Modal from './Modal';

describe('Modal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
    title: 'Test Modal',
    message: 'This is a test message',
    isConfirming: false,
  };

  test('does not render when isOpen is false', () => {
    render(<Modal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
  });

  test('renders title and message correctly', () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('This is a test message')).toBeInTheDocument();
  });

  test('calls onClose when Cancel button is clicked', () => {
    render(<Modal {...defaultProps} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  test('calls onConfirm when Proceed button is clicked', () => {
    render(<Modal {...defaultProps} />);
    fireEvent.click(screen.getByText('Yes, Proceed'));
    expect(defaultProps.onConfirm).toHaveBeenCalled();
  });

  test('shows processing state and disables buttons when isConfirming is true', () => {
    render(<Modal {...defaultProps} isConfirming={true} />);
    
    const confirmBtn = screen.getByText('Processing...');
    const cancelBtn = screen.getByText('Cancel');
    
    expect(confirmBtn).toBeInTheDocument();
    expect(confirmBtn).toBeDisabled();
    expect(cancelBtn).toBeDisabled();
  });

  test('calls onClose when overlay is clicked', () => {
    const { container } = render(<Modal {...defaultProps} />);
    const overlay = container.querySelector('.modal-overlay');
    fireEvent.click(overlay);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  test('does not call onClose when content is clicked', () => {
    const { container } = render(<Modal {...defaultProps} />);
    const content = container.querySelector('.modal-content');
    fireEvent.click(content);
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });
});
