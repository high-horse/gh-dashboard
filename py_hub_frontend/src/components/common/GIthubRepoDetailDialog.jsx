import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Button,
  TextField,
  Box,
  Card,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Fragment } from "react";
import { useUI } from "@hooks/useUI";
import api from "@api/axiox";
import CodeIcon from "@mui/icons-material/Code";
import CommitIcon from "@mui/icons-material/Commit";
import EventIcon from "@mui/icons-material/Event";
import PeopleIcon from "@mui/icons-material/People";



export default function GithubRepoDetailDialog({isOpen, onClose, repo, selectedProfile}) {
  const { showLoader, hideLoader, showSnackbar } = useUI();

  const [langs, setLangs] = useState([]);
  const [events , setEvents] = useState([]);
  const [commits, setCommits] = useState([]);
  const [contributors, setContributers] = useState([]);

  const fetchLanguages = async () => {
    if(!repo.id || !repo?.languages_url) return;
    try {
      const response = await api.get(
        `auth/github/repos/basic-api/${selectedProfile}?url=${repo?.languages_url}`
      );
      console.log("repo languages ", response.data);
      // pick only top 3 languages, pick the keys from the response data
      const languages = Object.keys(response.data).slice(0, 3);
      setLangs(languages);
    } catch (error) {
      console.error(error);
    }
  };

  async function fnDummy_docs() {
    const [commits, stats, issues, pulls, events] = await Promise.all([
      api.get(`/repos/${repo.owner.login}/${repo.name}/commits`),
      api.get(`/repos/${repo.owner.login}/${repo.name}/stats/contributors`),
      api.get(`/repos/${repo.owner.login}/${repo.name}/issues?state=all`),
      api.get(`/repos/${repo.owner.login}/${repo.name}/pulls?state=all`),
      api.get(`/repos/${repo.owner.login}/${repo.name}/events`),
    ]);

    const totalCommits = stats.data.reduce((sum, user) => sum + user.total, 0);
    const totalAdditions = stats.data.reduce(
      (sum, user) => sum + user.weeks.reduce((s, w) => s + w.a, 0),
      0
    );
    const totalDeletions = stats.data.reduce(
      (sum, user) => sum + user.weeks.reduce((s, w) => s + w.d, 0),
      0
    );

    console.log({
      commits: totalCommits,
      additions: totalAdditions,
      deletions: totalDeletions,
      issuesOpen: issues.data.filter(i => i.state === "open").length,
      issuesClosed: issues.data.filter(i => i.state === "closed").length,
      pullsOpen: pulls.data.filter(p => p.state === "open").length,
      pullsMerged: pulls.data.filter(p => p.merged_at !== null).length,
      events: events.data.slice(0, 10),
    });
  }

  const fetchEvents = async () => {
    try {
      let eventsUrl = `https://api.github.com/repos/${repo.full_name}/events`
      const response = await api.get(`auth/github/repos/basic-api/${selectedProfile}?url=${eventsUrl}`);
      setEvents(response.data || []);
    } catch (error) {
      console.error("Error fetching repo events:", error);
    }
  }

  const fetchCommits = async() => {
    try {
      let commitsUrl = `https://api.github.com/repos/${repo.full_name}/commits`;
      const response = await api.get(`auth/github/repos/basic-api/${selectedProfile}?url=${commitsUrl}`);
      setCommits(response.data || []);
    } catch (error) {
      console.error("Error fetching repo commits:", error);
    }
  }

  const fetchContributers = async() => {
    try {
      let contributersUrl = `https://api.github.com/repos/${repo.full_name}/stats/contributors`;
      const response = await api.get(`auth/github/repos/basic-api/${selectedProfile}?url=${contributersUrl}`);
      setContributers(response.data || []);

    } catch (error) {
      console.error("Error fetching repo contributers:", error);
    }
  }


  useEffect(() => {
    if(!isOpen || !repo) return;

    fetchLanguages();
    fetchEvents();
    fetchCommits();
    fetchContributers();
  }, [isOpen]); // fetch data when dialog is opened

  return (
    <React.Fragment>
      
      <Dialog fullScreen open={isOpen} onClose={onClose}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2.5,
            py: 1.5,
            bgcolor: "primary.main",
            color: "primary.contrastText",
          }}
        >
          <Typography variant="subtitle1">
            {repo?.name ? `Repository: ${repo.name}` : "Subscribe"}
          </Typography>
          <IconButton onClick={onClose} sx={{ color: "primary.contrastText" }}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <DialogContent dividers>
          {/* Languages Section */}
          <Card   sx={{
            p: 1.5,
            mb: 2,
            borderRadius: 2,
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            bgcolor: "background.paper",
          }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <CodeIcon color="primary" />
              <Typography variant="subtitle1">Top Languages</Typography>
            </Stack>
            <Divider sx={{ my: 1 }} />
            {langs.length > 0 ? (
              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                {langs.map((lang) => (
                  <LanguageItem key={lang} language={lang} />
                ))}
              </Stack>
            ) : (
              <Typography variant="subtitle1">No language data available.</Typography>
            )}
          </Card>

          {/* Commits Section */}
          <Card   sx={{
            p: 1.5,
            mb: 2,
            borderRadius: 2,
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            bgcolor: "background.paper",
          }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <CommitIcon color="secondary" />
              <Typography variant="subtitle1">Recent Commits</Typography>
            </Stack>
            <Divider sx={{ my: 1 }} />
            {commits.length > 0 ? (
              <List dense>
                {commits.slice(0, 5).map((commit) => (
                  <CommitItem key={commit.sha} commit={commit} />
                ))}
              </List>
            ) : (
              <Typography variant="subtitle1">No commits found.</Typography>
            )}
          </Card>

          {/* Events Section */}
          <Card   sx={{
            p: 1.5,
            mb: 2,
            borderRadius: 2,
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            bgcolor: "background.paper",
          }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <EventIcon color="action" />
              <Typography variant="subtitle1">Recent Events</Typography>
            </Stack>
            <Divider sx={{ my: 1 }} />
            {events.length > 0 ? (
              <List dense>
                {events.slice(0, 5).map((event, i) => (
                  <EventItem key={i} event={event} />
                ))}
              </List>
            ) : (
              <Typography variant="subtitle1">No events found.</Typography>
            )}
          </Card>

          {/* Contributors Section */}
          <Card sx={{ p: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <PeopleIcon color="info" />
              <Typography variant="h6">Top Contributors</Typography>
            </Stack>
            <Divider sx={{ my: 1 }} />
            {contributors.length > 0 ? (
              <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap" }}>
                {contributors.slice(0, 5).map((user) => (
                  <ContributorItem key={user.id} user={user} />
                ))}
              </Stack>
            ) : (
              <Typography variant="body2">No contributors found.</Typography>
            )}
          </Card>
        </DialogContent>
        {/* <DialogActions>
        </DialogActions> */}
        
      </Dialog>
    </React.Fragment>
  );
}

// ------

function LanguageItem({ language }) {
  return <Chip label={language} color="primary" variant="outlined" />;
}

function CommitItem({ commit }) {
  const message = commit.commit?.message || "No message";
  const author = commit.commit?.author?.name || "Unknown";
  const url = commit.html_url;

  return (
    <ListItem
      component="a"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      sx={{ textDecoration: "none" }}
    >
      <ListItemAvatar>
        <Avatar>
          <CommitIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={message}
        secondary={`by ${author}`}
        sx={{ wordBreak: "break-word" }}
      />
    </ListItem>
  );
}

function EventItem({ event }) {
  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar>
          <EventIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={`${event.type || "Unknown event"}`}
        secondary={
          event.actor
            ? `by ${event.actor.login} • ${new Date(
                event.created_at
              ).toLocaleString()}`
            : null
        }
      />
    </ListItem>
  );
}

function ContributorItem({ user }) {
  return (
    <Stack
      direction="column"
      alignItems="center"
      spacing={0.5}
      sx={{ minWidth: 80 }}
    >
      <Avatar src={user.avatar_url} alt={user.login} />
      <Typography variant="body2">{user.login}</Typography>
      {user.contributions && (
        <Typography variant="caption" color="text.secondary">
          {user.contributions} commits
        </Typography>
      )}
    </Stack>
  );
}

function CardHeaderCompact({ icon, title, color = "primary" }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      {React.cloneElement(icon, { color })}
      <Typography variant="subtitle1" fontWeight={600}>
        {title}
      </Typography>
    </Stack>
  );
}