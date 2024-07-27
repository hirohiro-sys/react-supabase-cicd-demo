import App from "../App";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

describe("テストの練習", () => {

  test("タイトルが正常に表示されているか", () => {
    render(<App />);
    const titleElement = screen.getByTestId("test-title");
    expect(titleElement).toBeInTheDocument();
  });

  test("入力されていない項目がある場合にエラーが表示されるか", async () => {
    render(<App />);
    const addButton = screen.getByText("登録");
    fireEvent.click(addButton);
    await waitFor(() => {
      expect(
        screen.getByText("入力されていない項目があります")
      ).toBeInTheDocument();
    });
  });

  test("要素が削除されること", async () => {
    render(<App />);

    await waitFor(() => screen.getAllByTestId("record-list"));
    let records = screen.getAllByTestId("record-list")[0].querySelectorAll("li");
    const initialRecordCount = records.length;

    const deleteButtons = screen.getAllByText("削除");
    fireEvent.click(deleteButtons[0]);

  
    await waitFor(() => {
      records = screen.getAllByTestId("record-list")[0].querySelectorAll("li");
      expect(records.length).toBe(initialRecordCount - 1); 
    });
  });

  test("要素が追加されること", async () => {
    render(<App />);
  
    await waitFor(() => screen.getAllByTestId("record-list"));

    const titleInput = screen.getByPlaceholderText("学習内容を入力");
    const timeInput = screen.getByPlaceholderText("時間を入力");
    const addButton = screen.getByText("登録");
  
    // レコード追加前の要素数を取得
    const recordsBefore = screen.getAllByTestId("record-list")[0].querySelectorAll("li").length;
  
    fireEvent.change(titleInput, { target: { value: "新しい学習" } });
    fireEvent.change(timeInput, { target: { value: "120" } });
    fireEvent.click(addButton);
  
    // レコード追加後の要素数を取得し、増加を確認
    await waitFor(() => {
      const recordsAfter = screen.getAllByTestId("record-list")[0].querySelectorAll("li").length;
      expect(recordsAfter).toBe(recordsBefore + 1);
    });
  });

});