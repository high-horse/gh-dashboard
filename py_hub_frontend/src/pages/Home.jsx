// pages/Home.jsx
import { Typography, Button, Grid, Alert, ButtonGroup, Dialog, DialogTitle, DialogContent, ListItem, ListItemText, Avatar, ListItemAvatar, DialogActions, List } from "@mui/material";
4;
import api from "@api/axiox";
import { useUI } from "@hooks/useUI";
import { useEffect, useState } from "react";
import BasicUserCard from "@components/common/BasicUserCard";
import BasicRepoCard from "@components/common/BasicRepoCard";

export default function Home() {
  const { showLoader, hideLoader, showSnackbar } = useUI();
  const [linked, setLinked] = useState(false);
  const [ghprofile, setGhprofile] = useState([]);
  const [selectedid, setSelectedid] = useState(null);
  const [repos, setRepos] = useState([]);
  const [repopage, setRepopage] = useState(null);
  const [stargazersDialog, setStarsDialog] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [stargazers, setStargazers] = useState([]);

  const handleGithubLink = async (e) => {
    e.preventDefault();
    showLoader();
    try {
      const response = await api.get("/auth/github/login");
      console.log("link response ", response.data.auth_url);
      const { auth_url } = response.data;

      window.location.href = auth_url;
    } catch (error) {
      showSnackbar("Failed to link GitHub account.", "error");
      console.error("Error linking GitHub:", error);
    } finally {
      hideLoader();
    }
  };

  const handleGithubProfiles = async () => {
    try {
      const res = await api.get("/auth/github/profiles");

      if (res.data?.status === false) {
        showSnackbar(res.data.message || "No GitHub account linked.", "error");
        return;
      }
      showSnackbar("Fetched GitHub profile successfully!", "success");
      console.log("fetched profile ", res.data?.data);

      setGhprofile(res.data?.data);
      setLinked(true);
      console.log("set profiles ", ghprofile);
    } catch (error) {
      showSnackbar("Failed to fetch GitHub profile.", "error");
      console.error("Error fetching GitHub profile:", error);
    }
  };

  useEffect(() => {
    if (ghprofile) {
      console.log("updated ghprofile state:", ghprofile);
    }
  }, [ghprofile]);

  useEffect(() => {
    handleGithubProfiles();
  }, []);

  async function handleFetchUsersRepos(id, url = null) {
    if (!id) return;
    showLoader();
    try {
      const queryParam = url ? `?url=${encodeURIComponent(url)}` : '';
      const res = await api.get(`auth/github/repos/${id}${queryParam}`);
      if (res.data.status === false) {
        showSnackbar(res.data.message || "Error Fetching repos.", "error");
        return;
      }
      setRepos(res.data?.repos);
      setRepopage(res.data?.pagination);
      showSnackbar("Fetched GitHub repos successfully!", "success");
    } catch (error) {
      console.error("Error fetching GitHub repos:", error);
      showSnackbar("something went wrong", "error");
    } finally {
      hideLoader();
    }
  }

  useEffect(() => {
    console.log("new repos ", repos);
    
  }, [repos])

  useEffect(() => {
    handleFetchUsersRepos(selectedid, null);
  }, [selectedid]);

  const paginationOrder = ["first", "prev", "next", "last"];
  const labels = {
    first: "« First",
    prev: "‹ Prev",
    next: "Next ›",
    last: "Last »",
  };

  const handleShowStargazers = async(repo) => {
    showLoader();
    try {
      setStargazers([]);
      setSelectedRepo(repo);
      setStarsDialog(true);
      const response = await api.get(`auth/github/repos/basic-api/${selectedid}?url=${repo.stargazers_url}`);
      setStargazers(response.data);

    } catch (error) {
      showSnackbar("Failed to fetch stargazers.", "error");
    } finally{
      hideLoader();
    }
  }

  return (
    <>
      <Typography variant="h4"><span>My Github Dashboard </span> <span><a href=""></a></span></Typography>
      {!linked ? (
        <>
          <Alert severity="warning" variant="outlined" className="">
            You have not linked your github account yet. Please link.
          </Alert>
          <Button variant="outlined" onClick={handleGithubLink}>
            Link Github
          </Button>
        </>
      ) : null}

      {ghprofile && ghprofile.length > 0 && (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {ghprofile.map((profile) => (
            <Grid item xs={12} sm={6} md={4} key={profile.id}>
              <BasicUserCard
                username={profile.username}
                id={profile.id}
                linkedAt={profile.linked_at}
                selected={selectedid === profile.id}
                onSelect={() => setSelectedid(profile.id)}
              />
            </Grid>
          ))}
        </Grid>
      )}
      <hr />
      {repos && repos.length > 0 && (
        <>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {repos.map((repo) => (
              <Grid item xs={12} sm={6} md={4} key={repo.id}>
                <BasicRepoCard id={repo.id} repo={repo} selectedID={selectedid} onShowStargazers={handleShowStargazers}/>
              </Grid>
            ))}
          </Grid>
          <div>
            <ButtonGroup variant="outlined" color="primary" >
              {paginationOrder.map((key) =>
                repopage[key] ? (
                  <Button
                    key={key}
                    onClick={() => (handleFetchUsersRepos(selectedid, repopage[key]) )}
                  >
                    {labels[key]}
                  </Button>
                ) : null
              )}
            </ButtonGroup>
          </div>

          <StargazersDialog isStarsDialogOpen={stargazersDialog} onClose={() => setStarsDialog(false)} repo={selectedRepo} stargazers={stargazers} />

        </>
      )}
    </>
  );
}


const StargazersDialog = ({isStarsDialogOpen, onClose, repo, stargazers}) => {
  return (
    <>
     <Dialog open={isStarsDialogOpen} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>
          Stargazers for {repo?.name}
        </DialogTitle>
        <DialogContent dividers>
          {!stargazers || stargazers.length === 0 ? (
            <Typography>No stargazers yet.</Typography>
          ) : (
            <List>
              {stargazers.map((user) => (
                <ListItem key={user.id} component="a" href={user.html_url} target="_blank">
                  <ListItemAvatar>
                    <Avatar src={user.avatar_url} />
                  </ListItemAvatar>
                  <ListItemText primary={user.login} />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}