import  React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Stack,
  Chip,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";

export default function BasicUserCard({ username, id, linkedAt, selected, onSelect }) {
  const handleGithubClick = () => {
    window.open(`https://github.com/${username}`, "_blank");
  };

  return (
    <Card
      sx={{
        minWidth: 200,
        p: 2,
        borderRadius: 3,
        boxShadow: selected ? 10 : 3,
        border: 2,
        borderColor: selected ? "primary.main" : "transparent",
        cursor: "pointer",
        "&:hover": {
          boxShadow: 10,
          transform: "translateY(-4px)",
        },
        position: "relative",
      }}
      onClick={onSelect}
    >
      {selected && (
        <Chip
          label="Selected"
          color="primary"
          size="small"
          sx={{ position: "absolute", top: 8, right: 8, fontWeight: 600 }}
        />
      )}

      <CardContent>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar
            alt={username}
            src={`https://github.com/${username}.png`}
            sx={{ width: 56, height: 56 }}
          />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {username}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ID: {id}
            </Typography>
          </Box>
        </Stack>

        <Box mt={2}>
          <Chip
            icon={<GitHubIcon />}
            label="View Profile"
            variant="outlined"
            sx={{
              mt: 1,
              fontWeight: 500,
              "&:hover": { borderColor: "black" },
            }}
            onClick={handleGithubClick}
          />
        </Box>

        {linkedAt && (
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>
            Linked on: {linkedAt}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
