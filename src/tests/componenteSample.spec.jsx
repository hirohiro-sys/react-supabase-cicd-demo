// import App from "../App";
// import React from "react";
// import '@testing-library/jest-dom'
// import { render, screen } from "@testing-library/react";

// // タイトルが正常に表示されているか
// describe("Title Test", () => {
//   it("タイトルがHello Jestであること", () => {
//     // testId(title)を指定して取得
//     render(<App />);
//     const title = screen.getByTestId("title");
//     expect(title).toHaveTextContent("Hello Jest");
//   });
// });

// App.test.jsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import { addRecord, deleteRecord, getAllRecords } from '../utils/supabasefunctions';

// Mock supabasefunctions
jest.mock('../utils/supabasefunctions', () => ({
  addRecord: jest.fn(),
  deleteRecord: jest.fn(),
  getAllRecords: jest.fn(),
}));

describe('App Component', () => {
  beforeEach(() => {
    getAllRecords.mockResolvedValue([]);
  });

  it('renders title correctly', () => {
    render(<App />);
    const titleElement = screen.getByTestId('title');
    expect(titleElement).toBeInTheDocument();
    expect(titleElement.textContent).toBe('Hello Jest');
  });

  it('adds a record when form is submitted with valid input', async () => {
    render(<App />);
    
    const inputTitle = screen.getByRole('textbox', { name: /学習内容/i });
    const inputTime = screen.getByRole('spinbutton', { name: /学習時間/i });
    const addButton = screen.getByRole('button', { name: /登録/i });

    fireEvent.change(inputTitle, { target: { value: 'Test Title' } });
    fireEvent.change(inputTime, { target: { value: '2' } });
    fireEvent.click(addButton);

    expect(addRecord).toHaveBeenCalledWith('Test Title', '2');
    await waitFor(() => {
      expect(screen.getByText(/Test Title/)).toBeInTheDocument();
      expect(screen.getByText(/2時間/)).toBeInTheDocument();
    });
  });

  it('displays error when form is submitted with empty input', async () => {
    render(<App />);
    
    const addButton = screen.getByRole('button', { name: /登録/i });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText(/入力されていない項目があります/)).toBeInTheDocument();
    });
  });

  it('deletes a record when delete button is clicked', async () => {
    const mockRecords = [
      { id: 1, title: 'Record 1', time: 3 },
      { id: 2, title: 'Record 2', time: 1 },
    ];
    getAllRecords.mockResolvedValue(mockRecords);
    
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText(/Record 1/)).toBeInTheDocument();
    });

    const deleteButton = screen.getByRole('button', { name: /削除/i });
    fireEvent.click(deleteButton);

    expect(deleteRecord).toHaveBeenCalledWith(1);
    await waitFor(() => {
      expect(screen.queryByText(/Record 1/)).not.toBeInTheDocument();
    });
  });
});
