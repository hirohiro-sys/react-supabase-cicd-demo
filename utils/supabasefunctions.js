import {supabase}  from "../utils/supabase"

// 全レコードを取得
export const getAllRecords = async () => {
    const records = await supabase.from("study-record").select("*");
    return records.data;
}

// レコードを追加
export const addRecord = async (title,time) => {
    await supabase.from("study-record").insert({title,time})
}

// レコードを削除
export const deleteRecord = async (id) => {
    await supabase.from("study-record").delete().eq("id",id);
}