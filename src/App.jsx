import { useEffect, useState } from "react";
import { addRecord, deleteRecord, getAllRecords } from "../utils/supabasefunctions";
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
      let  newRecords = await getAllRecords();
      setRecords(newRecords)
      setTitle("");
      setTime("0");
      setError("");
    }
  };

  const onClickDeleteRecord = async (id) => {
    await deleteRecord(id)
    let  newRecords = await getAllRecords();
    setRecords(newRecords)
  }

  const sumTime = records.reduce((total, rec) => total + rec.time, 0);
  return (
    <>
     <title data-testid="title">Hello Jest</title>
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
          <p>データを取得中。。。。。</p>
        ) : (
          <ul>
            {records.map((record, index,id) => (
              <li key={index} className="list-style">
                <p>{record.title}</p>: {record.time}時間
                <button onClick={()=>onClickDeleteRecord(record.id)}>削除</button>
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
