import { useEffect, useState } from "react";
import {
  addRecord,
  deleteRecord,
  getAllRecords,
} from "../utils/supabasefunctions";
import "./App.css";

function App() {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("0");
  const [records, setRecords] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getRecords = async () => {
      setIsLoading(true);
      const records = await getAllRecords();
      setRecords(records);
      setIsLoading(false);
    };
    getRecords();
  }, []);

  const onClickAddRecord = async (e) => {
    e.preventDefault();
    if ((title === "") | (time === "")) {
      setError("入力されていない項目があります");
      return;
    } else {
      await addRecord(title, time);
      let newRecords = await getAllRecords();
      setRecords(newRecords);
      setTitle("");
      setTime("0");
      setError("");
    }
  };

  const onClickDeleteRecord = async (id) => {
    await deleteRecord(id);
    let newRecords = await getAllRecords();
    setRecords(newRecords);
  };

  const sumTime = records.reduce((total, rec) => total + rec.time, 0);
  return (
    <>
      <title data-testid="test-title">Hello Jest</title>
      <div className="title">
        <p>学習内容</p>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="学習内容を入力"
          data-testid="study-title"
        />
      </div>
      <div className="time">
        <p>学習時間</p>
        <input
          type="number"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          placeholder="時間を入力"
          data-testid="study-time"
        />
        <p>時間</p>
      </div>

      <p>学習内容: {title}</p>
      <p>学習時間: {time}時間</p>

        <h1>学習記録一覧</h1>
      <div>
        {isLoading ? (
          <p>データを取得中。。。。。</p>
          ) : (

          <ul data-testid="record-list">
            {records.map((record, index) => (
              <li key={index} className="list-style">
                <p>{record.title}</p>: {record.time}時間
                <button onClick={() => onClickDeleteRecord(record.id)} data-testid="delete-button">
                  削除
                </button>
              </li>
            ))}
          </ul>
          
        )}
        <button onClick={onClickAddRecord} data-testid="register-button">登録</button>
        <p>{error}</p>
        <p>合計時間: {sumTime}/1000(h)</p>
      </div>
    </>
  );
}

export default App;
