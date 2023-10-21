import React, { useState, useEffect } from "react";
import { firebase } from "./config";
import {
  TextField,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Button,
} from "@mui/material";
import "./styles.css";

export default function App() {
  const [linksData, setlinksData] = useState([]);
  const linksDataRef = firebase.firestore().collection("linksData");
  const [addTitle, setAddTitle] = useState();
  const [addUrl, setAddUrl] = useState();
  const [addHover, setAddHover] = useState("");

  useEffect(() => {
    linksDataRef.orderBy("createdAt", "desc").onSnapshot((querySnapshot) => {
      const linksData = [];
      querySnapshot.forEach((doc) => {
        const { title, url } = doc.data();
        linksData.push({
          id: doc.id,
          title,
          url,
        });
      });
      setlinksData(linksData);
      //console.log(users)
    });
  }, []);

  const urlPatternValidation = (URL) => {
    const regex = new RegExp("((http|https)://).*");
    return regex.test(URL);
  };

  // delete a todo from firestore db
  const deletelinksData = (id) => {
    linksDataRef
      .doc(id)
      .delete()
      .then(() => {
        // show a successful alert
        alert("Deleted successfully");
      })
      .catch((error) => {
        // show an error alert
        alert(error);
      });
  };

  // add a todo
  const addlinksData = async () => {
    // check if we have a todo.
    if (addTitle && addTitle.length > 0 && addUrl && addUrl.length > 0) {
      if (urlPatternValidation(addUrl)) {
        // get the timestamp
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        // const url = "https://api.shrtco.de/v2/shorten?url=" + addUrl;
        // const response = await fetch(url);
        // const datas = await response.json();
        // if (datas.ok === true) {
        const data = {
          title: addTitle,
          url: addUrl,
          createdAt: timestamp,
        };
        linksDataRef
          .add(data)
          .then(() => {
            // release todo state
            setAddUrl("");
            setAddTitle("");
          })
          .catch((error) => {
            // show an alert in case of error
            alert(error);
          });
        // } else {
        //   alert(datas.disallowed_reason);
        // }
      } else {
        alert("Invalid Url");
      }
    }
  };

  return (
    <>
      <div className="App">
        <h2>Links Notes</h2>
      </div>
      <div className="App">
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1, width: "100%" },
            width: "90%",
          }}
          noValidate
          autoComplete="off"
        >
          <div>
            <TextField
              label="Title"
              id="outlined-size-small"
              size="small"
              onChange={(e) => setAddTitle(e.target.value)}
              value={addTitle}
            />
          </div>
          <div>
            <TextField
              label="Url"
              id="outlined-size-small"
              size="small"
              onChange={(e) => setAddUrl(e.target.value)}
              value={addUrl}
            />
          </div>
          <div className="button">
            <Button variant="contained" onClick={addlinksData}>
              Add Url
            </Button>
          </div>
        </Box>
      </div>
      <div className="App">
        <Box
          sx={{
            width: "100%",
            maxWidth: "50ch",
          }}
        >
          <List>
            {linksData.map((item) => (
              <ListItem disablePadding key={item.id}>
                <ListItemButton>
                  <ListItemText
                    primary={item.title}
                    secondary={item.url}
                    onClick={() => window.open(item.url, "_blank")}
                  />
                </ListItemButton>
                <Button
                  variant="contained"
                  onClick={() => {
                    deletelinksData(item.id);
                  }}
                >
                  Del
                </Button>
              </ListItem>
            ))}
          </List>
        </Box>
      </div>
    </>
  );
}
