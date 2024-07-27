import App from "../App";
import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { getAllRecords,deleteRecord } from "../../utils/supabasefunctions";

// supabase関数をモック化
jest.mock("../../utils/supabasefunctions", () => ({
  getAllRecords: jest.fn(),
  addRecord: jest.fn(), 
  deleteRecord: jest.fn()
}));

describe('テストの練習', () => {
  test('タイトルが正常に表示されているか', () => {
    render(<App />);
    const titleElement = screen.getByTestId('test-title');
    expect(titleElement).toBeInTheDocument();
  });

  test('入力されていない項目がある場合にエラーが表示されるか', async () => {
    // getAllRecords のモックの返り値を設定する(これないとエラーなる)
    getAllRecords.mockResolvedValue([]);

    render(<App />);
    const addButton = screen.getByText('登録');
    fireEvent.click(addButton);
    await waitFor(() => {
      expect(screen.getByText('入力されていない項目があります')).toBeInTheDocument();
    });
  });

  test("レコードが3つ表示されること", async () => {
    getAllRecords.mockResolvedValue([
      { id: 1, title: "title1", time: 3 },
      { id: 2, title: "title2", time: 4 },
      { id: 3, title: "title3", time: 3 }
    ]);
    render(<App />);
    await waitFor(() => screen.getAllByTestId("record-list"));
    const records = screen.getAllByTestId("record-list")[0].querySelectorAll("li");
    expect(records.length).toBe(3);
  });

  test("レコードが削除されたらリストが1つ減っていること", async () => {
    getAllRecords.mockResolvedValue([
      { id: 1, title: "title1", time: 3 },
      { id: 2, title: "title2", time: 4 },
      { id: 3, title: "title3", time: 3 }
    ]);
    
    render(<App />);
    
    await waitFor(() => screen.getAllByTestId("record-list"));
    
    let records = screen.getAllByTestId("record-list")[0].querySelectorAll("li");
    expect(records.length).toBe(3);
    
    await deleteRecord(3);
    
    await waitFor(() => screen.getAllByTestId("record-list"));
    
    records = screen.getAllByTestId("record-list")[0].querySelectorAll("li");
    expect(records.length).toBe(2);
  });
  
});