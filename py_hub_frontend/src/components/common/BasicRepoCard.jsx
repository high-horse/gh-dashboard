import {
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Stack,
  Chip,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import GitHubIcon from "@mui/icons-material/GitHub";
import LockIcon from "@mui/icons-material/Lock";
import PublicIcon from "@mui/icons-material/Public";
import CodeIcon from "@mui/icons-material/Code";
import ContentCopy from "@mui/icons-material/ContentCopy";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useUI } from "@hooks/useUI";

export default function BasicRepoCard({ id, repo }) {
    const {showSnackbar} = useUI();
    const handleCloneClipboard = async(url) => {
        await navigator.clipboard.writeText(url);
        showSnackbar("Repository clone URL copied to clipboard!", "success");
    };

  return (
    <Box sx={{ minWidth: 275 }}>
      <Card
        variant="outlined"
        sx={{
          maxWidth: 345,
          minWidth: 345,
          minHeight: 200,
          maxHeight: 250,
          borderRadius: 2,
          "&:hover": { boxShadow: 4, transition: "0.3s" },
        }}
      >
        <CardContent>
          {/* Header: Repo name + visibility */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={1}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <GitHubIcon color="action" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {repo.name}
              </Typography>
            </Stack>

            <Chip
              size="small"
              icon={repo.private ? <LockIcon /> : <PublicIcon />}
              label={repo.private ? "Private" : "Public"}
              color={repo.private ? "default" : "success"}
              variant="outlined"
            />
          </Stack>

          {/* Owner */}
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
            by{" "}
            <a
              href={repo.owner.html_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "#1976d2" }}
            >
              {repo.owner.login}
            </a>
          </Typography>

          {/* Description */}
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            {/* {repo.description || "No description provided."} */}
          </Typography>

          {/* Language + Stars + Watchers */}
          <Stack direction="row" spacing={2} alignItems="center">
            {repo.language && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <CodeIcon fontSize="small" color="action" />
                <Typography variant="body2">{repo.language}</Typography>
              </Stack>
            )}
            <Stack direction="row" spacing={0.5} alignItems="center">
              <StarIcon fontSize="small" color="action" />
              <Typography variant="body2">{repo.stargazers_count}</Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <VisibilityIcon fontSize="small" color="action" />
              <Typography variant="body2">{repo.watchers_count}</Typography>
            </Stack>
          </Stack>
        </CardContent>

        <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
          <Button
            size="small"
            variant="flat"
            color={'primary.main'}
            onClick={handleCloneClipboard}
            startIcon={<ContentCopy />}
          >
            Clone
          </Button>
          <Button
            size="small"
            href={repo.html_url}
            target="_blank"
            variant="outlined"
            rel="noopener noreferrer"
          >
            View on GitHub
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}
