import { useEffect, useState } from "react";
import { getAllRecords } from "../utils/supabasefunctions";
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

  const onClickAddRecord = () => {
    if ((title === "") | (time === "")) {
      setError("入力されていない項目があります");
      return;
    } else {
      const newRecords = [...records, { title, time: parseInt(time) || 0 }];
      setRecords(newRecords);
      setTitle("");
      setTime("0");
      setError("");
    }
  };
  const sumTime = records.reduce((total, rec) => total + rec.time, 0);
  return (
    <>
      <div className="title">
        <p>学習内容</p>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="time">
        <p>学習時間</p>
        <input
          type="number"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <p>時間</p>
      </div>

      <p>入力されている学習内容: {title}</p>
      <p>入力されている学習時間: {time}時間</p>

      <div>
        <h1>学習記録一覧</h1>
        {isLoading ? (
          <p>データを取得しています。</p>
        ) : (
          <ul>
            {records.map((record, index) => (
              <li key={index}>
                <p>{record.title}</p>: {record.time}時間
              </li>
            ))}
          </ul>
        )}
        <button onClick={onClickAddRecord}>登録</button>
        <p>{error}</p>
        <p>合計時間: {sumTime}/1000(h)</p>
      </div>
    </>
  );
}

export default App;
