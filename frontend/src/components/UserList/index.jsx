import React, { useEffect, useState } from "react";
import {
  Alert,
  CircularProgress,
  Divider,
  List,
  ListItemButton,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { Link, matchPath, useLocation } from "react-router-dom";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

/**
 * Define UserList, a React component of Project 4.
 */
function UserList() {
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadUsers = async () => {
      try {
        setError("");
        const usersData = await fetchModel("/user/list");
        if (isMounted) {
          setUsers(usersData);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedUserId =
    matchPath("/users/:userId", location.pathname)?.params?.userId ||
    matchPath("/photos/:userId/:photoId", location.pathname)?.params?.userId ||
    matchPath("/photos/:userId", location.pathname)?.params?.userId;

  return (
    <div className="user-list">
      <Typography variant="h6" gutterBottom>
        Users
      </Typography>

      {loading && <CircularProgress size={24} />}

      {!loading && error && (
        <Alert severity="error">Unable to load users: {error}</Alert>
      )}

      {!loading && !error && (
        <List component="nav">
          {users.map((user, index) => (
            <React.Fragment key={user._id}>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to={`/users/${user._id}`}
                  selected={selectedUserId === user._id}
                >
                  <ListItemText
                    primary={`${user.first_name} ${user.last_name}`}
                  />
                </ListItemButton>
              </ListItem>
              {index < users.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      )}
    </div>
  );
}

export default UserList;
