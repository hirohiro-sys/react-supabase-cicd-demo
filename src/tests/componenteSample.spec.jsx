import App from "../App";
import React from "react";
import {userEvent, render, screen, fireEvent, waitFor } from "@testing-library/react";
import { deleteRecord } from "../../utils/supabasefunctions";

const mockGetAllRecords = jest.fn().mockResolvedValue([
  { id: 1, title: "title1", time: 3 },
  { id: 2, title: "title2", time: 4 },
  { id: 3, title: "title3", time: 3 },
]);

const mockDeleteRecord = jest.fn();

jest.mock("../../utils/supabasefunctions", () => {
  return {
    getAllRecords: () => mockGetAllRecords(),
    deleteRecord: () => mockDeleteRecord()
  };
});

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

  test("レコードが3つ表示されること", async () => {
    render(<App />);
    await waitFor(() => screen.getAllByTestId("record-list"));
    const records = screen.getAllByTestId("record-list")[0].querySelectorAll("li");
    expect(records.length).toBe(3);
  });

});
