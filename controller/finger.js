const mysql = require("mysql");

const getAndAddFinger = async (req, res) => {
  const connection = mysql.createConnection({
    connectionLimit: 10,
    host: "151.106.113.136",
    user: "nanang",
    password: "n4n@nGKA_DB",
    database: "hrtabang",
    // host: "localhost",
    // user: "root",
    // password: "",
    // database: "backendtabang",
  });
  function Parse_Data(data, p1, p2) {
    data = " " + data;
    let hasil = "";
    let awal = data.indexOf(p1);
    if (awal != -1) {
      let akhir = data.indexOf(p2, awal + 1);
      if (akhir != -1) {
        hasil = data.substring(awal + p1.length, akhir);
      }
    }
    return hasil;
  }

  const IP = "192.168.8.159";
  const Key = "0";

  const net = require("net");
  const client = new net.Socket();
  process.on("uncaughtException", (error) => {
    console.log(error);
    
  });

  client.connect(80, IP, function () {
    // console.log('Koneksi sukses');
    const soap_request =
      "<GetAttLog>\n" +
      '        <ArgComKey xsi:type="xsd:integer">' +
      Key +
      "</ArgComKey>\n" +
      '        <Arg><PIN xsi:type="xsd:integer">All</PIN></Arg>\n' +
      "        </GetAttLog>\n";

    const newLine = "\r\n";
    client.write("POST /iWsService HTTP/1.0" + newLine);
    client.write("Content-Type: text/xml" + newLine);
    client.write("Content-Length: " + soap_request.length + newLine + newLine);
    client.write(soap_request + newLine);
  });

  let buffer = "";
  client.on("data", function (data) {
    buffer += data;
  });
  client.on("end", function () {
    buffer = Parse_Data(buffer, "<GetAttLogResponse>", "</GetAttLogResponse>");
    buffer = buffer.split("\r\n");
    const users = [];
    for (let a = 0; a < buffer.length; a++) {
      let data = Parse_Data(buffer[a], "<Row>", "</Row>");
      let PIN = Parse_Data(data, "<PIN>", "</PIN>");
      let DateTime = Parse_Data(data, "<DateTime>", "</DateTime>");
      let Verified = Parse_Data(data, "<Verified>", "</Verified>");
      let Status = Parse_Data(data, "<Status>", "</Status>");
      users.push({
        id_finger: PIN,
        datetime: DateTime,
        verified: Verified,
        status: Status,
      });
    }
    if (users.length > 0) {
      users.shift();
      users.pop();
      const query =
        "INSERT INTO hrparentfingerkaryawan (id_finger, datetime, verified,status) VALUES ? ON DUPLICATE KEY UPDATE  verified = VALUES(verified), status = VALUES(status)";

      connection.query(
        query,
        [
          users.map((user) => [
            user.id_finger,
            user.datetime,
            user.verified,
            user.status,
          ]),
        ],
        (error, results, fields) => {
          if (error) throw error;
          // console.log("Complete " + results.affectedRows + " rows");

          res.status(200).json({
            message: "Complete " + results.affectedRows + " rows",
            success: 1,
          });
        }
      );

      connection.end();
      // res.json(users);
      // res.end();
    }
  });
};
// Add headers before the routes are defined
module.exports = { getAndAddFinger };
