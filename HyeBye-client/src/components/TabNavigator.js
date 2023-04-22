import React, { useState } from "react";
import "../css/tab.css";

function TabNavigator({ setTab, tab }) {
  const styles = {
    container: {
      justifyContent: "center",
      alignItems: "center",
    },
    tabNav: {
      width: 100,
      justifyContent: "center",
      alignItems: "center",
      display: "flex",
      flexDirection: "row",
    },
    tabButtons: (tab) => {
      return {
        margin: 10,
        borderBottom: tab == true ? "5px solid #CD3545" : "0px",
        cursor: "pointer",
        borderColor: "#CD3545",
      };
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.tabNav}>
        <div
          onClick={() => setTab("Files")}
          style={styles.tabButtons(tab == "Files")}
        >
          Files
        </div>
        <div
          onClick={() => setTab("Chat")}
          style={styles.tabButtons(tab == "Chat")}
        >
          Chat
        </div>
      </div>
    </div>
  );
}

export default TabNavigator;
