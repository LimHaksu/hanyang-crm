import db from "./db";

export function addPhoneRecord(receivedDatetime: string, cidMachineIdx: number, phoneNumber: string) {
    const query = `INSERT INTO 
    phone_call_record(received_datetime, phone_number, cid_machine_idx)
    VALUES(?,?,?)`;
    db.serialize(function () {
        const stmt = db.prepare(query);
        stmt.run(receivedDatetime, phoneNumber, cidMachineIdx);
        stmt.finalize();
    });
}
