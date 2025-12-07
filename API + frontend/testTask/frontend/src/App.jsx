// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App

// import { useState } from "react";

// export default function App() {
//   const [selectedDate, setSelectedDate] = useState("");
//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalText, setModalText] = useState("");

//   // Отправка POST-запроса на Django
//   const sendRequest = async () => {
//     try {
//       const response = await fetch("http://127.0.0.1:8000/api/load/", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ date: selectedDate }),
//       });

//       const data = await response.json();

//       // Текст, полученный от Django
//       setModalText(data.message);
//     } catch (error) {
//       setModalText("Ошибка соединения с сервером");
//     }

//     setModalOpen(true); // Открыть модальное окно
//   };

//   const handleClose = () => setModalOpen(false);

//   return (
//     <div style={styles.page}>
//       <div style={styles.card}>
//         <h1 style={styles.title}>Выбор даты</h1>

//         <input
//           type="date"
//           value={selectedDate}
//           onChange={(e) => setSelectedDate(e.target.value)}
//           style={styles.input}
//         />

//         <button type="button" onClick={sendRequest} style={styles.button}>
//           Выгрузить
//         </button>
//       </div>

//       {modalOpen && (
//         <div style={styles.overlay} onClick={handleClose}>
//           <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
//             <p style={{ margin: 0 }}>{modalText}</p>

//             <div style={{ marginTop: 16, textAlign: "right" }}>
//               <button onClick={handleClose} style={styles.modalButton}>
//                 Закрыть
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


import { useState } from "react";

export default function App() {
  const [selectedDate, setSelectedDate] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalText, setModalText] = useState("");

  const sendRequest = async () => {
    if (!selectedDate) {
      setModalText("Дата не выбрана");
      setModalOpen(true);
      return;
    }
    try {
      const response = await fetch("http://127.0.0.1:8000/api/load/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: selectedDate }),
      });

      if (!response.ok) {
        setModalText(/*"Ошибка на сервере"*/ "Дата не выбрана");
        setModalOpen(true);
        return;
      }

      // Получение Excel (blob)
      const blob = await response.blob();

      // Создаём URL для скачивания
      const url = window.URL.createObjectURL(blob);

      // Создаем скрытую ссылку
      const a = document.createElement("a");
      a.href = url;
      a.download = `report_${selectedDate}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      // Освободить память
      window.URL.revokeObjectURL(url);

      setModalText("Файл успешно скачан!");
    } catch (error) {
      setModalText("Ошибка соединения с сервером");
    }

    setModalOpen(true);
  };

  const handleClose = () => setModalOpen(false);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Выбор даты</h1>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={styles.input}
        />

        <button type="button" onClick={sendRequest} style={styles.button}>
          Выгрузить
        </button>
      </div>

      {modalOpen && (
        <div style={styles.overlay} onClick={handleClose}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <p style={{ margin: 0 }}>{modalText}</p>

            <div style={{ marginTop: 16, textAlign: "right" }}>
              <button onClick={handleClose} style={styles.modalButton}>
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f3f4f6",
    fontFamily: "Inter, Arial, sans-serif",
  },
  card: {
    width: 360,
    padding: 24,
    borderRadius: 12,
    background: "#fff",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    textAlign: "center",
  },
  title: {
    margin: "0 0 16px 0",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    fontSize: 16,
    boxSizing: "border-box",
  },
  button: {
    marginTop: 16,
    width: "100%",
    padding: "10px 14px",
    borderRadius: 8,
    border: "none",
    background: "#2563eb",
    color: "#fff",
    fontSize: 16,
    cursor: "pointer",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  modal: {
    maxWidth: 420,
    width: "100%",
    background: "#fff",
    padding: 20,
    borderRadius: 10,
    boxShadow: "0 8px 28px rgba(0,0,0,0.18)",
  }
}